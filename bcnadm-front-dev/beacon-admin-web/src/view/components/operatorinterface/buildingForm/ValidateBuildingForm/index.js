import { maxFileSize } from 'src/view/FileConsts';

const doubleRegExp = /^[-]?([0-9]*[.])?[0-9]+$/i;
const maxMapImageSize = maxFileSize; // 1 MB
const workingHoursRegExp = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]-([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

// latitude must be from -90 to 90 degrees
export const validateLatitude = (latitude) => {
  const latCap = 90;
  return doubleRegExp.test(latitude) && latitude >= -latCap && latitude <= latCap;
};

// longitude must be from -180 to 180 degrees
export const validateLongitude = (longitude) => {
  const longCap = 180;
  return doubleRegExp.test(longitude) && longitude >= -longCap && longitude <= longCap;
};

// levels must be only digits
export const validateLevelNumber = (levelNumber) => {
  return doubleRegExp.test(levelNumber);
};

export const validateMapSize = (mapImage) => {
  return mapImage && mapImage.size <= maxMapImageSize;
};

export const validateMapType = (mapImage) => {
  return mapImage && (mapImage.type === 'image/jpeg' || mapImage.type === 'image/png');
};

export const validateWorkingHours = (workingHours) => {
  if (workingHours) {
    const startAndEndWorkingHours = workingHours.split('-');
    return workingHoursRegExp.test(workingHours) && startAndEndWorkingHours[0] !== startAndEndWorkingHours[1];
  }
};

export const validateBuildingSize = (size) => !isNaN(Number(size)) && Number(size) !== 0;

export const fieldsAreFilled = (...fields) => {
  return fields.every((field) => Boolean(field));
};

export const validationsArePassed = ({ width, height, longitude, latitude, workingHours }) => {
  return (
    validateLongitude(longitude) &&
    validateLatitude(latitude) &&
    (validateWorkingHours(workingHours) || !workingHours) &&
    validateBuildingSize(height) &&
    validateBuildingSize(width)
  );
};

export const levelMapsFieldsAreValid = (levels) => {
  return levels.every((level) => (level.entityId || level.image) !== undefined);
};

const createErrorsObject = (values, props) => {
  const errors = {
    levels: []
  };

  if (!validateLongitude(values.longitude)) {
    errors.longitude = props.translate('validation.invalidCoordinates');
  }

  if (!validateLatitude(values.latitude)) {
    errors.latitude = props.translate('validation.invalidCoordinates');
  }

  values.levels &&
    values.levels.forEach((level, index) => {
      if (!validateLevelNumber(level.number)) {
        errors.levels[index] = props.translate('validation.invalidLevelNumber');
      }
    });

  if (!validateWorkingHours(values.workingHours) && values.workingHours) {
    errors.workingHours = props.translate('validation.invalidWorkingHours');
  }

  if (!validateBuildingSize(values.width)) {
    errors.width = props.translate('validation.invalidBuildingSize');
  }

  if (!validateBuildingSize(values.height)) {
    errors.height = props.translate('validation.invalidBuildingSize');
  }

  return errors;
};

export const validate = (values, props) => {
  const errors = createErrorsObject(values, props);

  if (errors.levels.length === 0) {
    delete errors.levels;
  }

  const requiredFieldsCreate = ['name', 'address', 'longitude', 'latitude', 'levels', 'width', 'height', 'mapImage'];
  const requiredFieldsUpdate = ['name', 'address', 'longitude', 'latitude', 'levels', 'width', 'height'];
  const requiredFields = values.entityId ? requiredFieldsUpdate : requiredFieldsCreate;

  requiredFields.forEach((field) => {
    if (!values[field]) {
      errors[field] = props.translate('validation.required');
    }
  });

  if (!values.levels) {
    return errors;
  }

  for (let i = 0; i < values.levels.length; i++) {
    const cur = values.levels[i];
    const levelRegExp = /^([A-Z|a-z|0-9|а-я|А-Я|-]+[\s]?)+$/i;
    if (cur && cur.level && !levelRegExp.test(cur.level)) {
      errors.levels = props.translate('validation.invalidLevel');
    }
  }

  return errors;
};
