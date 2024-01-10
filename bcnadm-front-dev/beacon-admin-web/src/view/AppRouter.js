import {
  LOGIN,
  USERS_LIST,
  VISITORS_LIST,
  WATCHERS_LIST,
  BUILDINGS,
  BUILDING_ID,
  LEVELS,
  LEVEL_ID,
  LAYER,
  EDIT_MODE,
  BUILDINGS_LIST,
  USER
} from 'src/consts/RouteConsts';
import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { BuildingsListRouter } from './components/operatorinterface/builgingsList/BuildingsListRouter';
import UsersListRouter from './components/admininterface/UsersListRouter';
import VisitorsListRouter from './components/visitors/VisitorsListRouter';
import WatchersListRouter from './components/watchers/WatchersListRouter';
import UserProfilePage from './components/settings/UserProfile/UserProfilePage';
import LoginPageRender from './LoginPageRender';
import MapPage from './map/MapPage';

export const AppRouter = () => (
  <Switch>
    <Route path={LOGIN} component={LoginPageRender} />
    <Route path={USERS_LIST} component={UsersListRouter} />
    <Route path={VISITORS_LIST} component={VisitorsListRouter} />
    <Route path={WATCHERS_LIST} component={WatchersListRouter} />
    <Route path={BUILDINGS + BUILDING_ID + LEVELS + LEVEL_ID + LAYER + EDIT_MODE} component={MapPage} />
    <Route path={BUILDINGS_LIST} component={BuildingsListRouter} />
    <Route path={USER} component={UserProfilePage} />
  </Switch>
);
