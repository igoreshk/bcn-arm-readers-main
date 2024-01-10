import React from 'react';
import PropTypes from 'prop-types';

import './logo.scss';

function Logo(props) {
  return (
    <div className="logoContainer">
      <div className="logoBackground">{props.icon}</div>
      <span className="title">{props.title}</span>
    </div>
  );
}

Logo.propTypes = {
  icon: PropTypes.object,
  title: PropTypes.string
};

export default Logo;
