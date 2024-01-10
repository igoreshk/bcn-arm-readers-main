// @flow

import { linkBuilder } from 'src/utils/UrlBuilders/linkBuilder';
import axios from 'axios';

const BeaconService = {};

/**
 * Request for getting beacons by level is performed
 * passing response's data forward as resolve function parameter
 * @return {Promise}
 */
BeaconService.findByLevel = (levelId) =>
  axios.get(linkBuilder().beacon().and().byLevel(levelId).and().build()).then((response) => response.data);

/**
 * Request for getting beacons by level is performed
 * passing response's data forward as resolve function parameter
 * @return {Promise}
 */
BeaconService.findOne = (beaconId: String) =>
  axios.get(linkBuilder().beacon(beaconId).and().build()).then((response) => response.data);

/**
 * Request for getting beacons is performed
 * passing response's data forward as resolve function parameter
 * @return {Promise}
 */
BeaconService.findALlBeacons = () => axios.get(linkBuilder().beacon().and().build()).then((response) => response.data);
/**
 * Save beacon using post request
 * returning Promise that allows caller to wait
 * for request completion
 * @return {Promise}
 */
BeaconService.saveBeacon = (beacon: {}) =>
  axios({
    headers: {
      'Accept': 'application/json'
    },
    method: 'post',
    url: linkBuilder().beacon().and().build(),
    data: beacon
  }).then((response) => response.data);

/**
 * Delete beacon using delete request
 * returning Promise that allows caller to wait
 * for request completion
 * @return {Promise}
 */
BeaconService.deleteBeacon = (beacon) => axios.delete(linkBuilder().beacon(beacon.entityId).and().build());

/** K
 * Delete beacons by specific level using delete request
 * returning Promise that allows caller to wait
 * for request completion
 * @return {Promise}
 */
BeaconService.clearBeacons = (levelId: String) =>
  axios.delete(linkBuilder().beacon().and().byLevel(levelId).and().build());

export { BeaconService };
