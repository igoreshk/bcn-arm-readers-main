import { createAsyncThunk } from '@reduxjs/toolkit';
import { LevelService } from 'src/service/LevelService';
import { setCurrentLevel, setLevelFetchedStatus } from 'src/reducers/activeLevelInfoReducer/activeLevelInfoSlice';

export const fetchCurrentLevel = createAsyncThunk(
  'activeLevelInfo/fetchCurrentLevel',
  async ({ levelId }, { dispatch }) => {
    try {
      const level = await LevelService.getLevel(levelId);
      dispatch(setCurrentLevel({ level }));
      dispatch(setLevelFetchedStatus({ isCurrentLevelFetched: true }));
    } catch (err) {
      console.error(err);
    }
  }
);
