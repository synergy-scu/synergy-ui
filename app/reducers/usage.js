import Actions from '../actions';
import { reduce, round } from 'lodash';

const getDeviceCurrent = device =>
    reduce(device, (total, current, key) => {
        if (key.substring(0, 2) === 'ch' && current) {
            return total + current;
        }
        return total;
    }, 0);

export const cumulative = (state = [], action) => {
    const nextState = [...state];
    switch (action.type) {
        case Actions.USAGE_SUCCESS:
            action.payload.data.currents.forEach(device => {
                if (state.length > 60) {
                    nextState.shift();
                }

                nextState.push({
                    x: device.time,
                    // Total Current * 120V * 24h = Wh / 1000 = kWh
                    y: round(getDeviceCurrent(device) * 120 * 24 / 1000, 3),
                });
            });
            return nextState;
        default:
            return state;
    }
};

