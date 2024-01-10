/* eslint-disable no-unused-vars */
/* @flow*/

export default class AbstractMapConfiguration {
  /**
   * createMap
   * @returns {Promise}
   */
  createMap() {
    throw Error('Method not supported');
  }

  /**
   * setMapBackground
   * @param {object} map
   * @returns {void}
   */
  setMapBackground(map) {
    throw Error('Method not supported');
  }

  /**
   * getImageAndCalculateBounds
   * @param {object} map
   * @param {string} levelId
   * @param {string} buildingId
   * @returns {Promise}
   */
  getImageAndCalculateBounds(map, levelId, buildingId) {
    throw Error('Method not supported');
  }

  /**
   * configureOverlay
   * @param {object} map
   * @param {object} bounds
   * @param {string} image
   * @returns {Promise}
   */
  configureOverlay(map, bounds, image) {
    throw Error('Method not supported');
  }

  /**
   * setMapDraggingListener
   * @param {object} map
   * @param {object} bounds
   */
  setMapDraggingListener(map, bounds) {
    throw Error('Method not supported');
  }
}
