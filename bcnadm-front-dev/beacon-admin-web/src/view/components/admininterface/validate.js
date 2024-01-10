export const validate = (values, props) => {
  const errors = {};
  const requiredFields = ['firstName', 'lastName', 'email', 'isCorrectEmail'];
  requiredFields.forEach((field) => {
    if (!values[field]) {
      errors[field] = props.translate('validation.required');
    }
  });
  if (values.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = props.translate('validation.invalidEmail');
    values.isCorrectEmail = false;
  } else {
    values.isCorrectEmail = true;
  }
  if (values.firstName && !/^[\w+-]{2,20}$/i.test(values.firstName)) {
    errors.firstName = props.translate('validation.invalidFirstName');
  }
  if (values.lastName && !/^[\w+-]{2,35}$/i.test(values.lastName)) {
    errors.lastName = props.translate('validation.invalidLastName');
  }
  return errors;
};
