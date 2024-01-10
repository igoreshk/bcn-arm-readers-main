import reducer from 'src/reducers/userSettingsReducer/index';
import * as example from 'test/__test__/actions';
import { DEFAULT_INITIAL_PAGE } from 'src/consts/RouteConsts';

const initialState = {
  settings: {
    locale: '',
    userIcon: '',
    firstName: '',
    lastName: ''
  },
  isLogged: false,
  initialPage: DEFAULT_INITIAL_PAGE,
  avatar: '/api/v1/users/current/image'
};

const saveSettingSucceedState = {
  settings: {
    locale: 'ru',
    userIcon: '',
    firstName: 'John',
    lastName: 'Doe'
  }
};

describe('userSettingsReducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({
      ...initialState
    });
  });

  it('should handle SAVE_USER_SETTINGS', () => {
    expect(reducer(initialState, example.userSettings)).toEqual({
      ...initialState,
      settings: saveSettingSucceedState.settings
    });
  });
});
