import React from 'react';
import PropTypes from 'prop-types';
import { Segment, Input } from 'semantic-ui-react';
import { escapeRegExp, isEqual, filter, debounce } from 'lodash';
import memoize from 'memoize-one';

import { capitalize } from '../../../api/utils';

export class EntityMenu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            search: '',
        };
    }

    static propTypes = {
        entityType: PropTypes.oneOf(['group', 'device', 'channel']).isRequired,
        activeItem: PropTypes.string.isRequired,
        items: PropTypes.instanceOf(Map).isRequired,
        setActiveItem: PropTypes.func.isRequired,
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
        const filtered = this.filterItems(this.state.search, [...this.props.items.values()]);

        return (
            <React.Fragment>
                <Input fluid
                    icon='search'
                    placeholder='Search...'
                    value={this.state.search}
                    onChange={debounce(this.handleSearch, 500, { leading: true })} />
                <Segment.Group>
                    {
                        filtered.map(item => {
                            const itemID = item[`${this.props.entityType}ID`];
                            const isActive = itemID === this.props.activeItem;
                            const _setActive = () => this.props.setActiveItem(itemID);
                            return (
                                <Segment
                                    key={itemID}
                                    onClick={_setActive}
                                    inverted={isActive}
                                    color={isActive ? 'green' : null}
                                    content={item.name ? item.name : `Unnamed ${capitalize(this.props.entityType)}`}
                                />
                            );
                        })
                    }
                </Segment.Group>
            </React.Fragment>
        );
    }
}
