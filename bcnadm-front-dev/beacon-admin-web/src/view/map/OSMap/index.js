import React, { useEffect, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import { withLocalize } from 'react-localize-redux';
import { connect } from 'react-redux';
// eslint-disable-next-line no-unused-vars
import L from 'leaflet';
import 'leaflet-imageoverlay-rotated';
import { hideLoadingScreen, showLoadingScreen } from 'src/actions/loadingScreen';
import { BuildingService } from 'src/service/BuildingService';
import { addPopupMessageText } from 'src/actions/popupMessage';
import { ERROR } from 'src/utils/popUpConsts';
import { LevelService } from 'service/LevelService';
import { BUILDINGS } from 'src/consts/RouteConsts';
import { saveMap, setMapProvider, setMapRenderedStatus } from 'src/reducers/mapSettingsReducer/mapSettingsSlice';
import { setCurrentBuilding } from 'src/reducers/activeLevelInfoReducer/activeLevelInfoSlice';
import PropTypes from 'prop-types';
import { setMapForOSM } from 'view/map/DrawingBar/serviceForOSMaps';
import OSMapConfiguration from '../OSMapConfiguration';
import { calculatePixelsPerMeter, rotateImage } from './helpers';
import './OSMap.scss';

export const OSMap = (props) => {
  const mapConfiguration = useRef();
  const blankMap = useRef();
  const isMapRendered = useRef(false);
  const currentLevelInfo = useRef(null);

  const { match, loading } = props;

  function redirectTo(path) {
    props.hideLoadingScreen();
    props.history.push({
      pathname: path
    });
    props.addPopupMessageText(props.translate('building.messages.unavailable'), ERROR);
  }

  const getLevel = async () => {
    return await LevelService.getLevel(props.match.params.level);
  };

  const setUpMap = async (map, building) => {
    const size = { width: building.width, height: building.height };
    const pixelsPerMeter = calculatePixelsPerMeter(map, currentLevelInfo.current);
    const rotation = rotateImage(map, currentLevelInfo.current);
    try {
      const { bounds, imageLink } = await mapConfiguration.current.getImageAndCalculateBounds(
        map,
        match.params.level,
        size,
        pixelsPerMeter
      );
      mapConfiguration.current.setMapDraggingListener(map, bounds);
      mapConfiguration.current.configureOverlay(map, imageLink, { bounds, rotation, isMapRendered });
      props.saveMap({ selectedMap: map });
      isMapRendered.current = true;
      props.setMapRenderedStatus({ isMapRendered: isMapRendered.current });
      props.hideLoadingScreen();
    } catch (err) {
      console.error(err);
      redirectTo(BUILDINGS);
    }
  };

  const initializeMap = async (buildingId) => {
    const { loadedOSMap } = props;
    try {
      const building = await BuildingService.findOne(buildingId);
      props.setCurrentBuilding({ building });

      const latitude = building.latitude;
      const longitude = building.longitude;
      const mapCenter = [latitude, longitude];
      const { mapProvider } = props;
      props.setMapProvider({ selectedMapProvider: mapProvider });

      mapConfiguration.current = new OSMapConfiguration(mapCenter);
      const map = await mapConfiguration.current.createMap();
      loadedOSMap.current = map;
      blankMap.current = map;
      await setUpMap(blankMap.current, building);
    } catch (err) {
      console.error(err);
    }
  };

  // Equivalent of ComponentDidMount
  useEffect(async () => {
    props.showLoadingScreen();
    props.setMapRenderedStatus({ isMapRendered: isMapRendered.current });
    currentLevelInfo.current = await getLevel();
    const buildingId = match.params.building;
    await initializeMap(buildingId);
    return () => {
      mapConfiguration.current = null;
    };
  }, []);

  useEffect(async () => {
    await setMapForOSM(props);
  }, [blankMap?.current]);

  // Update map if building level or zoom level changes
  useEffect(() => {
    if (!loading && mapConfiguration.current && blankMap.current && props.currentBuilding) {
      props.showLoadingScreen();
      setUpMap(blankMap.current, props.currentBuilding).catch((err) => throw err);
    }
  }, [props.selectedMap, match.params.building]);

  return <div id="OSMap" className="mapContainer" />;
};

OSMap.propTypes = {
  saveMap: PropTypes.func,
  setMapRenderedStatus: PropTypes.func,
  hideLoadingScreen: PropTypes.func,
  loading: PropTypes.bool,
  match: PropTypes.object,
  showLoadingScreen: PropTypes.func,
  translate: PropTypes.func
};

const mapStateToProps = (state) => {
  return {
    loading: state.loading.processesFetching,
    currentLevel: state.activeLevelInfo.currentLevel,
    currentBuilding: state.activeLevelInfo.currentBuilding
  };
};

const mapDispatchToProps = {
  setCurrentBuilding,
  setMapProvider,
  saveMap,
  setMapRenderedStatus,
  showLoadingScreen,
  hideLoadingScreen,
  addPopupMessageText
};

export default withRouter(withLocalize(connect(mapStateToProps, mapDispatchToProps)(OSMap)));
