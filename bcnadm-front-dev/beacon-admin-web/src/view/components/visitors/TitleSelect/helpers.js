export const checkNumberVisitorsZero = (values) => {
  return values.length === 0;
};

export const checkNumberVisitorsOne = (values) => {
  return values.length === 1;
};

export const checkNumberMoreTwentyEndsOne = (values) => {
  const re = new RegExp(/(0|[2-9])1$/);
  return re.test(values.length.toString());
};

export const checkNumberEndsTwoThreeFour = (values) => {
  const re = new RegExp(values.length.toString().match(/^[2-4]$/) || values.length.toString().match(/(0|[2-9])[2-4]$/));
  return re.test(values.length.toString());
};
