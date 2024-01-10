import React from 'react';
import PropTypes from 'prop-types';
import UserProfileAvatar from '../UserProfileAvatar';
import UserProfileDetails from '../UserProfileDetails';

import './userProfileForm.scss';

export const UserProfileForm = (props) => {
  return (
    <form className="userProfileForm">
      <UserProfileAvatar profile={props.userProfile} translate={props.translate} />
      <UserProfileDetails
        profile={props.userProfile}
        saveSettings={props.saveSettings}
        valid={props.valid}
        translate={props.translate}
      />
    </form>
  );
};

UserProfileForm.propTypes = {
  userProfile: PropTypes.object,
  translate: PropTypes.func,
  saveSettings: PropTypes.func,
  valid: PropTypes.bool
};
