import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import LogInButton from "./logInButton";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import { Link } from 'react-router-dom';
import "./Navigation.css";
import logo from '../../assets/logo.png'

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <div id="header-menu-create">
      <li>
      <Link to ={"/create-spot"} id="custom-link">
        Create a New Spot
        </Link>
      </li>
      <li>
        <ProfileButton user={sessionUser} />
      </li>
      </div>
    );
  } else {
    sessionLinks = (
      <li>
        <LogInButton/>
      </li>
    );
  }

  return (
    <ul id ="header">
      <li>
        <NavLink exact to="/">
        <img id="logo-image" src= {logo}alt="Logo"/>
        </NavLink>
      </li>
      {isLoaded && sessionLinks}
    </ul>
  );
}

export default Navigation;
