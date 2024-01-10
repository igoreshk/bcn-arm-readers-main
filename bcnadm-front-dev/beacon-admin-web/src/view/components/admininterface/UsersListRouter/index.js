import { USER_DIALOG, USERS_DELETE_DIALOG, USERS_LIST } from 'src/consts/RouteConsts';
import React from 'react';
import { Route } from 'react-router-dom';

import UsersList from '../UsersList';
import UserDialog from '../UserDialog';
import UserDeleteDialog from '../UserDeleteDialog';

const UsersListRouter = () => (
  <>
    <Route path={USERS_LIST} component={UsersList} />
    <Route exact path={USER_DIALOG} component={UserDialog} />
    <Route exact path={USERS_DELETE_DIALOG} component={UserDeleteDialog} />
  </>
);

export default UsersListRouter;
