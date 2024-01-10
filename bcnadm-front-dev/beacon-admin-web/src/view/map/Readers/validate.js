export const validate = (values, props) => {
  const errors = {};

  const readerName = values.uuid;

  if (!readerName) {
    errors.uuid = props.translate('validation.required');
  }

  if (readerName !== undefined && values.allReaders.includes(readerName)) {
    errors.uuid = props.translate('validation.invalidReaderSameName');
  }

  return errors;
};
