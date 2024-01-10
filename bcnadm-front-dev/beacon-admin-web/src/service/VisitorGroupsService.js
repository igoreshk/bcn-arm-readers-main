import axios from 'axios';

import { linkBuilder } from 'src/utils/UrlBuilders/linkBuilder';

const VisitorGroupsService = {};

/**
 * Request for getting specific watcher using id is performed
 * passing response's data forward as resolve function parameter
 * @return {Promise}
 */
VisitorGroupsService.findOne = (watcherId) =>
  axios.get(linkBuilder().visitorGroup(watcherId).and().build()).then((response) => response.data);

/**
 * Request for deleting specific watcher using id is performed
 * passing response's data forward as resolve function parameter
 * @return {Promise}
 */
VisitorGroupsService.remove = (watcherId) =>
  axios.delete(linkBuilder().visitorGroup(watcherId).and().build()).then((response) => response.data);

/**
 * Request for getting array of watchers is performed
 * passing response's data forward as resolve function parameter
 * @return {Promise}
 */

VisitorGroupsService.findAll = () =>
  axios.get(linkBuilder().visitorGroup().and().build()).then((response) => response.data);

/**
 * Depending on type of operation (watcher saving/edition, determined by presence of id)
 * put or post request is performed, returning Promise that allows caller to wait
 * for request completion
 * @return {Promise}
 */
VisitorGroupsService.saveWatcher = (watcher) => {
  return axios({
    headers: {
      Accept: 'application/json'
    },
    method: 'post',
    url: linkBuilder().visitorGroup().and().build(),
    data: watcher
  }).then((response) => response.data);
};

export default VisitorGroupsService;
