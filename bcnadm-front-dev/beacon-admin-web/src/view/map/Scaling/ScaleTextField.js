import React from 'react';
import { TextField } from '@material-ui/core';
const scaleTextField = ({ input, params, meta: { touched, error } }) => {
  return (
    <TextField
      label={params.label}
      error={touched && Boolean(error)}
      helperText={touched && error}
      type="number"
      min={1}
      fullWidth
      {...input}
    />
  );
};

export default scaleTextField;
