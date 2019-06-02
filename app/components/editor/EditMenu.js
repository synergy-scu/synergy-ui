import React from 'react';
import PropTypes from 'prop-types';
import { Segment, Input, Checkbox, Button, Header, Popup, Grid, Menu, Icon } from 'semantic-ui-react';
import { escapeRegExp, filter, debounce, orderBy, capitalize, get } from 'lodash';
import memoize from 'memoize-one';
import { isDeepStrictEqual } from 'util';

import { ChartTypes, UsageTypes } from '../../api/constants/ChartTypes';
import { getSortFunctions } from '../../api/sort';
import { ChartForm } from '../cards/sections/ChartForm';

export class EditMenu extends React.Component {
    constructor(props) {
        super(props);

        const members = get(this.props, 'chart.members', []);

        this.state = {
            search: '',
            filterBy: new Set(),

            name: get(this.props, 'chart.name', ''),
            selection: new Map(members.length ? members.map(member => [member.uuid, member.type]) : new Map()),
            selectedGroups: new Map(
                members.length
                    ? members.filter(member => member.type === 'group')
                        .map(member => {
                            const item = this.props.entities.groups.get(member.uuid);
                            return [member.uuid, item.extracted];
                        })
                    : new Map()
            ),
            selectedDevices: new Map(
                members.length
                    ? members.filter(member => member.type === 'device')
                        .map(member => {
                            const item = this.props.entities.devices.get(member.uuid);
                            return [member.uuid, item.extracted];
                        })
                    : new Map()
            ),
            selectedChart: get(this.props, 'chart.chartType', ChartTypes.NONE),
            chartOptions: get(this.props, 'chart.options', {}),
            startDate: get(this.props, 'chart.options.startDate', null),
            endDate: get(this.props, 'chart.options.endDate', null),
        };
    }

    static defaultProps = {
        isModal: false,
        groupType: 'group',
        menuType: 'create',
        uuid: '',
    };

    static propTypes = {
        isModal: PropTypes.bool,
        uuid: PropTypes.string,
        chart: PropTypes.shape({
            key: PropTypes.string.isRequired,
            chartID: PropTypes.string.isRequired,
            name: PropTypes.string,
            chartType: PropTypes.oneOf(Object.values(ChartTypes)).isRequired,
            usageType: PropTypes.oneOf(Object.values(UsageTypes)).isRequired,
            options: PropTypes.object,
            count: PropTypes.number.isRequired,
            members: PropTypes.arrayOf(PropTypes.shape({
                chartID: PropTypes.string.isRequired,
                uuid: PropTypes.string.isRequired,
                type: PropTypes.oneOf(['channel', 'device', 'group']).isRequired,
                added: PropTypes.instanceOf(Date).isRequired,
            })).isRequired,
            all: PropTypes.bool.isRequired,
            created: PropTypes.instanceOf(Date).isRequired,
            updated: PropTypes.instanceOf(Date).isRequired,
        }),
        entities: PropTypes.shape({
            groups: PropTypes.instanceOf(Map).isRequired,
            devices: PropTypes.instanceOf(Map).isRequired,
            channels: PropTypes.instanceOf(Map).isRequired,
            charts: PropTypes.instanceOf(Map).isRequired,
        }).isRequired,
        groupType: PropTypes.oneOf(['group', 'chart']).isRequired,
        menuType: PropTypes.oneOf(['create', 'update']).isRequired,
        usageType: PropTypes.oneOf(Object.values(UsageTypes)),
        submit: PropTypes.func.isRequired,
        toggleModal: PropTypes.func,
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

    submit = () => {
        if (this.props.isModal) {
            this.props.toggleModal();
        }

        if (this.props.groupType === 'group') {
            if (this.props.menuType === 'create') {
                this.props.submit({
                    name: this.state.name,
                    members: this.state.selection,
                });
            } else if (this.props.menuType === 'update') {
                this.props.submit({
                    groupID: this.props.uuid,
                    name: this.state.name,
                    members: this.state.selection,
                });
            }
        } else if (this.props.groupType === 'chart') {
            if (this.props.menuType === 'create') {
                this.props.submit({
                    name: this.state.name,
                    members: this.state.selection,
                    chartType: this.state.selectedChart,
                    usageType: this.props.usageType,
                    options: this.state.chartOptions,
                    startDate: this.state.startDate,
                    endDate: this.state.endDate,
                });
            } else if (this.props.menuType === 'update') {
                this.props.submit({
                    chartID: this.props.uuid,
                    name: this.state.name,
                    members: this.state.selection,
                    chartType: this.state.selectedChart,
                    usageType: this.props.usageType,
                    options: this.state.chartOptions,
                    startDate: this.state.startDate,
                    endDate: this.state.endDate,
                });
            }
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
                nextMap.set(item.uuid, item.extracted);
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

    onDateChange = ({ startDate, endDate }) => {
        this.setState({
            startDate,
            endDate,
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

        const isGroupDisabled = this.state.name.length < 3
            || !this.state.selection.size
            || this.state.selection.size === 1 && this.state.selectedGroups.size === 1;
        let isChartDisabled = this.state.name.length < 3
            || !this.state.selection.size
            || this.state.selectedChart === ChartTypes.NONE;

        isChartDisabled = this.props.usageType === UsageTypes.HISTORICAL ? isChartDisabled || !this.state.startDate && !this.state.endDate : isChartDisabled;

        // console.log(!this.state.selection.size, this.state.name.length < 3, this.state.selectedChart === ChartTypes.NONE, !this.state.startDate, !this.state.endDate);
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
                                <Button fluid
                                    color='green'
                                    disabled={isGroupDisabled}
                                    content={`Create ${caps}`}
                                    onClick={this.submit}
                                    style={{ marginTop: '1em' }} />
                            </Segment>
                    }
                </Grid.Column>
                <Grid.Column width={isForGroups ? 11 : 7} className='squarify'>
                    <Segment className="add-menu">
                        <Header content={`Select ${caps} Members`} className='no-margin-bottom' />
                        <span className='secondary block-span'>You must select at least 1 item</span>
                        { this.props.groupType === 'group' && <span className='secondary block-span margin-bottom'>The sole member of a group cannot be another group</span> }
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
                                    isModal={this.props.isModal}
                                    menuType={this.props.menuType}
                                    usageType={this.props.usageType}
                                    name={this.state.name}
                                    selected={this.state.selectedChart}
                                    options={this.state.chartOptions}
                                    startDate={this.state.startDate}
                                    endDate={this.state.endDate}
                                    onNameChange={this.onNameChange}
                                    onSelectChart={this.onSelectChart}
                                    onCheckChartOption={this.onCheckChartOption}
                                    onDateChange={this.onDateChange}
                                    isSubmitDisabled={isChartDisabled}
                                    onSubmit={this.submit} />
                            </Segment>
                        </Grid.Column>
                }
            </Grid>
        );
    }
}
