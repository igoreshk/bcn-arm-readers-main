import React from 'react';
import { TextField } from '@material-ui/core';
import PropTypes from 'prop-types';

const buildingInfoTextField = ({ input, label, meta: { touched, error }, type }) => {
  return (
    <TextField
      placeholder={label}
      label={label}
      error={touched && Boolean(error)}
      helperText={touched && error}
      type={type}
      fullWidth
      margin="normal"
      {...input}
    />
  );
};

buildingInfoTextField.propTypes = {
  label: PropTypes.string.isRequired,
  style: PropTypes.object
};

export default buildingInfoTextField;
