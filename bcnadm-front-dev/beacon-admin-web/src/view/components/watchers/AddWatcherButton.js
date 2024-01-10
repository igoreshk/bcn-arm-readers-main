import React from 'react';
import { Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/AddCircleOutline';
import PropTypes from 'prop-types';

export default function AddWatcherButton(props) {
  return (
    <Button className="appBarAddButton" onClick={props.onClick} variant="contained" color="secondary">
      <AddIcon fontSize="small" />
      <span className="text">{props.translate('watchers.addWatcher')}</span>
    </Button>
  );
}

AddWatcherButton.propTypes = {
  onClick: PropTypes.func
};
