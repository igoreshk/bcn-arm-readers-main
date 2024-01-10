import React from 'react';
import { TextField } from '@material-ui/core';
import PropTypes from 'prop-types';

const WatcherFormTextField = (props) => (
  <TextField
    placeholder={props.hintText}
    label={props.floatingLabelText}
    disabled={props.disabled}
    fullWidth
    margin="normal"
    multiline={props.multiLine}
    rowsMax={props.rowsMax}
    onChange={props.onChange}
    value={props.input}
    error={!props.isAppropriateName && props.isAppropriateName !== null}
    helperText={!props.isAppropriateName && props.isAppropriateName !== null && props.helperText}
  />
);

WatcherFormTextField.propTypes = {
  hintText: PropTypes.string.isRequired,
  floatingLabelText: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

export default WatcherFormTextField;
