import Actions from './types';

export const extractChannels = groups => {
    return {
        type: Actions.EXTRACT_CHANNELS,
        payload: {
            groups,
        },
    };
};

export const extractAllChannels = () => {
    return {
        type: Actions.EXTRACT_ALL_CHANNELS,
    };
};
