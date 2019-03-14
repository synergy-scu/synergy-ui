import { get } from 'lodash';

export const sortByStringProperty = property => (entityA, entityB) =>
    get(entityA, property, '').toLowerCase().localeCompare(get(entityB, property, '').toLowerCase());

export const sortByNumericProperty = property => (entityA, entityB) =>
    get(entityA, property, 0) > get(entityB, property, 0) ? 1 : -1;
