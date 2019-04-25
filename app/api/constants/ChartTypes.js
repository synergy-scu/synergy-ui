export const DisplayTypes = {
    CUMULATIVE: Symbol('CUMULATIVE'),
    PERCENT: Symbol('PERCENT'),
    AVG: Symbol('AVG'),
    STACKED: Symbol('STACKED'),
};

export const ChartTypes = {
    LINE: Symbol('LINE'),
    PIE: Symbol('PIE'),
    BAR: Symbol('BAR'),
    BURST: Symbol('BURST'),
    NONE: Symbol('NONE'),
};

export const ChartOptions = {
    LINE: {
        type: ChartTypes.LINE,
        options: new Set([DisplayTypes.STACKED]),
    },
    PIE: {
        type: ChartTypes.PIE,
        options: new Set([DisplayTypes.TOTAL, DisplayTypes.PERCENT, DisplayTypes.AVG]),
    },
    BAR: {
        type: ChartTypes.BAR,
        options: new Set([DisplayTypes.TOTAL, DisplayTypes.PERCENT, DisplayTypes.AVG]),
    },
    BURST: {
        type: ChartTypes.BURST,
        options: new Set(),
    },
};

export const UsageTypes = {
    REALTIME: Symbol('REALTIME'),
    HISTORICAL: Symbol('HISTORICAL'),
    NONE: Symbol('NONE'),
};

export const defaultChart = ({ key = '', chartID = '', name = '', chartType = ChartTypes.NONE, usageType = UsageTypes.NONE, options = {}, count = 0, members = [], all = false, created = new Date(), updated = new Date() }) => {
    return {
        key,
        chartID,
        name,
        chartType,
        usageType,
        options,
        count,
        members,
        all,
        created,
        updated,
    };
};
