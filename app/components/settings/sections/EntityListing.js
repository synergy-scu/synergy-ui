import React from 'react';
import PropTypes from 'prop-types';
import { Segment, Icon, Divider, Input } from 'semantic-ui-react';
import { escapeRegExp, isEqual, filter, debounce } from 'lodash';
import memoize from 'memoize-one';

import { capitalize } from '../../../api/utils';

export class EntityListing extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            search: '',
        };
    }

    static defaultProps = {
        activeItem: '',
        changeActiveItem: () => null,
    };

    static propTypes = {
        entityType: PropTypes.string.isRequired,
        items: PropTypes.arrayOf(
            PropTypes.shape({
                uuid: PropTypes.string,
                name: PropTypes.string,
                type: PropTypes.oneOf(['group', 'device', 'channel']),
            })
        ).isRequired,
        activeItem: PropTypes.string,
        changeActiveItem: PropTypes.func,
        viewUsage: PropTypes.func,
        editNotifications: PropTypes.func,
        editItem: PropTypes.func,
    };

    handleSearch = (event, { value }) => {
        this.setState({
            search: value,
        });
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
        const filtered = this.filterItems(this.state.search, this.props.items);
        return (
            <React.Fragment>
                <Input transparent
                    icon='search'
                    placeholder='Search...'
                    value={this.state.search}
                    onChange={debounce(this.handleSearch, 500, { leading: true })} />
                <div className='entity-listing'>
                    {
                        filtered.map((item, idx) => {
                            const _changeActiveItem = () => this.props.changeActiveItem(item.uuid);
                            const isActive = this.props.activeItem === item.uuid;
                            return (
                                <React.Fragment key={item.uuid}>
                                    <Segment basic className='listing' onClick={_changeActiveItem} color={isActive ? 'olive' : null} inverted={isActive}>
                                        <span>
                                            <Icon name='power' color='grey' />
                                            {item.name || `Unnamed ${capitalize(this.props.entityType)}`}
                                        </span>
                                        <span>
                                            <Icon link name='tachometer alternate' onClick={this.props.viewUsage} />
                                            <Icon link name='bell' onClick={this.props.editNotifications} />
                                            <Icon link name='edit' onClick={this.props.editItem} />
                                        </span>
                                    </Segment>
                                    {idx !== filtered.length - 1 && <Divider />}
                                </React.Fragment>
                            );
                        })
                    }
                </div>
            </React.Fragment>
        );
    }
}
