import { removePopupMessageText } from 'src/actions/popupMessage';
import React from 'react';
import { Snackbar, IconButton, SnackbarContent } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const snackbarStyle = {
  transform: 'unset'
};

const bodyStyle = {
  default: {
    flexGrow: 1,
    maxWidth: 'unset',
    backgroundColor: '#CCCCCC',
    color: '#464547'
  },
  successful: {
    flexGrow: 1,
    maxWidth: 'unset',
    backgroundColor: '#A3C644'
  },
  error: {
    flexGrow: 1,
    maxWidth: 'unset',
    backgroundColor: '#E4445F'
  }
};

const PopUpMessage = (props) => {
  const { message, popupStyle } = props;

  return (
    <Snackbar
      open
      autoHideDuration={5000}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
      onClose={props.removePopupMessageText}
      style={snackbarStyle}
    >
      <SnackbarContent
        style={bodyStyle[popupStyle]}
        message={message}
        action={
          <IconButton size="small" aria-label="close" color="inherit" onClick={props.removePopupMessageText}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </Snackbar>
  );
};

PopUpMessage.propTypes = {
  removePopupMessageText: PropTypes.func.isRequired,
  popupStyle: PropTypes.string,
  message: PropTypes.string
};

const mapStateToProps = (state) => {
  return {
    popupStyle: state.popup.popupStyle[0]
  };
};

const mapDispatchToProps = {
  removePopupMessageText
};

export default connect(mapStateToProps, mapDispatchToProps)(PopUpMessage);
