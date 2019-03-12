import React from 'react';
import PropTypes from 'prop-types';

import { Popup, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

export const NavLink = ({ name, icon, path, className }) =>
    <div className='nav-link'>
        <Popup
            trigger={
                <Link to={`/${path}`}>
                    <Icon inverted link
                        name={icon}
                        size='large'
                        className={className} />
                </Link>
            }
            verticalOffset={10}
            content={name}
            position='right center' />
    </div>;

NavLink.defaultProps = {
    className: '',
};

NavLink.propTypes = {
    name: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    className: PropTypes.string,
};
