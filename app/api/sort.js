import { get } from 'lodash';

export const sortByStringProperty = property => (entityA, entityB) =>
    get(entityA, property, '').toLowerCase().localeCompare(get(entityB, property, '').toLowerCase());
