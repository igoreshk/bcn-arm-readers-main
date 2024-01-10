/* eslint-disable no-unused-vars */
/* @flow */

class AbstractTransformer {
  /**
   * Transforming DataTransferObject to map marker object
   * @param {object} dto
   * @param {object} mapProvider
   * @returns {Object}
   */
  dtoToMarker(
    dto: {
      id: String
    },
    mapProvider: {}
  ): {} {
    throw Error('This is the abstract class');
  }

  /**
   * Transforming map marker object to DataTransferObject
   * @param {object} marker
   * @returns {Object}
   */
  markerToDto(marker: { id: String }): {} {
    throw Error('This is the abstract class');
  }
}

export default AbstractTransformer;
