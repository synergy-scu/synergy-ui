import React from 'react';
import PropTypes from 'prop-types';
import { Search, Input } from 'semantic-ui-react';
import { escapeRegExp, reduce, filter, debounce } from 'lodash';

import SettingsTabContainer from './SettingsTabContainer';

export class GlobalSearch extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: '',
            results: [],
            isLoading: false,
        };
    }

    static propTypes = {
        entities: PropTypes.shape({
            groups: PropTypes.instanceOf(Map).isRequired,
            devices: PropTypes.instanceOf(Map).isRequired,
            channels: PropTypes.instanceOf(Map).isRequired,
        }).isRequired,
        selectSearchResult: PropTypes.func.isRequired,
    };

    handleSearch = (event, { value }) => {
        this.setState({ isLoading: true, value });

        setTimeout(() => {
            if (!value.length) {
                this.setState({
                    isLoading: false,
                    results: [],
                });
                return;
            }

            const re = new RegExp(escapeRegExp(value), 'i');
            const isMatch = result => re.test(result.name) && Boolean(result.name);

            const filteredResults = reduce(
                this.props.entities,
                (accumulator, map, entity) => {
                    const results = filter([...map.values()], isMatch).map(item => {
                        const entityType = entity.substring(0, entity.length - 1);
                        return {
                            title: item.name,
                            uuid: item[`${entityType}ID`],
                            entity: entityType,
                        };
                    });
                    if (results.length) {
                        accumulator[entity] = {
                            name: entity,
                            results,
                        };
                    }
                    return accumulator;
                },
                {}
            );

            this.setState({
                isLoading: false,
                results: filteredResults,
            });
        }, 300);
    };

    selectSearchResult = (event, { result }) => {
        this.setState({
            value: '',
            results: [],
        });
        this.props.selectSearchResult(result);
    };

    render() {
        return (
            <div className="menu right">
                <Search
                    category
                    as={Input}
                    placeholder="Search..."
                    loading={this.state.isLoading}
                    onResultSelect={this.selectSearchResult}
                    onSearchChange={debounce(this.handleSearch, 500, { leading: true })}
                    results={this.state.results}
                    value={this.state.value}
                />
            </div>
        );
    }
}

export default SettingsTabContainer(GlobalSearch);
