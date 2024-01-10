/* eslint-disable no-unused-vars */
/* @flow*/
import { Component } from 'react';

class AbstractWithMarkers extends Component {
  /**
   * @param {object} marker
   * @returns {void}
   */
  onMarkerSelect(marker) {
    throw Error('This is the abstract class');
  }

  /**
   * @returns {Promise}
   */
  onMarkerRemove(marker) {
    throw Error('This is the abstract class');
  }

  onMarkerDragStart() {
    throw Error('This is the abstract class');
  }

  onMarkerDrop() {
    throw Error('This is the abstract class');
  }

  /**
   * @returns {Promise}
   */
  onMarkerDragEnd(marker) {
    throw Error('This is the abstract class');
  }

  /**
   * @returns {void}
   */
  onMarkerCreate(location) {
    throw Error('This is the abstract class');
  }

  /**
   * @param {String} levelId
   * @returns {Promise}
   */
  onRemoveAllMarkers(levelId) {
    throw Error('This is the abstract class');
  }

  /**
   * @returns {String}
   */
  infoTooltip(marker) {
    throw Error('This is the abstract class');
  }

  changeEditMode() {
    throw Error('This is the abstract class');
  }
}

export default AbstractWithMarkers;
