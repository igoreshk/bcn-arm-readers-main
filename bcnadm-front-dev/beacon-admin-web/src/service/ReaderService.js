// @flow

import axios from 'axios';
import { linkBuilder } from 'src/utils/UrlBuilders/linkBuilder';

const ReadersService = {};

/**
 * Request for getting readers by level is performed
 * passing response's data forward as resolve function parameter
 * @return {Promise}
 */
ReadersService.findByLevel = (levelId) =>
  axios.get(linkBuilder().reader().and().byLevel(levelId).and().build()).then((response) => response.data);

/**
 * Request for getting readers by level is performed
 * passing response's data forward as resolve function parameter
 * @return {Promise}
 */
ReadersService.findOne = (readerId: String) =>
  axios.get(linkBuilder().reader(readerId).and().build()).then((response) => response.data);

/**
 * Save reader using post request
 * returning Promise that allows caller to wait
 * for request completion
 * @return {Promise}
 */
ReadersService.saveReader = (reader: {}) =>
  axios({
    headers: {
      'Accept': 'application/json'
    },
    method: 'post',
    url: linkBuilder().reader().and().build(),
    data: reader
  }).then((response) => response.data);

/**
 * Delete reader using delete request
 * returning Promise that allows caller to wait
 * for request completion
 * @return {Promise}
 */
ReadersService.deleteReader = (reader) => axios.delete(linkBuilder().reader(reader.entityId).and().build());

/** K
 * Delete readers by specific level using delete request
 * returning Promise that allows caller to wait
 * for request completion
 * @return {Promise}
 */
ReadersService.clear = (levelId: String) => axios.delete(linkBuilder().reader().and().byLevel(levelId).and().build());

ReadersService.getAllReaders = () => axios.get(linkBuilder().readers().and().build()).then((response) => response.data);

export { ReadersService };
