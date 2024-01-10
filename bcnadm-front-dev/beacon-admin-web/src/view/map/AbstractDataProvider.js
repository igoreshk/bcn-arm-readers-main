/* eslint-disable no-unused-vars */
/* @flow*/

class AbstractDataProvider {
  /**
   * @param {string} buildingId
   * @param {string} levelId
   * @param {object} dto
   * @param {object} entityId
   * @returns {Promise}
   */
  getDtos(buildingId, levelId) {
    throw Error('Method not supported');
  }

  getDto(buildingId, levelId, markerId) {
    throw Error('Method not supported');
  }

  saveDto(buildingId, levelId, dto) {
    throw Error('Method not supported');
  }

  removeDto(buildingId, levelId, dto) {
    throw Error('Method not supported');
  }

  removeAll(buildingId, levelId) {
    throw Error('Method not supported');
  }
}

export default AbstractDataProvider;
