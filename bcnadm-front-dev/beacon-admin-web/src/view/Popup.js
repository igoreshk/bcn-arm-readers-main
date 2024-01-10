import React from 'react';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';
import PopUpMessage from './PopUpMessage';

const Popup = (props) => {
  const { popupText } = props;

  if (popupText.length !== 0) {
    return <PopUpMessage message={popupText[0]} />;
  }
  return null;
};

const mapStateToProps = (state) => {
  return {
    popupText: state.popup.popupText
  };
};

Popup.propTypes = {
  popupText: PropTypes.arrayOf(PropTypes.string)
};

export default connect(mapStateToProps, null)(Popup);
