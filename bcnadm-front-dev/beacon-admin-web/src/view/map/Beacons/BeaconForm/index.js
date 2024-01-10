import React from 'react';
import { Field, reduxForm } from 'redux-form';

import { normalizeUUID } from '../BeaconFormFieldNormalization';
import BeaconDialogTextField from '../BeaconFormTextField';
import { validateUUID } from '../BeaconFormFieldsValidation';

import './beaconForm.scss';

const masks = {
  uuid: 'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX'
};

const BeaconForm = () => {
  return (
    <form className="beaconForm">
      <Field
        name="UUID"
        component={BeaconDialogTextField}
        params={{
          label: 'UUID',
          type: 'number',
          mask: masks.uuid,
          id: 'beacon-UUID-field',
          multiLine: true,
          rowsMax: 2
        }}
        normalize={normalizeUUID}
        validate={validateUUID}
      />
    </form>
  );
};

export default reduxForm({
  form: 'BeaconInfo'
})(BeaconForm);
