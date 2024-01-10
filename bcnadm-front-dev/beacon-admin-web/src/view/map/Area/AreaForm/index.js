import React from 'react';
import { Field, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import { AreaTextField } from '../AreaTextField';
import { validateDescription } from '../AreaFormFieldsValidation';

import './areaForm.scss';

const AreaForm = (props) => {
  const { translate } = props;

  return (
    <form className="areaForm">
      <Field name="name" component={AreaTextField} label={translate('areas.name')} valueType="string" />
      <Field
        name="description"
        component={AreaTextField}
        label={translate('areas.description')}
        valueType="string"
        validate={validateDescription}
      />
    </form>
  );
};

AreaForm.propTypes = {
  translate: PropTypes.func
};

export default reduxForm({
  form: 'AreaInfo'
})(AreaForm);
