import { SET_READER_NAMES } from '../actionTypes';

export const setReaderNames = (readersInfo) => ({
  type: SET_READER_NAMES,
  payload: {
    readersInfo
  }
});
