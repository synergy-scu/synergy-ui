import { last, round } from 'lodash';

export const pieChartReal = (results, names, isGrouped = false) => {
    const key = isGrouped ? 'members' : 'channels';
    const lastResult = last(results);

    const total = [...lastResult[key].values()].reduce((acc, amperage) => acc + amperage, 0);
    if (total === 0) {
        return [
            {
                id: 'empty',
                label: 'empty',
                value: 100,
            },
        ];
    }

    return [...lastResult[key].entries()].map(([uuid, amperage]) => {
        return {
            id: uuid,
            label: names.get(uuid),
            value: round(amperage / total, 2),
        };
    });
};

export const pieChartHistory = (results, names, isGrouped = false) => {
    const key = isGrouped ? 'members' : 'channels';
    const totals = {};
    results.forEach(entry => {
        entry[key].forEach((amperage, uuid) => {
            totals[uuid] = (totals[uuid] || 0) + amperage;
        });
    });
    const total = Object.values(totals).reduce((acc, value) => acc + value, 0);
    if (Object.values(totals).every(value => value === 0)) {
        return [
            {
                id: 'empty',
                label: 'empty',
                value: 100,
            },
        ];
    }

    return Object.entries(totals).map(([uuid, value]) => {
        return {
            id: uuid,
            label: names.get(uuid),
            value: round(value / total, 2),
        };
    });
};
