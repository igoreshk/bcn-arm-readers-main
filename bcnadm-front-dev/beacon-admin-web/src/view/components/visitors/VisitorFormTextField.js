import React from 'react';
import { TextField } from '@material-ui/core';
import PropTypes from 'prop-types';

const VisitorFormTextField = (props) => (
  <TextField
    placeholder={props.hintText}
    label={props.floatingLabelText}
    error={props.meta.touched && Boolean(props.meta.error)}
    helperText={props.meta.touched && props.meta.error}
    disabled={props.disabled}
    fullWidth
    margin="normal"
    multiline={props.multiLine}
    rowsMax={props.rowsMax}
    {...props.input}
  />
);

VisitorFormTextField.propTypes = {
  hintText: PropTypes.string.isRequired,
  floatingLabelText: PropTypes.string.isRequired,
  meta: PropTypes.object.isRequired
};

export default VisitorFormTextField;
