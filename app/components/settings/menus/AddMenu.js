import React from 'react';
import PropTypes from 'prop-types';
import { Segment, Input, Checkbox, Button, Header, Popup, Grid, Menu, Icon } from 'semantic-ui-react';
import { escapeRegExp, filter, debounce, orderBy } from 'lodash';
import memoize from 'memoize-one';
import { isDeepStrictEqual } from 'util';

import { ChartTypes, UsageTypes } from '../../../api/constants/ChartTypes';
import { capitalize } from '../../../api/utils';
import { getSortFunctions } from '../../../api/sort';
import { ChartForm } from '../../cards/sections/ChartForm';

export class AddMenu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',

            search: '',
            filterBy: new Set(),
            selection: new Map(),
            selectedGroups: new Map(),
            selectedDevices: new Map(),

            selectedChart: ChartTypes.NONE,
            chartOptions: {},

            nameError: false,
            selectionError: false,
            isErrorVisible: false,
        };
    }

    static defaultProps = {
        groupType: 'group',
    };

    static propTypes = {
        entities: PropTypes.shape({
            groups: PropTypes.instanceOf(Map).isRequired,
            devices: PropTypes.instanceOf(Map).isRequired,
            channels: PropTypes.instanceOf(Map).isRequired,
        }).isRequired,
        groupType: PropTypes.string.isRequired,
        usageType: PropTypes.oneOf(Object.values(UsageTypes)),
        create: PropTypes.func.isRequired,
    };

    reset = () => {
        this.setState({
            name: '',
            search: '',
            selection: new Map(),
            selectedGroups: new Map(),
            selectedDevices: new Map(),
            selectedChart: ChartTypes.NONE,
            chartOptions: {},
            hideDisabled: false,
        });
    };

    create = () => {
        if (this.props.groupType === 'group') {
            this.props.create({
                name: this.state.name,
                members: this.state.selection,
            });
        } else {
            this.props.create({
                name: this.state.name,
                members: this.state.selection,
                chartType: this.state.selectedChart,
                usageType: this.props.usageType,
                options: this.state.chartOptions,
            });
        }
    };

    onNameChange = (event, { value }) => {
        this.setState({
            name: value,
            nameError: false,
        });
    };

    handleSearch = (event, { value }) => {
        this.setState({
            search: value,
        });
    };

    hideDisabledItems = (event, { checked }) => {
        this.setState({
            hideDisabled: checked,
        });
    };

    changeFilter = (event, { name }) => {
        const types = this.state.filterBy;
        if (types.has(name)) {
            types.delete(name);
        } else {
            types.add(name);
        }

        this.setState({
            filterBy: new Set(types),
        });
    };

    selectItem = (checked, item) => {
        this.setState({ isErrorVisible: false });

        if (checked) {
            if (item.type === 'group') {
                const nextMap = new Map(this.state.selectedGroups);
                nextMap.set(item.uuid, item.extracted);
                this.setState({ selectedGroups: nextMap });
            } else if (item.type === 'device') {
                const nextMap = new Map(this.state.selectedDevices);
                nextMap.set(item.uuid, item.channels);
                this.setState({ selectedDevices: nextMap });
            }

            const nextMap = new Map(this.state.selection);
            nextMap.set(item.uuid, item.type);
            this.setState({ selection: nextMap });
        } else {
            if (item.type === 'group') {
                const nextMap = new Map(this.state.selectedGroups);
                nextMap.delete(item.uuid);
                this.setState({ selectedGroups: nextMap });
            } else if (item.type === 'device') {
                const nextMap = new Map(this.state.selectedDevices);
                nextMap.delete(item.uuid);
                this.setState({ selectedDevices: nextMap });
            }

            const nextMap = new Map(this.state.selection);
            nextMap.delete(item.uuid);
            this.setState({ selection: nextMap });
        }
    };

    onSelectChart = (event, { value }) => {
        if (value === '') {
            this.setState({
                selectedChart: ChartTypes.NONE,
                chartOptions: {},
            });
        } else {
            this.setState({
                selectedChart: ChartTypes[value],
                chartOptions: {},
            });
        }
    };

    onCheckChartOption = (event, { option, checked }) => {
        const chartOptions = {
            ...this.state.chartOptions,
            [option]: checked,
        };

        if (!checked) {
            delete chartOptions[option];
        }

        this.setState({
            chartOptions,
        });
    };

    isMatch = (types, value) => result => {
        const re = new RegExp(escapeRegExp(value), 'i');
        if (value.length && types.size) {
            return re.test(result.name) && Boolean(result.name) && types.has(result.type);
        } else if (value.length) {
            return re.test(result.name) && Boolean(result.name);
        }
        return re.test(result.name);
    };

    filterItems = memoize((types, value, items) => {
        const sortFunctions = getSortFunctions(['name', 'created']);
        const sortDirections = ['ASC', 'DESC'];

        let filtered = filter(items, this.isMatch(types, value));
        if (types.size) {
            filtered = filter(filtered, item => types.has(item.type));
        }
        return orderBy(filtered, sortFunctions, sortDirections);
    }, isDeepStrictEqual);

    render() {
        let items = [];
        const entities = ['group', 'device', 'channel'];
        const caps = capitalize(this.props.groupType);
        const isForGroups = this.props.groupType === 'group';

        entities.forEach(entity => {
            const selector = `${entity}s`;
            let nextEntity = [...this.props.entities[selector].values()].map(item => {
                return {
                    ...item,
                    uuid: item[`${entity}ID`],
                    type: entity,
                };
            });

            if (entity === 'channel') {
                nextEntity = orderBy(nextEntity, getSortFunctions(['deviceID']), ['ASC']);
            }

            items = items.concat(nextEntity);
        });

        const filtered = this.filterItems(this.state.filterBy, this.state.search, items);

        const disabledItems = new Set();
        filtered.forEach(item => {
            this.state.selectedDevices.forEach(channels => {
                if (channels.has(item.uuid)) {
                    disabledItems.add(item.uuid);
                }
            });
            this.state.selectedGroups.forEach(member => {
                if (member.has(item.uuid)) {
                    disabledItems.add(item.uuid);
                }
            });
        });

        const isError = this.state.nameError || this.state.selectionError;
        const isErrorVisible = isError && this.state.isErrorVisible;
        const errorContent = [];
        if (this.state.nameError) {
            errorContent.push({ type: 'name', message: `${caps} names must be at least 3 characters long and contain no special characters` });
        }
        if (this.state.selectionError) {
            errorContent.push({ type: 'selection', message: `You must select at least one ${this.props.groupType} member. Select ${this.props.groupType} members below` });
        }

        const isGroupDisabled = this.state.name.length < 3
            || !this.state.selection.size
            || this.state.selection.size === 1 && this.state.selectedGroups.size === 1;
        const isChartDisabled = !this.state.selection.size
            || !this.state.name.length
            || this.state.selectedChart === ChartTypes.NONE;

        return (
            <Grid>
                <Grid.Column width={isForGroups ? 5 : 4} className='squarify'>
                    <Menu vertical fluid>
                        <Menu.Item>
                            <Input transparent
                                icon="search"
                                placeholder="Search..."
                                value={this.state.search}
                                onChange={debounce(this.handleSearch, 500, { leading: true })}
                                style={{ marginBottom: 0, borderBottom: 'none' }} />
                        </Menu.Item>
                        <Menu.Item>
                            <Checkbox style={{ float: 'right' }} checked={this.state.hideDisabled} onChange={this.hideDisabledItems} />
                            Hide Disabled Items
                        </Menu.Item>
                        <Menu.Item>
                            Filter By
                            <Menu.Menu>
                                <Menu.Item name='group' active={this.state.filterBy.has('group')} onClick={this.changeFilter}>
                                    {this.state.filterBy.has('group') && <Icon name='checkmark' />}
                                    Group
                                </Menu.Item>
                                <Menu.Item name='device' active={this.state.filterBy.has('device')} onClick={this.changeFilter}>
                                    {this.state.filterBy.has('device') && <Icon name='checkmark' />}
                                    Device
                                </Menu.Item>
                                <Menu.Item name='channel' active={this.state.filterBy.has('channel')} onClick={this.changeFilter}>
                                    {this.state.filterBy.has('channel') && <Icon name='checkmark' />}
                                    Channel
                                </Menu.Item>
                            </Menu.Menu>
                        </Menu.Item>
                    </Menu>
                    {
                        this.props.groupType === 'group' &&
                            <Segment>
                                <Input fluid placeholder={`${caps} Name`} value={this.state.name} error={this.state.nameError} onChange={this.onNameChange} />
                                <span className='secondary' style={{ marginLeft: '0.5em' }}>Names must be at least 3 characters long</span>
                                <Popup
                                    open={isErrorVisible}
                                    disabled={!isErrorVisible}
                                    trigger={
                                        <Button fluid
                                            disabled={isGroupDisabled}
                                            content={`Create ${caps}`}
                                            positive={!isErrorVisible}
                                            negative={isErrorVisible}
                                            onClick={this.create}
                                            style={{ marginTop: '1em' }} />}
                                    content={errorContent.map(item =>
                                        <p key={item.type}>{item.message}</p>
                                    )} />
                            </Segment>
                    }
                </Grid.Column>
                <Grid.Column width={isForGroups ? 11 : 7} className='squarify'>
                    <Segment className="add-menu">
                        <Header content={`Select ${caps} Members`} className='has-help-text' />
                        <span className='secondary' style={{ display: 'block' }}>You must select at least 1 item</span>
                        { this.props.groupType === 'group' && <span className='secondary help-text'>The sole member of a group cannot be another group</span> }
                        <Segment.Group>
                            {filtered.map(item => {
                                const isDisabled = disabledItems.has(item.uuid);
                                if (isDisabled && this.state.hideDisabled) {
                                    return null;
                                }

                                const _selectItem = (event, { checked }) => this.selectItem(checked, item);

                                return (
                                    <Segment key={item.uuid} disabled={isDisabled} className="element">
                                        <span>{item.name ? item.name : `Unnamed ${capitalize(item.type)}`}<span className='secondary'>{item.type}</span></span>
                                        <Checkbox toggle disabled={isDisabled} checked={this.state.selection.has(item.uuid)} onChange={_selectItem} />
                                    </Segment>
                                );
                            })}
                        </Segment.Group>
                    </Segment>
                </Grid.Column>
                {
                    !isForGroups &&
                        <Grid.Column width={5} className='squarify'>
                            <Segment>
                                <ChartForm
                                    name={this.state.name}
                                    selected={this.state.selectedChart}
                                    options={this.state.chartOptions}
                                    onNameChange={this.onNameChange}
                                    onSelectChart={this.onSelectChart}
                                    onCheckChartOption={this.onCheckChartOption}
                                    isSubmitDisabled={isChartDisabled}
                                    onSubmit={this.create} />
                            </Segment>
                        </Grid.Column>
                }
            </Grid>
        );
    }
}
