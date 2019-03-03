import React from 'react';
import PropTypes from 'prop-types';

import { NavLink } from './NavLink';

export const Navigation = props =>
    <nav className='navigation'>
        {
            props.routes.map(route => {
                let className = null;
                if (route.name.toLowerCase() === 'settings') {
                    className = 'settings-icon';
                }
                return <NavLink key={`navlink-${route.name}`} className={className} {...route} />;
            })
        }
    </nav>;

Navigation.propTypes = {
    routes: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string,
        icon: PropTypes.string,
        path: PropTypes.string,
    })),
    user: PropTypes.string,
};
