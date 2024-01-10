import { validate } from './validate';

const translate = jest.fn((arg) => arg);

const tooShortDeviceIdMock = '';
const tooLongDeviceIdMock = `Aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa11111dddddddddddddddddd43
y3u298yhhhhhhhhhhhhhhhAaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa111hhhhAaaaaaaaaaaaaaaaaaaaaaaaa
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa111`;
const notAlphaNumericDeviceIdMock1 = '/sjj';
const notAlphaNumericDeviceIdMock2 = ' ';
const notAlphaNumericDeviceIdMock3 = 'ы';
const validDeviceIdMock1 = '1';
const validDeviceIdMock2 = 'h';
const validDeviceIdMock3 = 'hs7878GT';
const validNameMock = 'some valid name';

const propsMockAllIsUnique = {
  translate,
  isAppropriateName: true,
  isAppropriateDeviceId: true
};
const propsMockDeviceIdIsNotUnique = {
  translate,
  isAppropriateName: true,
  isAppropriateDeviceId: false
};
const propsMockNameIsNotUnique = {
  translate,
  isAppropriateName: false,
  isAppropriateDeviceId: true
};
const propsMockNameAndDeviceIdAreNotUnique = {
  translate,
  isAppropriateName: false,
  isAppropriateDeviceId: false
};

const values = {
  name: 'some valid name',
  deviceId: validDeviceIdMock1
};

describe('Visitor deviceId format validation', () => {
  it('should return an object with an error if deviceId shorter than 1 symbol', () => {
    expect(validate({ deviceId: tooShortDeviceIdMock, name: validNameMock }, propsMockAllIsUnique)).toEqual({ deviceId: 'validation.required' });
  });

  it('should return an object with an error if deviceId longer than 200 symbols', () => {
    expect(validate({ deviceId: tooLongDeviceIdMock, name: validNameMock }, propsMockAllIsUnique)).toEqual({ deviceId: 'validation.invalidDeviceId' });
  });

  it('should return an object with an error if deviceId anything than alphanumeric symbols, english alphabet', () => {
    expect(validate({ deviceId: notAlphaNumericDeviceIdMock1, name: validNameMock }, propsMockAllIsUnique)).toEqual({ deviceId: 'validation.invalidDeviceId' });
    expect(validate({ deviceId: notAlphaNumericDeviceIdMock2, name: validNameMock }, propsMockAllIsUnique)).toEqual({ deviceId: 'validation.invalidDeviceId' });
    expect(validate({ deviceId: notAlphaNumericDeviceIdMock3, name: validNameMock }, propsMockAllIsUnique)).toEqual({ deviceId: 'validation.invalidDeviceId' });
  });

  it('should return an empty object if deviceId is 1-200 symbols long and alphanumeric', () => {
    expect(validate({ deviceId: validDeviceIdMock1, name: validNameMock }, propsMockAllIsUnique)).toEqual({});
    expect(validate({ deviceId: validDeviceIdMock2, name: validNameMock }, propsMockAllIsUnique)).toEqual({});
    expect(validate({ deviceId: validDeviceIdMock3, name: validNameMock }, propsMockAllIsUnique)).toEqual({});
  });
});

describe('Visitor deviceId uniqueness validation', () => {
  it('should return an object with an error if deviceId is not appropriate (unique)', () => {
    expect(validate(values, propsMockDeviceIdIsNotUnique)).toEqual({ deviceId: 'visitors.dialog.uniqueDeviceIdError' });
  });

  it('should return an empty object if deviceId is appropriate (unique)', () => {
    expect(validate(values, propsMockAllIsUnique)).toEqual({});
  });
});

describe('Visitor name uniqueness validation', () => {
  it('should return an object with an error if visitor name is not appropriate (unique)', () => {
    expect(validate(values, propsMockNameIsNotUnique)).toEqual({ name: 'visitors.dialog.uniqueVisitorNameError' });
  });

  it('should return an empty object if name is appropriate (unique)', () => {
    expect(validate(values, propsMockAllIsUnique)).toEqual({});
  });
});

describe('Visitor name and deviceId uniqueness validation (together)', () => {
  it('should return an object with two errors if both visitor name and deviceId are not appropriate (unique)', () => {
    expect(validate(values, propsMockNameAndDeviceIdAreNotUnique)).toEqual({ deviceId: 'visitors.dialog.uniqueDeviceIdError', name: 'visitors.dialog.uniqueVisitorNameError' });
  });
});
