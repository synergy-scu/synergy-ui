import { connect } from 'react-redux';

import { EntityModal } from './EntityModal';

export const mapState = state => {
    return {
        entities: state.entities,
    };
};

export default connect(mapState)(EntityModal);
