import axios from 'axios/index';

import { linkBuilder } from 'src/utils/UrlBuilders/linkBuilder';
import { ServerError } from 'src/utils/customErrors';

const UserProfileService = {};
const USE_SLASH = true;

/**
 * Function for getting UserProfile from backend.
 * @function getCurrentUserProfile
 * @returns {Promise<any>}
 */
UserProfileService.getCurrentUserProfile = () =>
  axios({
    headers: {
      'Accept': 'application/json'
    },
    method: 'get',
    url: linkBuilder().user().current().and().build()
  })
    .then((profileResponse) => {
      if (profileResponse.data) {
        profileResponse.data.image = linkBuilder().user().current().image().and().build();
        return profileResponse.data;
      }
      return profileResponse;
    })
    .catch((err) => {
      if (err.response) {
        throw new ServerError(err.response, err.message);
      }
      throw err;
    });

const saveProfile = (profile) =>
  axios({
    headers: {
      'Accept': 'application/json'
    },
    method: 'put',
    data: profile,
    url: linkBuilder().user().and().build(USE_SLASH)
  })
    .then((response) => response.data)
    .catch((err) => {
      if (err.response) {
        throw new ServerError(err.response, err.message);
      }
      throw err;
    });

const saveImage = (image, parentId) => {
  const formData = new FormData();
  formData.set('file', image);

  return axios({
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    method: 'post',
    data: formData,
    url: linkBuilder().files(parentId).upload().build()
  }).then((response) => response.data);
};

const setFileId = (userDto, entityId) => {
  delete userDto.image;
  userDto.fileId = entityId;
  return userDto;
};

/**
 * Save current UserProfile data
 * @function saveCurrentUserProfile
 * @param profile user profile to be saved
 */
// TODO: what's the difference between this method and saveProfile
UserProfileService.saveCurrentUserProfile = (profile) => {
  const image = profile.image;

  if (!(image instanceof File)) {
    const userDto = setFileId(profile, profile.fileId);

    return saveProfile(userDto);
  }
  return saveImage(image, profile.entityId)
    .then((imageDto) => {
      const userDto = { ...profile };
      const userDtoWithFileId = setFileId(userDto, imageDto?.entityId);
      return saveProfile(userDtoWithFileId);
    })
    .then((profileWithImage) => {
      profileWithImage.image = linkBuilder().user().current().image().and().build();
      return profileWithImage;
    });
};

/**
 * Function for checking new user's login
 * @function isValidCurrentUserLogin
 * @param login new user's login
 * @return {bool} does anyone have the same login
 */
UserProfileService.isValidCurrentUserLogin = (login) =>
  axios({
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'get',
    url: linkBuilder().user().checkLogin(login).and().build()
  }).then((response) => {
    const exists = response.data;
    if (exists) {
      throw new Error();
    } else {
      return login;
    }
  });

/**
 * Function for changing user's login
 * @function changeCurrentUserLogin
 * @param login new user's login
 */
UserProfileService.changeCurrentUserLogin = (login) =>
  axios({
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'put',
    data: login,
    url: linkBuilder().user().and().build(USE_SLASH)
  })
    .then((response) => {
      const exists = response.data;
      if (exists) {
        throw new Error();
      } else {
        return login;
      }
    })
    .catch((e) => console.error(e));

/**
 * Function for checking new user's email
 * @function isValidCurrentUserEmail
 * @param email new user's email
 * @return {bool} does anyone have the same email
 */
UserProfileService.isValidCurrentUserEmail = (email) =>
  axios({
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'get',
    url: linkBuilder().user().checkEmail(email).and().build()
  }).then((response) => {
    const exists = response.data;
    if (exists) {
      throw new Error();
    } else {
      return email;
    }
  });

/**
 * Function for changing user's email
 * @function changeCurrentUserEmail
 * @param email new user's email
 */
UserProfileService.changeCurrentUserEmail = (email) =>
  UserProfileService.getCurrentUserProfile().then((profile) => {
    profile.email = email;
    UserProfileService.saveCurrentUserProfile(profile);
  });

/**
 * Function for changing user's password
 * @function changeCurrentUserPassword
 * @param password new user's password
 */
UserProfileService.changeCurrentUserPassword = (password) =>
  axios({
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'put',
    data: password,
    url: linkBuilder().user().and().build(USE_SLASH)
  })
    .then((response) => {
      const exists = response.data;
      if (exists) {
        throw new Error();
      } else {
        return password;
      }
    })
    .catch((e) => console.error(e));

export default UserProfileService;
