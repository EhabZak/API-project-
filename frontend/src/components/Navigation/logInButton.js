import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import { Link } from 'react-router-dom';
import ManageSpot from "../ManageSpot";
import OpenModalButton from "../OpenModalButton";
import SignupFormModal from "../SignupFormModal";
import LoginFormModal from "../LoginFormModal";
import "./logInButtonsContainer.css"


function LogInButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

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
      <ul className={ulClassName}  ref={ulRef}>
      <li id="login-buttons-container">
      <OpenModalButton
          buttonText="Sign Up"
          modalComponent={<SignupFormModal />}
        />
        <OpenModalButton
          buttonText="Log In"
          modalComponent={<LoginFormModal />}
        />

      </li>
      <li>
          <button className="buttons" onClick={(e) =>{
            const credential = "Demo-lition"
            const password = "password"
            setShowMenu(false)

            return dispatch(sessionActions.login({credential, password}))
          }}>Demo User</button>
          </li>

      </ul>
    </>
  );
}

export default LogInButton;
