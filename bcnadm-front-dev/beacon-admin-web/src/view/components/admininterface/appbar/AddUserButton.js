import React from 'react';
import { Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/AddCircleOutline';
import PropTypes from 'prop-types';

function AddUserButton(props) {
  return (
    <Button className="appBarAddButton" onClick={props.onClick} variant="contained" color="secondary">
      <AddIcon fontSize="small" />
      <span className="text">{props.translate('admin.addUser')}</span>
    </Button>
  );
}

AddUserButton.propTypes = {
  translate: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired
};

export default AddUserButton;
