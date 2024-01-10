import React from 'react';
import { TextField } from '@material-ui/core';
export const AreaTextField = (props) => {
  const { touched, error } = props.meta;
  return (
    <TextField
      label={props.label}
      onChange={props.input.onChange}
      type={props.valueType}
      error={touched && Boolean(error)}
      helperText={touched && error}
      fullWidth
      margin="normal"
      {...props.input}
    />
  );
};
