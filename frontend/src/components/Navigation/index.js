import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  return (
<div className='nav-bar-wrapper'>
<div className="home-link-wrapper">
        <NavLink exact to="/">airbnbclone</NavLink>
        </div>
        <div className="profile-button-wrapper">
      {isLoaded && (  <ProfileButton user={sessionUser} />
        )}
        </div>
            </div>
  );
}

export default Navigation;
