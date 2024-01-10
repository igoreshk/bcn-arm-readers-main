import React from 'react';
import { TextField } from '@material-ui/core';

const BeaconFormTextField = ({ input, params, meta: { touched, error } }) => {
  return (
    <TextField
      placeholder={params.mask}
      label={params.label}
      error={touched && Boolean(error)}
      helperText={touched && error}
      type="text"
      fullWidth
      margin="normal"
      multiline={params.multiLine}
      rowsMax={params.rowsMax}
      {...input}
    />
  );
};

export default BeaconFormTextField;
