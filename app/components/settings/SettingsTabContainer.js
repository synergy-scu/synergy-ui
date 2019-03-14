import { connect } from 'react-redux';

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
    };
};

export default component => connect(mapState, mapDispatch)(component);
