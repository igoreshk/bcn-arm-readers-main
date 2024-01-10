import { validate } from './validate';

const err = { uuid: 'error text' };

const emptyReaderName = [null, undefined, ''];

const semiReaderNames = ['readerThree', 'readerFour', 'readerFive', 'readerSome'];

const newReaderNames = ['1111', 'NameSmth', 'anotherName', 'someReader'];

const values = {
  uuid: null,
  allReaders: ['readerOne', 'readerTwo', 'readerThree', 'readerFour', 'readerFive', 'readerSome']
};

describe('validation reader name test', () => {
  it('should return that field shouldn"t be empty', () => {
    emptyReaderName.forEach((elem) => {
      values.uuid = elem;
      expect(
        validate(values, {
          translate: () => 'error text'
        })
      ).toEqual(err);
    });
  });

  it('should return err if name already exist', () => {
    semiReaderNames.forEach((elem) => {
      values.uuid = elem;
      expect(
        validate(values, {
          translate: () => 'error text'
        })
      ).toEqual(err);
    });
  });

  it('should not return errors', () => {
    newReaderNames.forEach((elem) => {
      values.uuid = elem;
      expect(
        validate(values, {
          translate: () => 'error text'
        })
      ).toEqual({});
    });
  });
});
