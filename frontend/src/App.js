import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import * as spotActions from './store/spots'
import Navigation from "./components/Navigation";
import Spots from "./components/Spots";
import OneSpot from "./components/Spots/OneSpot/OneSpot";
import MakeSpotForm from "./components/Spots/MakeSpotForm";
import Account from './components/Account/Index'

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
    dispatch(spotActions.getAllSpots());
  }, [dispatch]);

  return (
    <>
        <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path='/'>
            <Spots />
          </Route>
          <Route path='/api/spots/:id'>
            <OneSpot isLoaded={isLoaded}/>
          </Route>
          <Route path='/new'>
            <MakeSpotForm />
          </Route>
          <Route path='/account'>
            <Account />
          </Route>
          <Route>
            <h1>Page Not Found</h1>
          </Route>
        </Switch>
      )}
      <Spots />
    </>
  );
}

export default App;
