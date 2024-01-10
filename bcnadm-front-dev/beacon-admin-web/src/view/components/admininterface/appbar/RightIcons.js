import React from 'react';
import { Avatar } from '@material-ui/core';
import PropTypes from 'prop-types';

import AvatarMenuContainer from './AvatarMenuContainer';

const avatarDivStyle = {
  display: 'flex',
  alignItems: 'center',
  height: '100%'
};

const rightIcons = (props) => (
  <div style={avatarDivStyle}>
    <Avatar src={props.avatar} />
    <AvatarMenuContainer />
  </div>
);

rightIcons.propTypes = {
  avatar: PropTypes.string.isRequired
};

export default rightIcons;
