import { hideLoadingScreen, showLoadingScreen } from 'src/actions/loadingScreen';
import { BuildingService } from 'src/service/BuildingService';
import React, { useEffect, useRef, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { addPopupMessageText } from 'src/actions/popupMessage';
import { ERROR } from 'src/utils/popUpConsts';
import { BUILDINGS } from 'src/consts/RouteConsts';
import { withLocalize } from 'react-localize-redux';
import { setMapProvider, saveMap, setMapRenderedStatus } from 'src/reducers/mapSettingsReducer/mapSettingsSlice';
import { setCurrentBuilding, setCurrentLevel } from 'src/reducers/activeLevelInfoReducer/activeLevelInfoSlice';
import { LevelService } from 'service/LevelService';
import { setMapForGoogle } from 'view/map/DrawingBar/serviceForGoogleMaps';
import { INITIAL_ZOOM } from '../MapConsts';
import GoogleMapConfiguration from '../GoogleMapConfiguration';
import { calculatePixelsPerMeter, rotateImage, toggleBackgroundIfMapExist } from './helpers';
import './map.scss';

export const Map = (props) => {
  const currentOverlay = useRef(null);
  const [componentShouldUpdate, setComponentShouldUpdate] = useState(false);
  const mapContainer = useRef();
  const isMapRendered = useRef(false);
  const mapConfiguration = useRef();
  const currentLevelInfo = useRef(null);
  const currentBuildingInfo = useRef(null);

  const redirectTo = (path) => {
    props.hideLoadingScreen();
    props.history.push({
      pathname: path
    });
    props.addPopupMessageText(props.translate('building.messages.unavailable'), ERROR);
  };

  const getLevel = async () => {
    return await LevelService.getLevel(props.match.params.level);
  };

  const calculateSizeAndRotation = async (map, match) => {
    map.setZoom(INITIAL_ZOOM);
    const { google, temporaryScaleEdge } = props;
    if (!map.getProjection()) {
      props.google.maps.event.addListenerOnce(map, 'projection_changed', () => {
        calculateSizeAndRotation(map, match);
      });
      return;
    }
    const size = { height: currentBuildingInfo.current.height, width: currentBuildingInfo.current.width };

    map.panTo({ lat: currentBuildingInfo.current.latitude, lng: currentBuildingInfo.current.longitude });
    props.saveMap({ selectedMap: map });

    const pixelsPerMeter = await calculatePixelsPerMeter(map, google, {
      ...currentLevelInfo.current,
      ...temporaryScaleEdge
    });
    const rotation = await rotateImage(map, google, { ...currentLevelInfo.current, ...temporaryScaleEdge });
    await settingMap(map, match, size, pixelsPerMeter, rotation);
  };

  const initializeMap = async (buildingId) => {
    const { google, match, mapProvider, setBuilding } = props;
    props.setMapProvider({ selectedMapProvider: mapProvider });
    const node = mapContainer.current;

    try {
      const { setBuildingCenterCoordinates } = props;
      const building = await BuildingService.findOne(buildingId);
      await setBuilding({ building });
      mapConfiguration.current = await new GoogleMapConfiguration(google, node, {
        lat: building.latitude,
        lng: building.longitude
      });
      setBuildingCenterCoordinates([building.latitude, building.longitude]);
      const map = await mapConfiguration.current?.createMap();
      props.saveMap({ selectedMap: map });
      if (map.getProjection() && currentBuildingInfo.current !== null) {
        await calculateSizeAndRotation(map, match);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const changeOverlay = (overlay, map) => {
    const { setPicture } = props;
    if (currentOverlay.current) {
      currentOverlay.current.setMap(null);
    }
    currentOverlay.current = overlay;
    currentOverlay.current.setMap(map);

    setPicture(currentOverlay.current.image);
  };

  const saveCoordinates = () => {
    const southWest = currentOverlay.current.bounds.getSouthWest();
    const northEast = currentOverlay.current.bounds.getNorthEast();
    if (
      currentLevelInfo.current.northEastLatitude !== northEast.lat() ||
      currentLevelInfo.current.northEastLongitude !== northEast.lng() ||
      currentLevelInfo.current.southWestLatitude !== southWest.lat() ||
      currentLevelInfo.current.southWestLongitude !== southWest.lng()
    ) {
      const level = currentLevelInfo.current;
      level.northEastLatitude = northEast.lat();
      level.northEastLongitude = northEast.lng();
      level.southWestLatitude = southWest.lat();
      level.southWestLongitude = southWest.lng();
      setCurrentLevel({ level });
      LevelService.saveLevel({ ...level });
    }
  };

  const toggleBackground = () => {
    const { selectedMap, showMapBackground } = props;
    mapConfiguration.current.setMapBackground(selectedMap, showMapBackground);
  };

  async function settingMap(map, match, size, pixelsPerMeter, rotation) {
    try {
      if (!mapConfiguration.current) {
        await initializeMap(props.match.params.building);
      }
      const { bounds, imageLink } = await mapConfiguration.current.getImageAndCalculateBounds(
        map,
        match.params.level,
        size,
        pixelsPerMeter
      ); // calculating bounds
      currentOverlay.current = await mapConfiguration.current.configureOverlay(map, bounds, imageLink, rotation); // configuring overlay
      const { setPictureCoords } = props;
      const coordinates = Object.values(currentOverlay.current.bounds);
      const data = coordinates.map(() => [
        { lat: coordinates[0].g, lng: coordinates[1].h },
        { lat: coordinates[0].h, lng: coordinates[1].g }
      ]);
      setPictureCoords(data);
      await changeOverlay(currentOverlay.current, map);
      saveCoordinates();
      props.hideLoadingScreen();
      props.setMapRenderedStatus({ isMapRendered: true });
    } catch (err) {
      console.error(err);
      redirectTo(BUILDINGS);
    }
  }

  useEffect(async () => {
    const buildingImage = currentOverlay.current?.image;
    await setMapForGoogle(props, buildingImage);
  }, [
    props.selectedMapProviderName,
    props.loadedOSMap,
    props.match,
    props.buildingCenterCoordinates,
    props.pictureCoords,
    props.translate,
    props.google,
    props.selectedMap,
    props.shapes
  ]);

  // Equivalent of ComponentDidMount
  useEffect(async () => {
    isMapRendered.current = false;
    props.showLoadingScreen();
    props.setMapRenderedStatus({ isMapRendered: false });
    currentLevelInfo.current = await getLevel();
    const buildingId = props.match.params.building;
    currentBuildingInfo.current = await BuildingService.findOne(buildingId);
    await initializeMap(buildingId);

    return () => {
      currentOverlay.current = null;
      currentLevelInfo.current = null;
    };
  }, []);

  useEffect(() => {
    setComponentShouldUpdate(true);
  }, [props.match.params.level]);

  useEffect(() => {
    if (currentBuildingInfo.current === null) {
      return;
    }

    if (props.loading && componentShouldUpdate && props.selectedMap) {
      props.showLoadingScreen();
      setComponentShouldUpdate(false);
      calculateSizeAndRotation(props.selectedMap, props.match).catch((err) => throw err);
    }
    if (mapConfiguration.current && !props.loading && props.selectedMap) {
      toggleBackgroundIfMapExist(props.selectedMap, toggleBackground);
    }
  }, [
    props.match.params.level,
    props.currentBuilding,
    props.selectedMap,
    currentLevelInfo.current,
    currentBuildingInfo.current
  ]);

  return (
    <div id="map" className="mapWrapper">
      <div ref={mapContainer} className="mapContainer" />
    </div>
  );
};

Map.propTypes = {
  google: PropTypes.object,
  mapProvider: PropTypes.object,
  showLoadingScreen: PropTypes.func.isRequired,
  setMapProvider: PropTypes.func.isRequired,
  saveMap: PropTypes.func.isRequired,
  setMapRenderedStatus: PropTypes.func,
  selectedMap: PropTypes.object,
  hideLoadingScreen: PropTypes.func.isRequired,
  match: PropTypes.object,
  showMapBackground: PropTypes.bool,
  addPopupMessageText: PropTypes.func,
  translate: PropTypes.func
};

const mapDispatchToProps = {
  showLoadingScreen,
  setBuilding: setCurrentBuilding,
  setMapProvider,
  saveMap,
  setMapRenderedStatus,
  hideLoadingScreen,
  addPopupMessageText
};

const mapStateToProps = (state) => {
  return {
    currentLevel: state.activeLevelInfo.currentLevel,
    currentBuilding: state.activeLevelInfo.currentBuilding,
    temporaryScaleEdge: state.activeLevelInfo.temporaryScaleEdge,
    selectedMap: state.mapSettings.selectedMap,
    loading: state.loading.processesFetching,
    showMapBackground: state.mapBackground.showMapBackground
  };
};
export default withRouter(withLocalize(connect(mapStateToProps, mapDispatchToProps)(Map)));
