// todo localization
export const validateUUID = (UUID) => {
  const insideTernary = UUID ? 'Invalid' : 'Required';
  return /^.{36}$/.test(UUID) ? null : insideTernary;
};

export const validateMajorOrMinor = (majorOrMinor) => {
  const maxLength = 5;
  let majorMinor = majorOrMinor;
  if (majorMinor.toString().length < maxLength) {
    majorMinor = majorOrMinor.toString().padStart(maxLength, '0');
  }
  const insideTernary = majorMinor ? 'Invalid' : 'Required';
  return /^.{5}$/.test(majorMinor) ? null : insideTernary;
};

// reg for mac
// ^[0-9a-f]{1,2}([\.:-])(?:[0-9a-f]{1,2}\1){4}[0-9a-f]{1,2}$
