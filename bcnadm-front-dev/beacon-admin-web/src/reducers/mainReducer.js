import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { localizeReducer } from 'react-localize-redux';

import buildingsReducer from './buildingsReducer';
import sessionReducer from './sessionReducer';
import userSettingsReducer from './userSettingsReducer';
import loadingReducer from './loadingReducer';
import popupMessageReducer from './popupMessageReducer';
import mapBackgroundReducer from './mapBackgroundReducer/mapBackgroundSlice';
import fetchReaderNamesReducer from './fetchReaderNamesReducer';
import activeLevelInfoReducer from './activeLevelInfoReducer/activeLevelInfoSlice';
import mapSettingsReducer from './mapSettingsReducer/mapSettingsSlice';

const reducers = {
  form: formReducer,
  localize: localizeReducer,
  buildings: buildingsReducer,
  session: sessionReducer,
  userSettings: userSettingsReducer,
  loading: loadingReducer,
  popup: popupMessageReducer,
  readers: fetchReaderNamesReducer,
  mapBackground: mapBackgroundReducer,
  activeLevelInfo: activeLevelInfoReducer,
  mapSettings: mapSettingsReducer
};

const mainReducer = combineReducers(reducers);

export default mainReducer;
