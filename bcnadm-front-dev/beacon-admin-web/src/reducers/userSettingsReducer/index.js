import { SAVE_USER_SETTINGS, UPDATE_USER_AVATAR } from 'src/actions/actionTypes';
import { SET_INITIAL_PAGE, SET_LOGGED_IN, SET_LOGGED_OUT } from 'src/actions/authorization/actionTypes';
import { DEFAULT_INITIAL_PAGE } from 'src/consts/RouteConsts';

const initialState = {
  settings: {
    locale: '',
    userIcon: '',
    firstName: '',
    lastName: ''
  },
  isLogged: false,
  initialPage: DEFAULT_INITIAL_PAGE,
  avatar: '/api/v1/users/current/image'
};

export default function userSettingsReducer(state = initialState, action) {
  switch (action.type) {
    case SAVE_USER_SETTINGS:
      return {
        ...state,
        settings: action.payload.settings
      };
    case SET_LOGGED_IN:
      return {
        ...state,
        isLogged: true
      };
    case SET_LOGGED_OUT:
      return {
        ...state,
        isLogged: false
      };
    case SET_INITIAL_PAGE:
      return {
        ...state,
        initialPage: action.payload.initialPage
      };
    case UPDATE_USER_AVATAR:
      return {
        ...state,
        avatar: action.payload.link
      };
    default:
      return state;
  }
}
