import UserIconDropzone from 'src/view/components/admininterface/appbar/Settings/UserIconDropzone';
import React from 'react';
import { Field } from 'redux-form';
import { Paper } from '@material-ui/core';
import PropTypes from 'prop-types';
import { maxFileSize } from 'src/view/FileConsts';

const UserProfileAvatar = ({ translate, profile: { image, firstName, lastName, email, login } }) => (
  <Paper className="userAvatarStyle" elevation={6}>
    <Field imageLink={image} name="image" component={UserIconDropzone} translate={translate} maxSize={maxFileSize} />
    <div className="userInfoStyle">
      <span>
        {firstName} {lastName}
      </span>
      <span>{email}</span>
      <span>{login}</span>
    </div>
  </Paper>
);

UserProfileAvatar.propTypes = {
  profile: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    login: PropTypes.string
  }).isRequired,
  translate: PropTypes.func.isRequired
};

export default UserProfileAvatar;
