import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { USER_PROFILE, USER_MESSAGES } from 'src/consts/RouteConsts';
import UserProfileTabContainer from './UserProfileTabContainer';

export const UserProfileRouter = () => {
  return (
    <Switch>
      <Route path={USER_PROFILE} render={() => <UserProfileTabContainer value="profile" />} />
      <Route path={USER_MESSAGES} render={() => <UserProfileTabContainer value="messages" />} />
    </Switch>
  );
};
