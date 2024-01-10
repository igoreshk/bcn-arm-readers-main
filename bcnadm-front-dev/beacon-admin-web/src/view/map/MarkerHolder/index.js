import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import MapBar from '../MapBar';

export function MarkerHolder({
  markerHandler,
  vertexDtoToMarker,
  getDtos,
  setMarkerListeners,
  changeEditMode,
  onMarkerCreate,
  onRemoveAllMarkers,
  levelNumber,
  selectedMapProviderName,
  selectedMapProvider,
  selectedMap,
  match: {
    params: { level: levelId, edit: editMode }
  }
}) {
  const initialState = useRef([]);
  const prevMarkers = useRef(initialState.current);
  const [markers, setMarkers] = useState(initialState.current);
  let isComponentUnmount = false;

  useEffect(() => {
    loadMarkers();
    return () => {
      isComponentUnmount = true;
    };
  }, []);

  useEffect(() => {
    if (isMapProviderCorrect()) {
      updateMap();
    }
  }, [markers]);

  async function loadMarkers() {
    try {
      const dtos = await getDtos(levelId);
      if (!isComponentUnmount) {
        prevMarkers.current = markers;
        setMarkers(dtos.map((dto) => vertexDtoToMarker(dto, selectedMapProvider)));
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

  function setMapListener() {
    markerHandler.removeMapListener(selectedMapProvider, selectedMap);
    if (editMode) {
      markerHandler.setMapListener(selectedMapProvider, selectedMap, onMarkerCreate);
    }
  }

  function renderMarkers() {
    clearMarkersFromMap(prevMarkers.current);
    setMarkersOnMap(markers);
    setMarkerListeners(markers);
  }

  function clearMarkersFromMap(oldMarkers) {
    oldMarkers.forEach((marker) => {
      markerHandler.removeMarkerFromMap(marker, selectedMap);
    });
  }

  function setMarkersOnMap(newMarkers) {
    newMarkers.forEach((marker) => {
      markerHandler.setMarkerOnMap(marker, selectedMap);
    });
  }

  function handleRemoveMarkers() {
    clearMarkersFromMap(markers);
    onRemoveAllMarkers(levelId);
  }
  return (
    <MapBar
      levelNumber={levelNumber}
      selectedMapProviderName={selectedMapProviderName}
      handleRemoveMarkers={handleRemoveMarkers}
      changeEditMode={changeEditMode}
    />
  );
}
const mapStateToProps = (state) => ({
  levelNumber: state.activeLevelInfo.currentLevel.number,
  selectedMapProviderName: state.mapSettings.selectedMapProviderName,
  selectedMapProvider: state.mapSettings.selectedMapProvider,
  selectedMap: state.mapSettings.selectedMap
});

MarkerHolder.propTypes = {
  markerHandler: PropTypes.object.isRequired,
  vertexDtoToMarker: PropTypes.func.isRequired,
  getDtos: PropTypes.func.isRequired,
  setMarkerListeners: PropTypes.func.isRequired,
  changeEditMode: PropTypes.func.isRequired,
  onMarkerCreate: PropTypes.func.isRequired,
  onRemoveAllMarkers: PropTypes.func.isRequired,
  levelNumber: PropTypes.number,
  selectedMapProviderName: PropTypes.string.isRequired,
  selectedMapProvider: PropTypes.object.isRequired,
  selectedMap: PropTypes.object.isRequired
};

export default withRouter(connect(mapStateToProps)(MarkerHolder));
