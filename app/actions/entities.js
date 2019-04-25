import Actions from './types';

export const extractChannels = (groups, devices) => {
    return {
        type: Actions.EXTRACT_CHANNELS,
        payload: {
            groups,
            devices,
        },
    };
};

export const extractAllChannels = () => {
    return {
        type: Actions.EXTRACT_ALL_CHANNELS,
    };
};
