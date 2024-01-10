import fetchReaderNamesReducer from 'src/reducers/fetchReaderNamesReducer/index';
import * as example from 'test/__test__/actions';

const initialState = {
  allReaders: []
};

const afterFetchState = {
  allReaders: ['stationIdName', 'stationIdName2']
};

describe('fetchReaderNamesReducer', () => {
  it('should return initial state', () => {
    expect(fetchReaderNamesReducer(undefined, {})).toEqual({
      ...initialState
    });
  });

  it('should handle SET_READER_NAMES', () => {
    expect(fetchReaderNamesReducer(initialState, example.readerNames)).toEqual({
      ...initialState,
      allReaders: afterFetchState.allReaders
    });
  });
});
