import React from 'react';
import PropTypes from 'prop-types';
import { Segment, Input, Checkbox, Button, Header, Popup, Container } from 'semantic-ui-react';
import { escapeRegExp, isEqual, filter, debounce } from 'lodash';
import memoize from 'memoize-one';

import { capitalize } from '../../../api/utils';
import { sortByStringProperty } from '../../../api/sort';

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
            selectionValidationError: false,
            isErrorVisible: false,
        };
    }

    static propTypes = {
        entities: PropTypes.shape({
            groups: PropTypes.instanceOf(Map).isRequired,
            devices: PropTypes.instanceOf(Map).isRequired,
            channels: PropTypes.instanceOf(Map).isRequired,
        }).isRequired,
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
            selectionValidationError: false,
            isErrorVisible: false,
        });
    };

    validateGroup = () => {
        let valid = true;

        this.setState({
            nameError: false,
            selectionError: false,
            selectionValidationError: false,
            isErrorVisible: false,
        });

        if (this.state.name.length <= 3) {
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
        } else if (this.state.selection.size === 1 && this.state.selectedGroups.size === 1) {
            this.setState({ selectionValidationError: true });
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

    isMatch = value => result => {
        const re = new RegExp(escapeRegExp(value), 'i');
        if (value.length) {
            return re.test(result.name) && Boolean(result.name);
        }
        return re.test(result.name);
    };

    filterItems = memoize((value, items) => filter(items, this.isMatch(value)), isEqual);

    render() {
        const entities = ['group', 'device', 'channel'];
        let items = [];
        entities.forEach(entity => {
            const selector = `${entity}s`;
            const newItems = [...this.props.entities[selector].values()].map(item => {
                return {
                    ...item,
                    uuid: item[`${entity}ID`],
                    type: entity,
                };
            });

            if (entity === 'channel') {
                newItems.sort(sortByStringProperty('deviceID'));
            }

            items = items.concat(newItems);
        });
        const filtered = this.filterItems(this.state.search, items);

        const disabledItems = new Set();
        filtered.forEach(item => {
            this.state.selectedDevices.forEach(channels => {
                if (channels.has(item.uuid)) {
                    disabledItems.add(item.uuid);
                }
            });
            this.state.selectedGroups.forEach(channels => {
                if (channels.has(item.uuid)) {
                    disabledItems.add(item.uuid);
                }
            });
        });

        const isError = this.state.nameError || this.state.selectionError || this.state.selectionValidationError;
        const isErrorVisible = isError && this.state.isErrorVisible;
        const errorContent = [];
        if (this.state.nameError) {
            errorContent.push({ type: 'name', message: 'Group names must be at least 3 characters long and contain no special characters' });
        }
        if (this.state.selectionError) {
            errorContent.push({ type: 'selection', message: 'You must select at least one group member. Select group members below' });
        }
        if (this.state.selectionValidationError) {
            errorContent.push({ type: 'validation', message: 'The sole member of a group cannot be another group' });
        }

        return (
            <Container text className="add-menu">
                <Header>Select Group Members</Header>
                <Segment basic className="heading">
                    <Input transparent icon="search" placeholder="Search..." value={this.state.search} onChange={debounce(this.handleSearch, 500, { leading: true })} />
                    <Popup
                        open={isErrorVisible}
                        disabled={!isErrorVisible}
                        trigger={<Input placeholder="Group Name" value={this.state.name} error={this.state.nameError} onChange={this.onNameChange} action={<Button content="Create Group" positive={!isErrorVisible} negative={isErrorVisible} onClick={this.createGroup} />} />}
                        content={errorContent.map(item =>
                            <p key={item.type}>{item.message}</p>
                        )}
                    />
                </Segment>
                <Segment.Group>
                    {filtered.map(item => {
                        const isDisabled = disabledItems.has(item.uuid);
                        const _selectItem = (event, { checked }) => this.selectItem(checked, item);

                        return (
                            <Segment key={item.uuid} disabled={isDisabled} className="element">
                                <span>{item.name ? item.name : `Unnamed ${capitalize(item.type)}`}<span className='secondary'>{item.type}</span></span>
                                <Checkbox toggle disabled={isDisabled} checked={this.state.selection.has(item.uuid)} onChange={_selectItem} />
                            </Segment>
                        );
                    })}
                </Segment.Group>
            </Container>
        );
    }
}
