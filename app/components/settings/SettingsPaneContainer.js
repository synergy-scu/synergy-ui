import { connect } from 'react-redux';

import ActionCreators from '../../actions';
import { SettingsPane } from './SettingsPane';

export const mapState = state => {
    return {
        activeTab: state.settingsTab,
    };
};

export const mapDispatch = dispatch => {
    return {
        changeTab: tabIndex => dispatch(ActionCreators.changeSettingsTab(tabIndex)),
    };
};

export default connect(mapState, mapDispatch)(SettingsPane);
