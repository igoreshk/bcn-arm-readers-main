export const validateDescription = (description, otherValues, { translate }) => {
  return /^.{0,1000}$/.test(description) ? null : translate('validation.invalidAreaDescription');
};
