// @flow
import { DEFAULT } from 'src/utils/popUpConsts';
import { ADD_POPUP_TEXT, REMOVE_POPUP_TEXT } from './session/actionTypes';

export const addPopupMessageText = (text, style = DEFAULT) => ({
  type: ADD_POPUP_TEXT,
  text,
  style
});

export const removePopupMessageText = () => ({
  type: REMOVE_POPUP_TEXT
});
