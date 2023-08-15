import React from "react";
import "./styles/index.scss";
import { Home } from "./Pages";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory,
} from "react-router-dom";
import { useEffect } from "react";

export const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          <Home />
        </Route>

        <Route path="*">
          <Redirect />
        </Route>
      </Switch>
    </Router>
  );
};

const Redirect = () => {
  const history = useHistory();

  useEffect(() => {
    history.push("/");
  }, [history]);

  return null;
};
