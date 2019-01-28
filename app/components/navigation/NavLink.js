import React from 'react';
import PropTypes from 'prop-types';

import { Popup, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

export const NavLink = ({ name, icon, path }) =>
    <div className='nav-link'>
        <Popup
            trigger={
                <Link to={`/${path}`}>
                    <Icon name={icon} size='large' />
                </Link>
            }
            content={name}
            position='right center' />
    </div>;

NavLink.propTypes = {
    name: PropTypes.string,
    icon: PropTypes.string,
    path: PropTypes.string,
};
