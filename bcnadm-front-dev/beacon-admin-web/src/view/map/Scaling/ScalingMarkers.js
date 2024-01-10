import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { connect } from 'react-redux';
import { withLocalize } from 'react-localize-redux';
import PropTypes from 'prop-types';

import osmScalingEdgeTransformer from 'src/transformers/ScalingTransformers/OSMScalingEdgeTransformer';
import osmScalingTransformer from 'src/transformers/ScalingTransformers/OSMScalingTransformer';
import osmMarkerHandler from 'src/view/map/MarkerHandler/OSMMarkerHandler';
import googleScalingEdgeTransformer from 'src/transformers/ScalingTransformers/GoogleScalingEdgeTransformer';
import googleScalingTransformer from 'src/transformers/ScalingTransformers/GoogleScalingTransformer';
import googleMarkerHandler from 'src/view/map/MarkerHandler/GoogleMarkerHandler';
import { setMapRenderedStatus } from 'src/reducers/mapSettingsReducer/mapSettingsSlice';
import { LocationService } from 'src/utils/LocationService';
import { addPopupMessageText } from 'src/actions/popupMessage';
import { ERROR } from 'src/utils/popUpConsts';
import { mapProviders } from 'src/view/map/MapConsts';
import { setScaleVertices, resetScaleEdge } from 'src/reducers/activeLevelInfoReducer/activeLevelInfoSlice';
import scalingDataProvider from './ScalingDataProvider';
import { ScalingTooltip } from './ScalingToolip';
import EdgeMarkerHolder from '../EdgeMarkerHolder';
import AbstractWithMarkers from '../AbstractWithMarkers';

const MAX_SCALE_VERTICES_NUMBER = 2;

class ScalingMarkers extends AbstractWithMarkers {
  constructor(props) {
    super(props);
    this.state = {
      update: false,
      markerDragged: null
    };
    this.isStartVertex = true;
    this.blockMap = false;
    this.scalingEdgeTransformer = null;
    this.scalingTransformer = null;
    this.markerHandler = null;
    this.chooseMapProvider();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.selectedMapProviderName !== this.props.selectedMapProviderName) {
      this.chooseMapProvider();
    }
  }

  componentWillUnmount() {
    this.props.setMapRenderedStatus({ isMapRendered: false });
  }

  chooseMapProvider = () => {
    if (this.props.selectedMapProviderName === mapProviders.OSM) {
      this.scalingEdgeTransformer = osmScalingEdgeTransformer;
      this.scalingTransformer = osmScalingTransformer;
      this.markerHandler = osmMarkerHandler;
    } else {
      this.scalingEdgeTransformer = googleScalingEdgeTransformer;
      this.scalingTransformer = googleScalingTransformer;
      this.markerHandler = googleMarkerHandler;
    }
  };

  loadMarkers = () => {
    const { selectedMap, selectedMapProvider, currentLevel, temporaryScaleEdge } = this.props;
    const updatedLevel = { ...currentLevel, ...temporaryScaleEdge };
    const vertices = this.scalingTransformer.levelToMarkers(updatedLevel, selectedMapProvider);
    const edges = this.scalingEdgeTransformer.levelToPolyline(updatedLevel, selectedMapProvider, selectedMap);
    this.blockMap = Boolean(vertices.length === MAX_SCALE_VERTICES_NUMBER);
    return { vertices, edges };
  };

  setMapListener = () => {
    const { edit: editMode } = this.props.match.params;
    const { selectedMap: map, selectedMapProvider: mapProvider } = this.props;
    this.markerHandler.removeMapListener(mapProvider, map);
    if (editMode && !this.blockMap) {
      this.markerHandler.setMapListener(mapProvider, map, this.onMarkerCreate);
    }
  };

  setMarkerListeners = (markers, edges) => {
    const { edit: editMode } = this.props.match.params;
    const { selectedMap: map, selectedMapProvider: mapProvider } = this.props;
    if (editMode) {
      markers.forEach((marker) => {
        this.markerHandler.setDraggable(marker);
        this.markerHandler.setDragStartListener(mapProvider, map, marker, this.onMarkerDragStart);
        this.markerHandler.setDragEndListener(mapProvider, marker, this.onMarkerDragEnd);
      });
      edges.forEach((edge) => {
        this.markerHandler.setEdgeInfoTooltip(mapProvider, edge, map, this.infoTooltip);
        this.markerHandler.setScaleEdgeListener(mapProvider, edge, this.showDistanceDialog);
      });
    } else {
      markers.forEach((marker) => {
        this.markerHandler.setUndraggable(marker);
        this.markerHandler.removeDragEndListener(mapProvider, marker);
        this.markerHandler.removeDragStartListener(mapProvider, marker);
      });
      edges.forEach((edge) => {
        this.markerHandler.setEdgeInfoTooltip(mapProvider, edge, map, this.infoTooltip);
        this.markerHandler.removeScaleEdgeListener(mapProvider, edge);
      });
    }
  };

  onMarkerCreate = (location) => {
    const { selectedMapProviderName } = this.props;

    const lat = selectedMapProviderName === mapProviders.GOOGLE ? location.lat() : location.lat;
    const lng = selectedMapProviderName === mapProviders.GOOGLE ? location.lng() : location.lng;

    let newVertex;
    if (this.isStartVertex) {
      newVertex = {
        scaleStartLatitude: lat,
        scaleStartLongitude: lng
      };
    } else {
      newVertex = {
        scaleEndLatitude: lat,
        scaleEndLongitude: lng
      };
    }
    this.props.setScaleVertices({ vertices: newVertex });

    if (this.isStartVertex === false) {
      this.showDistanceDialog();
    } else {
      this.isStartVertex = false;
      this.setState((prevState) => ({
        update: !prevState.update
      }));
    }
  };

  onMarkerDragStart = (marker) => {
    this.setState({ markerDragged: marker });
  };

  onMarkerDragEnd = (marker) => {
    this.props.setScaleVertices({ vertices: this.scalingTransformer.markerToDto(marker) });
    if (this.props.currentLevel.scaleDistance !== 0) {
      this.showDistanceDialog();
    }
  };

  onRemoveAllMarkers = async (levelId) => {
    try {
      await scalingDataProvider.removeAll(levelId);
      this.props.resetScaleEdge();
      this.setState((prevState) => ({
        update: !prevState.update
      }));
    } catch (err) {
      this.props.addPopupMessageText(this.props.translate('mapAlerts.deleteError'), ERROR);
      throw err;
    }
  };

  changeEditMode = () => {
    const { history } = this.props;
    const { building: buildingId, level: levelId, edit } = this.props.match.params;
    if (edit) {
      history.push(LocationService.getScalingLocation(buildingId, levelId, false));
    } else {
      history.push(LocationService.getScalingLocation(buildingId, levelId, true));
    }
  };

  infoTooltip = (edge) => {
    return new Promise((resolve) => {
      resolve(
        ReactDOMServer.renderToString(<ScalingTooltip distance={edge.distance} translate={this.props.translate} />)
      );
    });
  };

  showDistanceDialog = () => {
    const { history } = this.props;
    const { level: levelId, building: buildingId } = this.props.match.params;
    history.push(LocationService.getScalingDialogLocation(buildingId, levelId, true, 'distance'));
  };

  render() {
    const { height, width } = this.props.currentBuilding;
    return (
      <EdgeMarkerHolder
        loadMarkers={this.loadMarkers}
        update={this.state.update}
        markerDragged={this.state.markerDragged}
        setMapListener={this.setMapListener}
        setMarkerListeners={this.setMarkerListeners}
        markerHandler={this.markerHandler}
        onRemoveAllMarkers={this.onRemoveAllMarkers}
        changeEditMode={this.changeEditMode}
        buildingSizeForScaleMode={{ height, width }}
      />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    selectedMap: state.mapSettings.selectedMap,
    selectedMapProvider: state.mapSettings.selectedMapProvider,
    selectedMapProviderName: state.mapSettings.selectedMapProviderName,
    currentLevel: state.activeLevelInfo.currentLevel,
    temporaryScaleEdge: state.activeLevelInfo.temporaryScaleEdge,
    currentBuilding: state.activeLevelInfo.currentBuilding
  };
};

const mapDispatchToProps = {
  setMapRenderedStatus,
  setScaleVertices,
  addPopupMessageText,
  resetScaleEdge
};

ScalingMarkers.propTypes = {
  selectedMap: PropTypes.object.isRequired,
  selectedMapProvider: PropTypes.object.isRequired,
  selectedMapProviderName: PropTypes.string.isRequired,
  currentLevel: PropTypes.object.isRequired,
  temporaryScaleEdge: PropTypes.object,
  currentBuilding: PropTypes.object.isRequired,
  setMapRenderedStatus: PropTypes.func.isRequired,
  setScaleVertices: PropTypes.func.isRequired,
  addPopupMessageText: PropTypes.func.isRequired,
  resetScaleEdge: PropTypes.func.isRequired
};

export default withLocalize(connect(mapStateToProps, mapDispatchToProps)(ScalingMarkers));
