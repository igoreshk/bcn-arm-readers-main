import axios from 'axios';

import { linkBuilder } from 'src/utils/UrlBuilders/linkBuilder';

const UserService = {};

/**
 * Request for getting specific user using id is performed
 * passing response's data forward as resolve function parameter
 * @return {Promise}
 */

UserService.findOne = (userId) => axios.get(linkBuilder().user(userId).and().build()).then((response) => response.data);

/**
 * Request for deleting specific user using id is performed
 * passing response's data forward as resolve function parameter
 * @return {Promise}
 */
UserService.remove = (userId) =>
  axios.delete(linkBuilder().user(userId).and().build()).then((response) => response.data);

/**
 * Request for getting array of users is performed
 * passing response's data forward as resolve function parameter
 * @return {Promise}
 */
UserService.findAll = () => {
  const usersUrl = linkBuilder().user().and().build();

  return axios.get(usersUrl).then((response) => response.data);
};

/**
 * Depending on type of operation (user saving/edition, determined by presence of id)
 * put or post request is performed, returning Promise that allows caller to wait
 * for request completion
 * @return {Promise}
 */
UserService.saveUser = (user) => {
  if (user.login === null) {
    user.login = user.email;
  }
  return axios({
    headers: {
      'Accept': 'application/json'
    },
    method: user.entityId ? 'put' : 'post',
    url: linkBuilder().user().and().build(),
    data: user
  }).then((response) => response.data);
};

export { UserService };
