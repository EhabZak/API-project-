import { csrfFetch } from "./csrf";
//1- Action Types
const SET_USER = "session/setUser";
const REMOVE_USER = "session/removeUser";


//2- action creators
const setUser = (user) => {
  return {
    type: SET_USER,
    payload: user,
  };
};

const removeUser = () => {
  return {
    type: REMOVE_USER,
  };
};


//! 3- Thunks

/* for long in thunk
It sends a POST request to the server with the user's login credentials (username/credential and password).
It receives the response from the server.
It parses the JSON data from the response.
It updates the Redux store with the user data received from the server.
It returns the original HTTP response object in case the caller of the login function wants
to perform any further actions based on the HTTP */

export const login = (user) => async (dispatch) => {
  const { credential, password } = user;
  const response = await csrfFetch("/api/session", {
    method: "POST",
    body: JSON.stringify({
      credential,
      password,
    }),
  });
  const data = await response.json();
  dispatch(setUser(data.user));
  return response;
};

export const restoreUser = () => async (dispatch) => {
  const response = await csrfFetch("/api/session");
  const data = await response.json();
  dispatch(setUser(data.user));
  return response;
};

export const signup = (user) => async (dispatch) => {
  const { username, firstName, lastName, email, password } = user;
  const response = await csrfFetch("/api/users", {
    method: "POST",
    body: JSON.stringify({
      username,
      firstName,
      lastName,
      email,
      password,
    }),
  });
  const data = await response.json();
  dispatch(setUser(data.user));
  return response;
};

export const logout = () => async (dispatch) => {
  const response = await csrfFetch('/api/session', {
    method: 'DELETE',
  });
  dispatch(removeUser());
  return response;
};



//! 4-Reducers

const initialState = { user: null };

const sessionReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case SET_USER:
      newState = Object.assign({}, state);
      newState.user = action.payload;
      return newState;
    case REMOVE_USER:
      newState = Object.assign({}, state);
      newState.user = null;
      return newState;
    default:
      return state;
  }
};

export default sessionReducer;


/*

5. Within the **`login`** thunk, it de-structures the **`credential`** and **`password`** from the **`user`** object.
6. It then uses **`csrfFetch`** (a custom fetch function that includes the CSRF token) to make a POST request to the server at the "/api/session" endpoint. It sends the **`credential`** and **`password`** as JSON data in the request body.
7. The server processes the login request and sends back a response, which includes the user data if the login is successful.
8. The **`response`** from the server is converted to JSON using **`await response.json()`** to parse the data.
9. After obtaining the **`data`** object, the **`setUser`** action creator is called with **`data.user`** as the argument. This action creator returns an action with the type "session/setUser" and the user data as the payload.
10. The **`dispatch(setUser(data.user))`** call updates the Redux store's state by triggering the **`sessionReducer`**. The reducer will handle the action with the "session/setUser" type, update the **`user`** property in the state with the new user data, and return a new state object.
11. At this point, the Redux store's state has been updated with the logged-in user data.
12. Since the **`login`** thunk is an async function, it returns the original HTTP response object (**`response`**) to the caller of the **`login`** function. This can be useful if the caller needs to perform any additional actions based on the HTTP response, although in this specific implementation, it does not seem to be used.




*/
