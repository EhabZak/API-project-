import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import { Link } from 'react-router-dom';
import ManageSpot from "../ManageSpot";
import { useHistory } from 'react-router-dom';

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();
  const routerHistory = useHistory();
  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    routerHistory.push('/');
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");
// if true the ulClassName = "profile-dropdown"
// if false the ulClassName = = "profile-dropdown hidden" this way hidden class will be applied


  return (
    <>
      <button id = "button-container" onClick={openMenu}>
      <i className="fa-solid fa-bars"></i>
        <i className="fas fa-user-circle" />
      </button>
      <ul className={ulClassName} ref={ulRef}>
        <li>Hello, {user.username}</li>
        {/* <li>{user.firstName} {user.lastName}</li> */}
        <li>{user.email}</li>
        <li>________________</li>
        <div id="manage-link">
        <li>
          <Link to ={"/manage-spots"} id="custom-link">
          Manage Spots
          </Link>
          </li>
          </div>
          <li>________________</li>
        <li>
          <button id="log-out-button" onClick={logout}>Log Out</button>
        </li>

      </ul>
    </>
  );
}

export default ProfileButton;
