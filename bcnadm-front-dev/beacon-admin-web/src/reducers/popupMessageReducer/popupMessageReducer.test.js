import { ADD_POPUP_TEXT, REMOVE_POPUP_TEXT } from 'src/actions/session/actionTypes';
import popupMessageReducer from 'src/reducers/popupMessageReducer/index';

const initialState = {
  popupText: [],
  popupStyle: []
};

const initialStateAdd = {
  popupText: ['request successful'],
  popupStyle: ['successful']
};

const text = 'request error';
const style = 'error';

describe('popupMessageReducer', () => {
  it('should return the initial state', () => {
    expect(popupMessageReducer(undefined, {})).toEqual({
      ...initialState
    });
  });

  it('should handle ADD_POPUP_TEXT', () => {
    expect(
      popupMessageReducer(initialStateAdd, {
        type: ADD_POPUP_TEXT,
        text,
        style
      })
    ).toEqual({
      popupText: ['request successful', 'request error'],
      popupStyle: ['successful', 'error']
    });
  });

  it('should handle REMOVE_POPUP_TEXT', () => {
    expect(
      popupMessageReducer(initialStateAdd, {
        type: REMOVE_POPUP_TEXT
      })
    ).toEqual({
      popupText: [],
      popupStyle: []
    });
  });
});
