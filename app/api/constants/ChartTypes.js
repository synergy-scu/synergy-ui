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
        verbiage: {
            name: 'LINE',
            toLower: 'line',
            capitalized: 'Line',
        },
        options: new Map([['stacked', 'Stack Chart Members'], ['showAverage', 'Show Average Line'], ['showScale', 'Show Usage Scale'], ['showArea', 'Show Area Under Line']]),
        type: ChartTypes.LINE,
        icon: 'chart line',
    },
    PIE: {
        verbiage: {
            name: 'PIE',
            toLower: 'pie',
            capitalized: 'Pie',
        },
        options: new Map([['donut', 'Display Donut'], ['showUsage', 'Show Member Usage']]),
        type: ChartTypes.PIE,
        icon: 'chart pie',
    },
    BAR: {
        verbiage: {
            name: 'BAR',
            toLower: 'bar',
            capitalized: 'Bar',
        },
        options: new Map([['horizontal', 'Display Bars Horizontally'], ['showPercent', 'Show Percentage'], ['splitBar', 'Split Sub-Members (greoups, etc.)'], ['showScale', 'Show Usage Scale'], ['showAverage', 'Show Average Line']]),
        type: ChartTypes.BAR,
        icon: 'chart bar',
    },
    BURST: {
        verbiage: {
            name: 'BURST',
            toLower: 'burst',
            capitalized: 'Burst',
        },
        options: new Map([['darken', 'Darken Sub-Member Colors']]),
        type: ChartTypes.BURST,
        icon: 'sun',
    },
    NONE: {
        verbiage: {
            name: 'NONE',
            toLower: 'none',
            capitalized: 'None',
        },
        options: new Map(),
        type: ChartTypes.NONE,
        icon: 'ban',
    },
};

export const ExtendedChartOptions = {
    ...ChartOptions,
    ...Object.values(ChartOptions).reduce((options, option) => {
        options[option.type] = option;
        return options;
    }, {}),
};

export const UsageTypes = {
    REALTIME: Symbol('REALTIME'),
    HISTORICAL: Symbol('HISTORICAL'),
    NONE: Symbol('NONE'),
};

export const UsageOptions = {
    REALTIME: {
        verbiage: {
            name: 'REALTIME',
            toLower: 'realtime',
            capitalized: 'Real-Time',
        },
        icon: 'clock',
        type: UsageTypes.REALTIME,
    },
    HISTORICAL: {
        verbiage: {
            name: 'HISTORICAL',
            toLower: 'historical',
            capitalized: 'Historical',
        },
        icon: 'calendar',
        type: UsageTypes.HISTORICAL,
    },
    NONE: {
        verbiage: {
            name: 'NONE',
            toLower: 'none',
            capitalized: 'None',
        },
        icon: 'ban',
        type: UsageTypes.NONE,
    },
};

export const ExtendedUsageOptions = {
    ...UsageOptions,
    ...Object.values(UsageOptions).reduce((options, option) => {
        options[option.type] = option;
        return options;
    }, {}),
};

export const defaultChart = ({ chartID = '', name = '', chartType = ChartTypes.NONE, usageType = UsageTypes.NONE, options = {}, count = 0, members = [], all = false, created = new Date(), updated = new Date() }) => {
    return {
        key: chartID,
        uuid: chartID,
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
