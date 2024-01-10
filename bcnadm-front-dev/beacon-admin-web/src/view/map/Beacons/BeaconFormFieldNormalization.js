/* eslint-disable complexity */
/* eslint-disable max-statements */
export const normalizeUUID = (value, previousValue) => {
  if (!value) {
    return value;
  }
  const uuid = value.replace(/[^a-fA-F\d]/g, '');
  const stepZero = 0;
  const stepOne = 8;
  const stepTwo = 12;
  const stepThree = 16;
  const stepFour = 20;
  const stepFive = 32;
  if (!previousValue || value.length > previousValue.length) {
    if (/^.{8}$/.test(uuid)) {
      return `${uuid}-`;
    }
    if (/^.{12}$/.test(uuid)) {
      return `${uuid.slice(stepZero, stepOne)}-${uuid.slice(stepOne, stepTwo)}-`;
    }
    if (/^.{16}$/.test(uuid)) {
      return `${uuid.slice(stepZero, stepOne)}-${uuid.slice(stepOne, stepTwo)}-${uuid.slice(stepTwo, stepThree)}-`;
    }
    if (/^.{20}$/.test(uuid)) {
      return `${uuid.slice(stepZero, stepOne)}-${uuid.slice(stepOne, stepTwo)}-${uuid.slice(
        stepTwo,
        stepThree
      )}-${uuid.slice(stepThree, stepFour)}-`;
    }
  }
  if (/^.{0,8}$/.test(uuid)) {
    return uuid;
  }
  if (/^.{0,12}$/.test(uuid)) {
    return `${uuid.slice(stepZero, stepOne)}-${uuid.slice(stepOne, stepTwo)}`;
  }
  if (/^.{0,16}$/.test(uuid)) {
    return `${uuid.slice(stepZero, stepOne)}-${uuid.slice(stepOne, stepTwo)}-${uuid.slice(stepTwo, stepThree)}`;
  }
  if (/^.{0,20}$/.test(uuid)) {
    return `${uuid.slice(stepZero, stepOne)}-${uuid.slice(stepOne, stepTwo)}-${uuid.slice(
      stepTwo,
      stepThree
    )}-${uuid.slice(stepThree, stepFour)}`;
  }
  return `${uuid.slice(stepZero, stepOne)}-${uuid.slice(stepOne, stepTwo)}-${uuid.slice(
    stepTwo,
    stepThree
  )}-${uuid.slice(stepThree, stepFour)}-${uuid.slice(stepFour, stepFive)}`;
};

export const normalizeMajorOrMinor = (value) => {
  const maxLength = 5;
  if (!value) {
    return value;
  }
  const major = value.toString().replace(/[^\d]/g, '');
  if (major.length < maxLength) {
    return major.padStart(maxLength, '0');
  } else if (major.length === maxLength) {
    return major;
  }
  return major.slice(major.length - maxLength, major.length);
};
