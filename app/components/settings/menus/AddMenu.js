import React from 'react';
import PropTypes from 'prop-types';
import { Segment, Input, Checkbox, Button, Header, Popup, Grid, Menu, Icon } from 'semantic-ui-react';
import { escapeRegExp, filter, debounce, orderBy } from 'lodash';
import memoize from 'memoize-one';
import { isDeepStrictEqual } from 'util';

import { capitalize } from '../../../api/utils';
import { getSortFunctions } from '../../../api/sort';

export class AddMenu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            nameError: false,
            search: '',
            selection: new Map(),
            selectedGroups: new Map(),
            selectedDevices: new Map(),
            selectionError: false,
            isErrorVisible: false,
            filterBy: new Set(),
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
    };

    reset = () => {
        this.setState({
            name: '',
            nameError: false,
            search: '',
            selection: new Map(),
            selectedGroups: new Map(),
            selectedDevices: new Map(),
            selectionError: false,
            isErrorVisible: false,
            hideDisabled: false,
        });
    };

    validateGroup = () => {
        let valid = true;

        this.setState({
            nameError: false,
            selectionError: false,
            isErrorVisible: false,
        });

        if (this.state.name.length < 3) {
            this.setState({ nameError: true });
            valid = false;
        }

        const re = new RegExp(escapeRegExp(this.state.name));
        if (re.test(this.state.value)) {
            this.setState({ nameError: true });
            valid = false;
        }

        if (this.state.selection.size === 0) {
            this.setState({ selectionError: true });
            valid = false;
        }

        return valid;
    };

    createGroup = () => {
        if (this.validateGroup()) {
            console.log('ADD_GROUP', this.state.name, this.state.selection);
            this.reset();
        } else {
            this.setState({ isErrorVisible: true });
            setTimeout(() => {
                this.setState({ isErrorVisible: false });
            }, 7000);
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
    }

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

        return (
            <Grid>
                <Grid.Column width={5} className='squarify'>
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
                </Grid.Column>
                <Grid.Column width={11} className='squarify'>
                    <Segment className="add-menu">
                        <Header content={`Select ${caps} Members`} />
                        <Segment basic className="heading">
                            <Input placeholder={`${caps} Name`} value={this.state.name} error={this.state.nameError} onChange={this.onNameChange} />
                            <Popup
                                open={isErrorVisible}
                                disabled={!isErrorVisible}
                                trigger={<Button content={`Create ${caps}`} positive={!isErrorVisible} negative={isErrorVisible} onClick={this.createGroup} />}
                                content={errorContent.map(item =>
                                    <p key={item.type}>{item.message}</p>
                                )}
                            />
                        </Segment>
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
                        <Button content={`Create ${caps}`} fluid positive={!isErrorVisible} negative={isErrorVisible} onClick={this.createGroup} />
                    </Segment>
                </Grid.Column>
            </Grid>
        );
    }
}
