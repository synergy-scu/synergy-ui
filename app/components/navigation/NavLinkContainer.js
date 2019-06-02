import { connect } from 'react-redux';

import Actions from '../../actions';
import { NavLink } from './NavLink';

// export const mapState = state => {

// };

export const mapDispatch = dispatch => {
    return {
        changePane: pane => dispatch(Actions.changePane(pane)),
        forcePause: shouldPause => dispatch(Actions.forcePause(shouldPause)),
    };
};

export default connect(mapDispatch)(NavLink);
