import { connect } from 'react-redux';

import ActionCreators from '../../../actions';
import { EntityModal } from './EntityModal';

export const mapState = state => {
    return {
        activeTab: state.editTab,
        showModal: state.showEditModal,
    };
};

export const mapDispatch = dispatch => {
    return {
        changeTab: tabIndex => dispatch(ActionCreators.changeEditTab(tabIndex)),
        toggleModal: () => dispatch(ActionCreators.toggleEditModal()),
    };
};

export default connect(mapState, mapDispatch)(EntityModal);
