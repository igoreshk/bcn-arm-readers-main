import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import moxios from 'moxios';
import { fetchCurrentLevel } from './index';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const levelId = '61535be946d2eb4e5810bed7';

const level = {
  buildingId: levelId,
  entityId: '60952c00d9fc0118256dc408',
  northEastLatitude: 50.00125615406551,
  northEastLongitude: 50.00195425434061,
  number: 1,
  scaleDistance: 10,
  scaleEndLatitude: 50.0006172205162,
  scaleEndLongitude: 50.00089585781095,
  scaleStartLatitude: 50.00011551393959,
  scaleStartLongitude: 50.000852942466715,
  southWestLatitude: 49.99874381311278,
  southWestLongitude: 49.99804574565935
};

describe('fetchCurrentLevel actions', () => {
  beforeEach(() => {
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
  });

  it('dispatch `setCurrentLevel` after successfully fetching', () => {
    const LEVEL_CUR_URL = `${process.env.API_PREFIX}/levels/${levelId}`;
    moxios.stubRequest(LEVEL_CUR_URL, {
      status: 200,
      response: level
    });

    const expectedAction = [{ type: 'activeLevelInfo/setCurrentLevel', payload: { level } }];

    const store = mockStore({ data: {} });

    return store.dispatch(fetchCurrentLevel({ levelId })).then(() => {
      expect(store.getActions()).toEqual(expect.arrayContaining(expectedAction));
    });
  });

  it('dispatch `setLevelFetchedStatus` after successfully fetching', () => {
    const LEVEL_CUR_URL = `${process.env.API_PREFIX}/levels/${levelId}`;
    moxios.stubRequest(LEVEL_CUR_URL, {
      status: 200,
      response: level
    });

    const expectedAction = [
      { type: 'activeLevelInfo/setLevelFetchedStatus', payload: { isCurrentLevelFetched: true } }
    ];

    const store = mockStore({ data: {} });

    return store.dispatch(fetchCurrentLevel({ levelId })).then(() => {
      expect(store.getActions()).toEqual(expect.arrayContaining(expectedAction));
    });
  });
});
