export const lineChart = (chartID, results, maxPoints, isGrouped = false) => {
    const key = isGrouped ? 'members' : 'channels';
    const slicedResults = results.length > maxPoints ? results.slice(results.length - maxPoints) : results;
    return [
        {
            id: chartID,
            data: slicedResults.map(entry => {
                const amperage = [...entry[key].values()].reduce((total, amp) => total + amp, 0);
                return {
                    x: entry.time.valueOf(),
                    y: amperage,
                };
            }),
        },
    ];
};

export const stackedLineChart = (results, maxPoints, isGrouped = true) => {
    if (!results.length) {
        return [];
    }

    const key = isGrouped ? 'members' : 'channels';
    const slicedResults = results.length > maxPoints ? results.slice(results.length - maxPoints) : results;
    const members = {};

    slicedResults.forEach(entry => {
        entry[key].forEach((amperage, uuid) => {
            if (!members.hasOwnProperty(uuid)) {
                members[uuid] = [];
            }

            members[uuid].push({
                x: entry.time.valueOf(),
                y: amperage,
            });
        });
    });

    return Object.entries(members).map(([uuid, data]) => {
        return {
            id: uuid,
            data,
        };
    });
};
