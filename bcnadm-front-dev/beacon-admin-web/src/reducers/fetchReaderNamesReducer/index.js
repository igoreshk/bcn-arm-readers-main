import { SET_READER_NAMES } from 'src/actions/actionTypes';

const initialState = {
  allReaders: []
};

export default function fetchReaderNamesReducer(state = initialState, action) {
  switch (action.type) {
    case SET_READER_NAMES:
      return { ...state, allReaders: action.payload.readersInfo.map((readerInfo) => readerInfo.uuid) };
    default:
      return state;
  }
}
