import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import AllSpots from "./components/AllSpots";
import SpotDetails from "./components/SpotDetails";
import ManageSpot from "./components/ManageSpot";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Switch>



        <Route exact path="/" component={AllSpots} />
        <Route path= "/spots/:spotId" component= {SpotDetails} />
        <Route exact path="/manage-spots" component={ManageSpot} />
        {/* <Route exact path="" /> */}


        <Route>
          <h1>Route doesn't exist</h1>
        </Route>

      </Switch>}
    </>
  );
}

export default App;
