import React from 'react';
import { TextField } from '@material-ui/core';
import PropTypes from 'prop-types';

export const UserFormTextfield = (props) => (
  <TextField
    placeholder={props.label}
    label={props.label}
    error={props.meta.touched && Boolean(props.meta.error)}
    helperText={props.meta.touched && props.meta.error}
    disabled={props.disabled}
    fullWidth
    margin="normal"
    {...props.input}
  />
);

UserFormTextfield.propTypes = {
  label: PropTypes.string.isRequired,
  meta: PropTypes.object.isRequired
};
