import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { Application } from './Application';

export const mapState = state => {
    return {
        user: state.user,
    };
};

export default connect(mapState)(withRouter(Application));
