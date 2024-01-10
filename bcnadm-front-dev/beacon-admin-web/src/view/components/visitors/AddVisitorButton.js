import React from 'react';
import { Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/AddCircleOutline';
import PropTypes from 'prop-types';

export default function AddVisitorButton(props) {
  return (
    <Button className="appBarAddButton" onClick={props.onClick} variant="contained" color="secondary">
      <AddIcon fontSize="small" />
      <span className="text">{props.translate('visitors.addVisitor')}</span>
    </Button>
  );
}

AddVisitorButton.propTypes = {
  translate: PropTypes.func.isRequired,
  onClick: PropTypes.func
};
