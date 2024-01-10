import { EMAIL, LOGIN, PASSWORD, PROFILE, USER } from 'src/consts/RouteConsts';
import React from 'react';
import { Route } from 'react-router-dom';

import PropTypes from 'prop-types';
import UserProfileDetailsTab from './UserProfileDetailsTab';
import ChangeEmailDialog from './UserProfileFormDialogs/ChangeEmailDialog';
import ChangeLoginDialog from './UserProfileFormDialogs/ChangeLoginDialog';
import ChangePasswordDialog from './UserProfileFormDialogs/ChangePasswordDialog';

export const UserProfileDetailsRouter = (props) => {
  return (
    <>
      <Route path={USER + PROFILE} render={() => <UserProfileDetailsTab updated={props.updated} />} />
      <Route exact path={USER + PROFILE + EMAIL} component={ChangeEmailDialog} />
      <Route exact path={USER + PROFILE + LOGIN} component={ChangeLoginDialog} />
      <Route exact path={USER + PROFILE + PASSWORD} component={ChangePasswordDialog} />
    </>
  );
};
UserProfileDetailsRouter.propTypes = {
  updated: PropTypes.bool
};
