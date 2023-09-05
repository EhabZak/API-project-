import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();
  const [allFieldsFilled, setAllFieldsFilled] = useState(false);



  ////////////////////////////////////////////////////////////

  useEffect(() => {

    const isAllFieldsFilled =
      email !== "" &&
      username !== "" &&
      firstName !== "" &&
      lastName !== "" &&
      password !== "" &&
      confirmPassword !== "";

    setAllFieldsFilled(isAllFieldsFilled);
  }, [email, username, firstName, lastName, password, confirmPassword]);
  ////////////////////////////////////////////////////////////////////
  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password,
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) {
            setErrors(data.errors);
          }
        });
    }
    return setErrors({
      confirmPassword: "Confirm Password field must be the same as the Password field"
    });
  };
//////////////////////////////////////////////////////////////
  return (
    <>
    <div id="sign-up-container">
      <div id="container-under-signup"></div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit} id="signup-form">
        <label className="signup-label-container">
          Email
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label >
        {errors.email && <p id="errors-sign-up">{errors.email}</p>}
        <label className="signup-label-container">
          Username
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        {errors.username && <p id="errors-sign-up">{errors.username}</p>}
        <label className="signup-label-container">
          First Name
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </label>
        {errors.firstName && <p id="errors-sign-up">{errors.firstName}</p>}
        <label className="signup-label-container">
          Last Name
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </label>
        {errors.lastName && <p id="errors-sign-up">{errors.lastName}</p>}
        <label className="signup-label-container">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label >
        {errors.password && <p id="errors-sign-up">{errors.password}</p>}
        <label className="signup-label-container">
          Confirm Password
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        {errors.confirmPassword && (
          <p id="errors-sign-up">{errors.confirmPassword}</p>
        )}
        <button type="submit" disabled={!allFieldsFilled}>Sign Up</button>
      </form>
      </div>
    </>
  );
}

export default SignupFormModal;
