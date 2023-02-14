
import React, { useState, useRef, useEffect } from "react";
import { useDispatch } from 'react-redux';
import { NavLink, Redirect } from "react-router-dom";
import { useHistory } from 'react-router-dom';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import DemoLogin from "./DemoLogin";
import './ProfileButton.css'


export default function ProfileButton({ user, navbarRef }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();
  const history = useHistory(); // import useHistory hook


  const openMenu = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };


  useEffect(() => {
    if (!showMenu) return;
    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target) && !navbarRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('click', closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu, navbarRef, ulRef]);


  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    setShowMenu(false);
    history.push('/'); // redirect to home page '/'
};


  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");


  return (
    <>
      <button onClick={openMenu}>
        <i className="fas fa-user-circle" />
      </button>
      <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <>
            <li>Hello, {user.firstName}</li>
            <li>{user.firstName} {user.lastName}</li>
            <li>{user.username}</li>
            <li>{user.email}</li>
            <NavLink to={'/account'}>Account</NavLink>
            <li>
              <button onClick={logout}>Log Out</button>
            </li>
          </>
        ) : (
          <>
<li className="login-signup-button">
  <OpenModalMenuItem
    itemText="Log In"
    modalComponent={<LoginFormModal />}
  />
</li>
<li className="login-signup-button">
  <OpenModalMenuItem
    itemText="Sign Up"
    modalComponent={<SignupFormModal />}
  />
</li>
            <DemoLogin />
          </>
        )}
      </ul>
    </>
  );
}
