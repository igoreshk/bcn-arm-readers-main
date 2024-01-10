// @flow

import axios from 'axios';

import { linkBuilder } from 'src/utils/UrlBuilders/linkBuilder';

const AreaService = {};

/**
 * Request for getting areas by level id is performed
 * passing response's data forward as resolve function parameter
 * @return {Promise}
 */
AreaService.findAll = (levelId: String) =>
  axios.get(linkBuilder().area().byLevel(levelId).and().build()).then((response) => response.data);

/**
 * Request for getting one area by id is performed
 * passing response's data forward as resolve function parameter
 * @return {Promise}
 */
AreaService.findOne = (areaId: String) =>
  axios.get(linkBuilder().area(areaId).and().build()).then((response) => response.data);

/**
 * Save area using post request
 * returning Promise that allows caller to wait
 * for request completion
 * @return {Promise}
 */
AreaService.saveArea = (area: {}) =>
  axios({
    headers: {
      'Accept': 'application/json'
    },
    method: area.entityId ? 'put' : 'post',
    url: linkBuilder().area().and().build(),
    data: area
  }).then((response) => response.data);

/**
 * Delete area using delete request
 * returning Promise that allows caller to wait
 * for request completion
 * @return {Promise}
 */
AreaService.deleteArea = (areaDto) =>
  axios.delete(linkBuilder().area(areaDto.entityId).and().build()).then((response) => response.data);

/**
 * Delete areas by specific level id using delete request
 * returning Promise that allows caller to wait
 * for request completion
 * @return {Promise}
 */
AreaService.clearAreas = (levelId: String) =>
  axios.delete(linkBuilder().area().byLevel(levelId).and().build()).then((response) => response.data);

export { AreaService };
