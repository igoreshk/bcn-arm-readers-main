import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import MapBar from '../MapBar';
import { modes } from '../MapConsts';

export function EdgeMarkerHolder({
  loadMarkers,
  update,
  markerDragged,
  setMapListener,
  setMarkerListeners,
  markerHandler,
  onRemoveAllMarkers,
  changeEditMode,
  buildingSizeForScaleMode,
  levelNumber,
  selectedMapProviderName,
  selectedMapProvider,
  selectedMap,
  match: {
    params: { level: levelId, layer: currentMode }
  }
}) {
  const initialState = useRef({ vertices: [], edges: [] });
  const prevMarkers = useRef(initialState.current);
  const [markerHolder, setMarkerHolder] = useState(initialState.current);
  let isComponentUnmount = false;

  useEffect(() => {
    loadData();
    return () => {
      isComponentUnmount = true;
    };
  }, [update]);

  useEffect(() => {
    if (isMapProviderCorrect()) {
      updateMap();
    }
  }, [markerHolder]);

  useEffect(() => {
    // for ROUTE_MODE
    clearEdgeFromMap(markerDragged);
  }, [markerDragged]);

  async function loadData() {
    try {
      const newMarkers = await loadMarkers();
      if (!isComponentUnmount) {
        prevMarkers.current = markerHolder;
        setMarkerHolder(newMarkers);
      }
    } catch (err) {
      console.error(err);
    }
  }

  function updateMap() {
    setMapListener();
    renderMarkers();
  }

  function isMapProviderCorrect() {
    if (selectedMap && selectedMapProvider && selectedMapProviderName === selectedMap.provider) {
      // For Google map
      if (selectedMapProvider.maps !== undefined) {
        return true;
      }
      // For OSM
      if (selectedMapProvider.L !== undefined) {
        return true;
      }
    }
    return false;
  }

  function renderMarkers() {
    const { vertices, edges } = markerHolder;
    clearMarkersFromMap(prevMarkers.current.vertices, prevMarkers.current.edges);
    setMarkersOnMap(vertices, edges);
    setMarkerListeners(vertices, edges);
  }

  function clearMarkersFromMap(oldMarkers, oldEdges) {
    oldMarkers.forEach((marker) => {
      markerHandler.removeMarkerFromMap(marker, selectedMap);
    });
    oldEdges.forEach((edge) => {
      markerHandler.removeEdgeFromMap(edge, selectedMap);
    });
  }

  function clearEdgeFromMap(marker) {
    if (marker && markerHolder.edges.length !== 0) {
      if (currentMode === modes.SCALE_MODE) {
        markerHandler.removeEdgeFromMap(markerHolder.edges[0], selectedMap);
      }
      markerHolder.edges.forEach((edge) => {
        if (marker.entityId === edge.startVertexId || marker.entityId === edge.endVertexId) {
          markerHandler.removeEdgeFromMap(edge, selectedMap);
        }
      });
    }
  }

  function setMarkersOnMap(newMarkers, newEdges) {
    newMarkers.forEach((marker) => {
      markerHandler.setMarkerOnMap(marker, selectedMap);
    });
    newEdges.forEach((edge) => {
      markerHandler.setEdgeOnMap(edge, selectedMap);
    });
  }

  function handleRemoveMarkers() {
    const { vertices, edges } = markerHolder;
    clearMarkersFromMap(vertices, edges);
    onRemoveAllMarkers(levelId);
  }
  return (
    <MapBar
      levelNumber={levelNumber}
      selectedMapProviderName={selectedMapProviderName}
      handleRemoveMarkers={handleRemoveMarkers}
      changeEditMode={changeEditMode}
      buildingSizeForScaleMode={buildingSizeForScaleMode}
    />
  );
}

const mapStateToProps = (state) => ({
  levelNumber: state.activeLevelInfo.currentLevel.number,
  selectedMapProviderName: state.mapSettings.selectedMapProviderName,
  selectedMapProvider: state.mapSettings.selectedMapProvider,
  selectedMap: state.mapSettings.selectedMap
});

EdgeMarkerHolder.propTypes = {
  loadMarkers: PropTypes.func.isRequired,
  setMapListener: PropTypes.func.isRequired,
  setMarkerListeners: PropTypes.func.isRequired,
  markerHandler: PropTypes.object.isRequired,
  onRemoveAllMarkers: PropTypes.func.isRequired,
  changeEditMode: PropTypes.func.isRequired,
  update: PropTypes.bool.isRequired,
  levelNumber: PropTypes.number,
  selectedMapProviderName: PropTypes.string.isRequired,
  selectedMapProvider: PropTypes.object.isRequired,
  selectedMap: PropTypes.object.isRequired,
  buildingSizeForScaleMode: PropTypes.object,
  markerDragged: PropTypes.object
};

export default withRouter(connect(mapStateToProps)(EdgeMarkerHolder));
