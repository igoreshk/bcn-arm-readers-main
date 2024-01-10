import * as actions from 'src/actions/actionTypes';
import { fetchUserSettings } from 'src/thunk/fetchUserSettings/index';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import moxios from 'moxios';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('fetchUserSettings actions', () => {
  beforeEach(() => {
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
  });

  it('creates SAVE_USER_SETTINGS after successfully fetching', () => {
    const USER_CUR_URL = `${process.env.API_PREFIX}/users/current`;
    moxios.stubRequest(USER_CUR_URL, {
      status: 200,
      response: 'arr'
    });

    const expectedActions = [{ type: actions.SAVE_USER_SETTINGS, payload: { settings: 'arr' } }];

    const store = mockStore({ data: {} });

    return store.dispatch(fetchUserSettings()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
