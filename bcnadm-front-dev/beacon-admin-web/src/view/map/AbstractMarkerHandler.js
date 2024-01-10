/* eslint-disable no-unused-vars */
/* @flow*/

class AbstractMarkerHandler {
  /**
   * createMarker
   * @param {object} mapProvider
   * @param {string} icon
   * @param {object} location
   */
  createMarker(mapProvider, icon, location) {
    throw Error('Method not supported');
  }

  /**
   * createPolyline
   * @param {object} mapProvider
   * @param {object} map
   * @param {array} coordinates
   */
  createPolyline(mapProvider, map, coordinates) {
    throw Error('Method not supported');
  }

  /**
   * createScalingPolyline
   * @param {object} mapProvider
   * @param {object} map
   * @param {array} coordinates
   */
  createScalingPolyline(mapProvider, map, coordinates) {
    throw Error('Method not supported');
  }

  /**
   * setEdgeSeparateListener
   * @param {object} mapProvider
   * @param {object} map
   * @param {object} edge
   * @param {function} onEdgeSeparate
   */
  setEdgeSeparateListener(mapProvider, map, edge, onEdgeSeparate) {
    throw Error('Method not supported');
  }

  /**
   * setScaleEdgeListener
   * @param {object} mapProvider
   * @param {object} edge
   * @param {function} showDialog
   */
  setScaleEdgeListener(mapProvider, edge, showDialog) {
    throw Error('Method not supported');
  }

  /**
   * setEdgeMovingListener
   * @param {object} mapProvider
   * @param {object} map
   * @param {object} edge
   * @param {function} onEdgeMoving
   */
  setEdgeMovingListener(mapProvider, map, edge, onEdgeMoving) {
    throw Error('Method not supported');
  }

  /**
   * setMapListener
   * @param {object} mapProvider
   * @param {object} map
   * @param {function} setMarker
   */
  setMapListener(mapProvider, map, setMarker) {
    throw Error('Method not supported');
  }

  /**
   * setMapRightClickListener
   * @param {object} mapProvider
   * @param {object} map
   * @param {function} stopVerticesChain
   */
  setMapRightClickListener(mapProvider, map, stopVerticesChain) {
    throw Error('Method not supported');
  }

  /**
   * setVertexClickListener
   * @param {object} mapProvider
   * @param {object} marker
   * @param {function} connectMarkers
   * @param {function} changeVertexIcon
   */
  setVertexClickListener(mapProvider, marker, connectMarkers, changeVertexIcon) {
    throw Error('Method not supported');
  }

  /**
   * setDragEndListener
   * @param {object} mapProvider
   * @param {object} marker
   * @param {function} save
   */
  setDragEndListener(mapProvider, marker, save) {
    throw Error('Method not supported');
  }

  /**
   * setDragStartListener
   * @param {object} mapProvider
   * @param {object} map
   * @param {object} marker
   * @param {function} onMarkerDragStart
   */
  setDragStartListener(mapProvider, map, marker, onMarkerDragStart) {
    throw Error('Method not supported');
  }

  /**
   * setRightClickListener
   * @param {object} mapProvider
   * @param {object} marker
   * @param {function} remove
   */
  setRightClickListener(mapProvider, marker, remove) {
    throw Error('Method not supported');
  }

  /**
   * setClickListener
   * @param {object} mapProvider
   * @param {object} marker
   * @param {function} edit
   */
  setClickListener(mapProvider, marker, edit) {
    throw Error('Method not supported');
  }

  /**
   * removeScaleEdgeListener
   * @param {object} mapProvider
   * @param {object} edge
   */
  removeScaleEdgeListener(mapProvider, edge) {
    throw Error('Method not supported');
  }

  /**
   * removeEdgeSeparateListener
   * @param {object} mapProvider
   * @param {object} edge
   */
  removeEdgeSeparateListener(mapProvider, edge) {
    throw Error('Method not supported');
  }

  /**
   * removeEdgeMovingListener
   * @param {object} mapProvider
   * @param {object} edge
   */
  removeEdgeMovingListener(mapProvider, edge) {
    throw Error('Method not supported');
  }

  /**
   * removeMapListener
   * @param {object} mapProvider
   * @param {object} map
   */
  removeMapListener(mapProvider, map) {
    throw Error('Method not supported');
  }

  /**
   * removeDragEndListener
   * @param {object} mapProvider
   * @param {object} marker
   */
  removeDragEndListener(mapProvider, marker) {
    throw Error('Method not supported');
  }

  /**
   * removeDragStartListener
   * @param {object} mapProvider
   * @param {object} marker
   */
  removeDragStartListener(mapProvider, marker) {
    throw Error('Method not supported');
  }

  /**
   * removeRightClickListener
   * @param {object} mapProvider
   * @param {object} marker
   */
  removeRightClickListener(mapProvider, marker) {
    throw Error('Method not supported');
  }

  /**
   * removeClickListener
   * @param {object} mapProvider
   * @param {object} marker
   */
  removeClickListener(mapProvider, marker) {
    throw Error('Method not supported');
  }

  /**
   * removeVertexClickListener
   * @param {object} mapProvider
   * @param {object} marker
   */
  removeVertexClickListener(mapProvider, marker) {
    throw Error('Method not supported');
  }

  /**
   * setMarkerOnMap
   * @param {object} marker
   * @param {object} map
   */
  setMarkerOnMap(marker, map) {
    throw Error('Method not supported');
  }

  /**
   * setEdgeOnMap
   * @param {object} edge
   * @param {object} map
   */
  setEdgeOnMap(edge, map) {
    throw Error('Method not supported');
  }

  /**
   * removeMarkerFromMap
   * @param {object} marker
   */
  removeMarkerFromMap(marker) {
    throw Error('Method not supported');
  }

  /**
   * removeEdgeFromMap
   * @param {object} edge
   */
  removeEdgeFromMap(edge) {
    throw Error('Method not supported');
  }

  /**
   * setDraggable
   * @param {object} marker
   */
  setDraggable(marker) {
    throw Error('Method not supported');
  }

  /**
   * setUndraggable
   * @param {object} marker
   */
  setUndraggable(marker) {
    throw Error('Method not supported');
  }

  /**
   * setInfoTooltip
   * @param {object} mapProvider
   * @param {object} marker
   * @param {object} map
   * @param {promise} info
   */
  setInfoTooltip(mapProvider, marker, map, info) {
    throw Error('Method not supported');
  }

  /**
   * setEdgeInfoTooltip
   * @param {object} mapProvider
   * @param {object} edge
   * @param {object} map
   * @param {promise} info
   */
  setEdgeInfoTooltip(mapProvider, edge, map, info) {
    throw Error('Method not supported');
  }
}

export default AbstractMarkerHandler;
