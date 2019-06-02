import Actions from '../actions';

const loggerMiddleware = store => next => action => {
    console.log(action);
    if (action.type !== Actions.STREAM_RESULT) {
        // console.log(action);
    }
    return next(action);
};

export default loggerMiddleware;
