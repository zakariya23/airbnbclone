import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  return (
<div className='nav-bar-wrapper'>
      {/* <li> */}
        <NavLink exact to="/">airbnbclone</NavLink>
      {/* </li> */}
      {isLoaded && (  <ProfileButton user={sessionUser} />
        )}
            </div>
  );
}

export default Navigation;
