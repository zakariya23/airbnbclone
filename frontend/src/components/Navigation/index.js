import React, { useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';


function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);
  const navbarRef = useRef();


  return (
    <div className='nav-bar-wrapper' ref={navbarRef}>
      <div className="home-link-wrapper">
        <NavLink exact to="/">airbnbclone</NavLink>
      </div>


      <div className="make-a-spot-wrapper">
          { sessionUser && (
            <NavLink to='/new'>Make a Spot!</NavLink>
          )}
        </div>


      <div className="profile-button-wrapper">
        {isLoaded && (
          <ProfileButton user={sessionUser} navbarRef={navbarRef} />
        )}
      </div>
    </div>
  );
}


export default Navigation;
