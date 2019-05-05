import { connect } from 'react-redux';
import { withAxios } from 'react-axios';

import ActionCreators from '../../actions';

export const mapState = state => {
    return {
        entities: state.entities,
        activeGroup: state.activeGroup,
        activeDevice: state.activeDevice,
        activeChannel: state.activeChannel,
    };
};

export const mapDispatch = dispatch => {
    return {
        selectSearchResult: result => dispatch(ActionCreators.selectSearch(result)),
        changeActiveGroup: groupID => dispatch(ActionCreators.changeActiveGroup(groupID)),
        changeActiveDevice: deviceID => dispatch(ActionCreators.changeActiveDevice(deviceID)),
        changeActiveChannel: channelID => dispatch(ActionCreators.changeActiveChannel(channelID)),
        extractChannels: groups => dispatch(ActionCreators.extractChannels(groups)),
        create: createGroupParams => dispatch(ActionCreators.createGroup(createGroupParams)),
        createReminder: createReminderParams => dispatch(ActionCreators.createReminder(createReminderParams)),
    };
};

export const mergeProps = (stateProps, dispatchProps, ownProps) => {
    const create = (name, members) => dispatchProps.create({
        axios: ownProps.axios,
        name,
        members,
    });

    const createReminder = ({ channel, time, message }) => dispatchProps.createReminder({
        axios: ownProps.axios,
        channel,
        time,
        message,
    });

    return {
        ...stateProps,
        ...dispatchProps,
        ...ownProps,
        create,
        createReminder,
    };
};

export default component => withAxios(connect(mapState, mapDispatch, mergeProps)(component));
