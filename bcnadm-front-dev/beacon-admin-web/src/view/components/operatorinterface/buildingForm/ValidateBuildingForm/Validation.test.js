import {
  validate,
  validateBuildingSize,
  validateWorkingHours,
  levelMapsFieldsAreValid,
  fieldsAreFilled,
  validationsArePassed
} from './index';

const wrongValues = {
  longitude: '-2-',
  workingHours: '10xgcop',
  levels: [{ number: 'Not a number' }]
};

const expectedErrors = {
  address: 'mockError',
  latitude: 'mockError',
  levels: ['mockError'],
  longitude: 'mockError',
  mapImage: 'mockError',
  name: 'mockError',
  workingHours: 'mockError',
  width: 'mockError',
  height: 'mockError'
};

const correctValues = {
  address: 'some',
  latitude: -1,
  levels: [{ number: 2 }],
  longitude: 0.1,
  mapImage: new File(['qe'], 'test'),
  name: 'building',
  levelsInfo: { level: 'B1', image: '' },
  workingHours: '10:00-20:00',
  width: 1,
  height: 1
};

const workingHoursArray = ['abc', '00:00-25:59', '4:00-19:30', '12345', '10:00-10:00'];
const expectedWorkingHoursValidationOutcome = [false, false, true, false, false];

describe('validation building test', () => {
  it('should return errors', () => {
    expect(
      validate(wrongValues, {
        translate: () => 'mockError'
      })
    ).toEqual(expectedErrors);
  });

  it('should not return errors', () => {
    expect(
      validate(correctValues, {
        translate: () => 'text'
      })
    ).toEqual({});
  });

  it('should correctly validate working hours', () => {
    const workingHoursValidationOutcome = workingHoursArray.map((workingHours) => validateWorkingHours(workingHours));
    expect(workingHoursValidationOutcome).toEqual(expectedWorkingHoursValidationOutcome);
  });
});

const buildingSizeIncorrectValueText = 'test';
const buildingSizeIncorrectValueNumber = 0;
const buildingSizeCorrectValue = 1;

describe('validateBuildingSize test', () => {
  it('should return errors by text', () => {
    expect(validateBuildingSize(buildingSizeIncorrectValueText)).toBeFalsy();
  });
  it('should return errors by zero', () => {
    expect(validateBuildingSize(buildingSizeIncorrectValueNumber)).toBeFalsy();
  });

  it('should not return errors', () => {
    expect(validateBuildingSize(buildingSizeCorrectValue)).toBeTruthy();
  });
});

describe('levelMapsFieldsAreValid', () => {
  it('check that the new levels are passed the validation', () => {
    const levels = [
      {
        entityId: undefined,
        image: 'somePic',
        number: 2
      }
    ];
    expect(levelMapsFieldsAreValid(levels)).toBeTruthy();
  });

  it('check that the old levels are passed the validation', () => {
    const levels = [
      {
        entityId: 'someId',
        image: undefined,
        number: 2
      }
    ];
    expect(levelMapsFieldsAreValid(levels)).toBeTruthy();
  });
});

describe('fieldsAreFilled', () => {
  it('check that fields are filled correctly', () => {
    const name = 'Some Name';
    const address = 'Some Address';
    const mapImage = 'somePic';
    expect(fieldsAreFilled(name, address, mapImage)).toBeTruthy();
  });

  it('check that fields are not empty', () => {
    const validField = 'Some Name';
    const emptyField = '';
    const nullField = null;
    let undefinedField;
    expect(fieldsAreFilled(validField, validField)).toBeTruthy();
    expect(fieldsAreFilled(validField, emptyField)).toBeFalsy();
    expect(fieldsAreFilled(validField, nullField)).toBeFalsy();
    expect(fieldsAreFilled(validField, undefinedField)).toBeFalsy();
  });
});

describe('validationsArePassed', () => {
  it('check that building fields are filled correct', () => {
    const correctProps = {
      width: 1,
      height: 1,
      longitude: 0,
      latitude: 0,
      workingHours: '11:00-12:00'
    };
    const incorrectWidth = {
      width: 0,
      height: 1,
      longitude: 1,
      latitude: 1,
      workingHours: '11:00-12:00'
    };
    const incorrectLatitude = {
      width: 1,
      height: 1,
      longitude: '',
      latitude: 1,
      workingHours: '11:00-12:00'
    };
    const incorrectWorkingHours = {
      width: 1,
      height: 1,
      longitude: 1,
      latitude: 1,
      workingHours: '11-12'
    };
    expect(validationsArePassed(correctProps)).toBeTruthy();
    expect(validationsArePassed(incorrectWidth)).toBeFalsy();
    expect(validationsArePassed(incorrectLatitude)).toBeFalsy();
    expect(validationsArePassed(incorrectWorkingHours)).toBeFalsy();
  });
});
