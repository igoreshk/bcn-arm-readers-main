import { SAVE_USER_SETTINGS } from '../actionTypes';

export const saveUserSettings = (settings) => ({
  type: SAVE_USER_SETTINGS,
  payload: {
    settings
  }
});
