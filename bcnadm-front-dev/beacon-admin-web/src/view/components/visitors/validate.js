export const validate = (values, props) => {
  const errors = {};
  const requiredFieldsCreate = ['name', 'deviceId'];
  const requiredFieldsUpdate = ['name', 'deviceId'];

  const requiredFields = values.entityId ? requiredFieldsUpdate : requiredFieldsCreate;

  requiredFields.forEach((field) => {
    if (!values[field]) {
      errors[field] = props.translate('validation.required');
    }
  });
  if (values.name && !/^[\w\s+-]{2,90}$/i.test(values.name)) {
    errors.name = props.translate('validation.invalidName');
  }
  if (values.deviceId && !/^[a-z0-9]{1,200}$/gi.test(values.deviceId)) {
    errors.deviceId = props.translate('validation.invalidDeviceId');
  }
  if (!props.isAppropriateName) {
    errors.name = props.translate('visitors.dialog.uniqueVisitorNameError');
  }
  if (!props.isAppropriateDeviceId) {
    errors.deviceId = props.translate('visitors.dialog.uniqueDeviceIdError');
  }

  return errors;
};
