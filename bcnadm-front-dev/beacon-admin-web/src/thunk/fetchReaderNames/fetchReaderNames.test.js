import * as actions from 'src/actions/actionTypes';
import { fetchReaderNames } from 'src/thunk/fetchReaderNames/index';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import moxios from 'moxios';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('fetchReaderNames actions', () => {
  beforeEach(() => {
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
  });

  it('creates SET_READER_NAMES after fetching', () => {
    const READERS_URL = `${process.env.API_PREFIX}/readers`;
    moxios.stubRequest(READERS_URL, {
      status: 200,
      response: 'info'
    });

    const expectedActions = [{ type: actions.SET_READER_NAMES, payload: { readersInfo: 'info' } }];

    const store = mockStore({ });

    return store.dispatch(fetchReaderNames()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
