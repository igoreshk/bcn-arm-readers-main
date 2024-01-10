import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { withLocalize } from 'react-localize-redux';
import { validate } from './validate';

import BeaconDialogTextField from '../Beacons/BeaconFormTextField';

import '../Beacons/BeaconForm/beaconForm.scss';

const BeaconForm = () => {
  return (
    <form className="beaconForm">
      <Field
        name="uuid"
        component={BeaconDialogTextField}
        params={{
          label: 'uuid',
          type: 'String',
          id: 'reader-uuid-field'
        }}
      />
    </form>
  );
};

export default withLocalize(
  reduxForm({
    form: 'ReaderInfo',
    validate
  })(BeaconForm)
);
