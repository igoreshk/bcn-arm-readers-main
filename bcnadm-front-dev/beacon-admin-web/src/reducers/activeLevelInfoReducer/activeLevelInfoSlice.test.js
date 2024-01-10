import activeLevelInfo, {
  setCurrentLevel,
  setCurrentBuilding,
  resetScaleEdge,
  setScaleVertices,
  resetTemporaryScaleEdge,
  setLevelFetchedStatus
} from './activeLevelInfoSlice';

const levelId = '60952c00d9fc0118256dc408';
const levelInitialState = {
  number: null,
  scaleDistance: 0,
  scaleEndLatitude: 0,
  scaleEndLongitude: 0,
  scaleStartLatitude: 0,
  scaleStartLongitude: 0
};

const initialState = {
  currentLevel: levelInitialState,
  currentBuilding: null,
  temporaryScaleEdge: null,
  isCurrentLevelFetched: false
};

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

const building = {
  entityId: '610cfe23253c1321a5e722f9',
  address: 'address',
  createdBy: null,
  height: 150,
  latitude: 59.99365078246664,
  longitude: 30.09487368618287,
  name: null,
  phoneNumber: null,
  width: 200,
  workingHours: null
};

const temporaryScaleEdge = {
  scaleDistance: 10,
  scaleEndLatitude: 50.0006172205162,
  scaleEndLongitude: 50.00089585781095,
  scaleStartLatitude: 50.00011551393959,
  scaleStartLongitude: 50.000852942466715
};

const vertices = {
  scaleEndLatitude: 40.0006172205162,
  scaleEndLongitude: 20.00089585781095,
  scaleStartLatitude: 40.00011551393959,
  scaleStartLongitude: 20.000852942466715
};

describe('activeLevelInfo reducer', () => {
  it('should return the initial state', () => {
    expect(activeLevelInfo(undefined, {})).toEqual(initialState);
  });

  it('should handle setCurrentLevel properly', () => {
    expect(
      activeLevelInfo(initialState, {
        type: setCurrentLevel.type,
        payload: { level }
      })
    ).toEqual({
      ...initialState,
      currentLevel: level
    });
  });

  it('should handle setCurrentBuilding properly', () => {
    expect(
      activeLevelInfo(initialState, {
        type: setCurrentBuilding.type,
        payload: { building }
      })
    ).toEqual({
      ...initialState,
      currentBuilding: building
    });
  });

  it('should handle resetScaleEdge properly', () => {
    expect(
      activeLevelInfo(
        {
          ...initialState,
          currentLevel: level,
          temporaryScaleEdge
        },
        {
          type: resetScaleEdge.type
        }
      )
    ).toEqual(initialState);
  });

  it('should handle setScaleVertices properly', () => {
    expect(
      activeLevelInfo(
        {
          ...initialState,
          currentLevel: level,
          temporaryScaleEdge
        },
        {
          type: setScaleVertices.type,
          payload: { vertices }
        }
      )
    ).toEqual({
      ...initialState,
      currentLevel: level,
      temporaryScaleEdge: {
        ...temporaryScaleEdge,
        ...vertices
      }
    });
  });

  it('should handle setScaleVertices properly', () => {
    expect(
      activeLevelInfo(
        {
          ...initialState,
          currentLevel: level,
          temporaryScaleEdge
        },
        {
          type: setScaleVertices.type,
          payload: { vertices }
        }
      )
    ).toEqual({
      ...initialState,
      currentLevel: level,
      temporaryScaleEdge: {
        ...temporaryScaleEdge,
        ...vertices
      }
    });
  });

  it('should handle resetTemporaryScaleEdge properly', () => {
    expect(
      activeLevelInfo(
        {
          ...initialState,
          temporaryScaleEdge
        },
        {
          type: resetTemporaryScaleEdge.type
        }
      )
    ).toEqual({
      ...initialState
    });
  });

  it('should handle setLevelFetchedStatus properly', () => {
    expect(
      activeLevelInfo(initialState, {
        type: setLevelFetchedStatus.type,
        payload: { isCurrentLevelFetched: true }
      })
    ).toEqual({
      ...initialState,
      isCurrentLevelFetched: true
    });
  });
});
