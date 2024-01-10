import { ADD_POPUP_TEXT, REMOVE_POPUP_TEXT } from 'src/actions/session/actionTypes';

const initialState = {
  popupText: [],
  popupStyle: []
};

export default function popupMessageReducer(state = initialState, action) {
  const { popupText, popupStyle } = state;
  switch (action.type) {
    case ADD_POPUP_TEXT:
      return {
        ...state,
        popupText: [...popupText, action.text],
        popupStyle: [...popupStyle, action.style]
      };
    case REMOVE_POPUP_TEXT:
      return {
        ...state,
        popupText: popupText.slice(1),
        popupStyle: popupStyle.slice(1)
      };

    default:
      return state;
  }
}
