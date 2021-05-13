import React from 'react';
import { WELCOME_PAGE_ROUTE, ELEVATORS_PAGE_ROUTE } from './utils/Constants';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { WelcomePage } from './pages/welcome-page/WelcomePage';
import { ElevatorsPage } from './pages/elevators-page/ElevatorsPage';

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path={WELCOME_PAGE_ROUTE}>
          <WelcomePage />
        </Route>
        <Route exact path={ELEVATORS_PAGE_ROUTE}>
          <ElevatorsPage />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
