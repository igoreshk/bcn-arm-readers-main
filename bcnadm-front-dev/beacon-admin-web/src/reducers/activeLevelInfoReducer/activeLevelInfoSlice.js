import { createSlice } from '@reduxjs/toolkit';

const levelInitialState = {
  number: null,
  scaleDistance: 0,
  scaleEndLatitude: 0,
  scaleEndLongitude: 0,
  scaleStartLatitude: 0,
  scaleStartLongitude: 0
};

const activeLevelInfoSlice = createSlice({
  name: 'activeLevelInfo',
  initialState: {
    currentLevel: levelInitialState,
    currentBuilding: null,
    temporaryScaleEdge: null,
    isCurrentLevelFetched: false
  },
  reducers: {
    setCurrentLevel(state, action) {
      state.currentLevel = action.payload.level;
    },
    setCurrentBuilding(state, action) {
      state.currentBuilding = action.payload.building;
    },
    resetScaleEdge(state) {
      state.currentLevel = levelInitialState;
      state.temporaryScaleEdge = null;
    },
    setScaleVertices(state, action) {
      state.temporaryScaleEdge = { ...state.temporaryScaleEdge, ...action.payload.vertices };
    },
    resetTemporaryScaleEdge(state) {
      state.temporaryScaleEdge = null;
    },
    setLevelFetchedStatus(state, action) {
      state.isCurrentLevelFetched = action.payload.isCurrentLevelFetched;
    }
  }
});

export const {
  setCurrentLevel,
  setCurrentBuilding,
  resetScaleEdge,
  setScaleVertices,
  resetTemporaryScaleEdge,
  setLevelFetchedStatus
} = activeLevelInfoSlice.actions;

export default activeLevelInfoSlice.reducer;
