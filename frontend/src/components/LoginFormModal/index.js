import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  return (
    <>
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username or Email
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.credential && (
          <p>{errors.credential}</p>
        )}
        <button type="submit">Log In</button>
      </form>
    </>
  );
}

export default LoginFormModal;
 /*

 Overall Flow:

1-When the component is rendered, it checks if the user is already logged in (sessionUser is truthy) and redirects them to the home page if that's the case.
2-Users can input their username/email and password in the form fields.
3-When the "Log In" button is clicked, the handleSubmit function is called, attempting to log in the user.
4- The **`handleSubmit`** function is called, which was defined in the **`LoginFormPage`** component. It takes an event object (e) as an argument.
5- The function starts by preventing the default form submission behavior, which would cause a page refresh, using **`e.preventDefault()`**.
6- It then clears any existing errors by setting the **`errors`** state to an empty object using **`setErrors({})`**.
7- It proceeds to dispatch the **`login`** action, which is a thunk. The **`login`** action takes the **`credential`** and **`password`** as parameters and returns an asynchronous function.

7.1- goes to the session.js file now ...
7.2- ...returns from the session.js file

13. As a result of the state update, the **`useSelector`** hook in the **`LoginFormPage`** component detects the change in the **`session`** slice of the Redux store and triggers a re-render of the component.
14. The **`LoginFormPage`** component is re-rendered, and the **`useSelector`** hook gets the updated **`sessionUser`** from the Redux store.
15. Since the user is now logged in (**`sessionUser`** is truthy), the component returns a **`<Redirect to="/" />`**, redirecting the user to the home page.
16. If there were any errors during the login process (e.g., incorrect credentials), they would have been received from the server and stored in the **`errors`** state using **`setErrors(data.errors)`**.
 These errors would be displayed below the corresponding input fields in the form, and the user would have to correct the inputs and try again.
17--If the login is successful, the user will be redirected to the home page due to the sessionUser check.
18-If there are any login errors (e.g., invalid credentials), they will be displayed below the corresponding input field.
 */
