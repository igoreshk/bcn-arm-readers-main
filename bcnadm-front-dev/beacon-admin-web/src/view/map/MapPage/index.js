import React, { Suspense, lazy, useEffect, useState, useCallback, useRef } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import MainOperator from 'src/view/components/operatorinterface/MainOperator';
import { LoadingScreen } from 'src/view/LoadingScreen';
import { fetchCurrentLevel } from 'src/thunk/fetchCurrentLevel';
import PropTypes from 'prop-types';
import { OnMapsDrawingService } from 'service/OnMapsDrawingService';
import MapRouter from '../MapRouter';
import mapWrapper from '../MapWrapper/MapWrapper';
import { mapProviders } from '../MapConsts';
const Map = lazy(() => import('../Map'));
const OSMap = lazy(() => import('../OSMap'));

import './mapPage.scss';

export const MapPage = ({
  mapProvider,
  google,
  selectedMapProviderName,
  fetchLevel,
  match: {
    params: { level: levelId }
  }
}) => {
  useEffect(() => {
    localStorage.setItem('mapProvider', selectedMapProviderName);
  });

  useEffect(() => {
    fetchLevel({ levelId });
  }, []);

  const loadedOSMap = useRef();
  const [buildingCenterCoordinates, setBuildingCenterCoordinates] = useState([]);
  const [pictureCoords, setPictureCoords] = useState([]);
  const [picture, setPicture] = useState([]);

  const onGoogleMapLoad = useCallback(() => {
    setBuildingCenterCoordinates((prevState) => prevState, [...buildingCenterCoordinates]);
  }, [buildingCenterCoordinates]);

  const onGooglePictureLoad = useCallback(() => {
    setPictureCoords((prevState) => prevState, [...pictureCoords]);
    setPicture((prevState) => prevState, [...picture]);
  }, [pictureCoords, picture]);

  useEffect(() => {
    if (selectedMapProviderName === mapProviders.GOOGLE) {
      onGoogleMapLoad();
      onGooglePictureLoad();
    }
  }, [selectedMapProviderName, pictureCoords]);

  const [shapes, setShapes] = useState([]);

  useEffect(() => {
    OnMapsDrawingService.getAllShapesFromDataBase(setShapes);
  }, []);

  return (
    <div className="mapPage">
      <MainOperator />
      <MapRouter
        pictureCoords={pictureCoords}
        buildingCenterCoordinates={buildingCenterCoordinates}
        picture={picture}
        loadedOSMap={loadedOSMap}
        selectedMapProviderName={selectedMapProviderName}
      />
      <Suspense fallback={<LoadingScreen />}>
        {selectedMapProviderName === mapProviders.OSM ? (
          <OSMap mapProvider={mapProvider} loadedOSMap={loadedOSMap} shapes={shapes} />
        ) : (
          <Map
            selectedMapProviderName={selectedMapProviderName}
            shapes={shapes}
            google={google}
            mapProvider={mapProvider}
            setBuildingCenterCoordinates={setBuildingCenterCoordinates}
            buildingCenterCoordinates={buildingCenterCoordinates}
            setPictureCoords={setPictureCoords}
            setPicture={setPicture}
            picture={picture}
            pictureCoords={pictureCoords}
            loadedOSMap={loadedOSMap}
          />
        )}
      </Suspense>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    selectedMapProviderName: state.mapSettings.selectedMapProviderName
  };
};

const mapDispatchToProps = {
  fetchLevel: fetchCurrentLevel
};

MapPage.propTypes = {
  mapProvider: PropTypes.object,
  google: PropTypes.object,
  selectedMapProviderName: PropTypes.string.isRequired,
  fetchLevel: PropTypes.func.isRequired
};

export default compose(connect(mapStateToProps, mapDispatchToProps), mapWrapper)(MapPage);
