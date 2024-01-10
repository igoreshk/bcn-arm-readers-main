import { UPDATE_USER_AVATAR } from './actionTypes';

export const updateUserAvatar = (link) => ({
  type: UPDATE_USER_AVATAR,
  payload: {
    link
  }
});
