import React from 'react';
import { TextField } from '@material-ui/core';

const customTextField = ({ input, params, meta: { touched, error } }) => {
  return (
    <TextField
      disabled={params.disabled}
      placeholder={params.mask}
      label={params.label}
      error={touched && Boolean(error)}
      helperText={touched && error}
      type={params.type}
      fullWidth
      margin="normal"
      className="customTextField"
      {...input}
    />
  );
};

export default customTextField;
