import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';

import PropTypes from 'prop-types';
import ScaleTextField from './ScaleTextField';
import { validateDistance } from '../validateDistanceDialog';

class DistanceForm extends Component {
  validate = (value) => {
    return validateDistance(value) ? null : this.props.translate('validation.invalidDistance');
  };

  render() {
    return (
      <Field
        name="distance"
        component={ScaleTextField}
        params={{
          label: this.props.translate('map.distance')
        }}
        validate={this.validate}
        fieldName="distance"
      />
    );
  }
}

DistanceForm.propTypes = {
  translate: PropTypes.func
};

export default reduxForm({
  form: 'ScaleInfo'
})(DistanceForm);
