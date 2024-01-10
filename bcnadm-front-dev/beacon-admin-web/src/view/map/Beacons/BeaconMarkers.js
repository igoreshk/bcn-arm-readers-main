import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { withLocalize } from 'react-localize-redux';
import { connect } from 'react-redux';

import googleBeaconsTransformer from 'src/transformers/BeaconTransformers/GoogleBeaconTransformer';
import osmBeaconsTransformer from 'src/transformers/BeaconTransformers/OSMBeaconTransformer';
import { LocationService } from 'src/utils/LocationService';
import { setMapRenderedStatus } from 'src/reducers/mapSettingsReducer/mapSettingsSlice';
import { addPopupMessageText } from 'src/actions/popupMessage';
import { ERROR } from 'src/utils/popUpConsts';
import PropTypes from 'prop-types';
import AbstractWithMarkers from '../AbstractWithMarkers';
import beaconsDataProvider from './BeaconsDataProvider';
import googleMarkerHandler from '../MarkerHandler/GoogleMarkerHandler';
import osmMarkerHandler from '../MarkerHandler/OSMMarkerHandler';
import MarkerHolder from '../MarkerHolder';
import { BeaconTooltip } from './BeaconTooltip';
import { mapProviders } from '../MapConsts';

class BeaconMarkers extends AbstractWithMarkers {
  constructor(props) {
    super(props);
    this.beaconsTransformer = null;
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
      this.beaconsTransformer = osmBeaconsTransformer;
      this.markerHandler = osmMarkerHandler;
    } else {
      this.beaconsTransformer = googleBeaconsTransformer;
      this.markerHandler = googleMarkerHandler;
    }
  };

  setMarkerListeners = (markers) => {
    const { edit: editMode } = this.props.match.params;
    const { selectedMap: map, selectedMapProvider: mapProvider } = this.props;
    if (editMode) {
      markers.forEach((marker) => {
        this.markerHandler.setInfoTooltip(mapProvider, marker, map, this.infoTooltip);
        this.markerHandler.setClickListener(mapProvider, marker, this.onMarkerSelect);
        this.markerHandler.setRightClickListener(mapProvider, marker, this.onMarkerRemove);
        this.markerHandler.setDraggable(marker);
        this.markerHandler.setDragEndListener(mapProvider, marker, this.onMarkerDragEnd);
      });
    } else {
      markers.forEach((marker) => {
        this.markerHandler.removeClickListener(mapProvider, marker);
        this.markerHandler.removeRightClickListener(mapProvider, marker);
        this.markerHandler.setUndraggable(marker);
        this.markerHandler.removeDragEndListener(mapProvider, marker);
      });
    }
  };

  onMarkerCreate = (location) => {
    const { history, selectedMapProviderName } = this.props;
    const { building: buildingId, level: levelId } = this.props.match.params;
    const lat = selectedMapProviderName === mapProviders.GOOGLE ? location.lat() : location.lat;
    const lng = selectedMapProviderName === mapProviders.GOOGLE ? location.lng() : location.lng;

    history.push(LocationService.getBeaconsDialogLocation(buildingId, levelId, true, 'new'), {
      latitude: lat,
      longitude: lng
    });
  };

  onMarkerSelect = (marker) => {
    const { history } = this.props;
    const { building: buildingId, level: levelId } = this.props.match.params;
    history.push(LocationService.getBeaconsDialogLocation(buildingId, levelId, true, marker.entityId));
  };

  onMarkerDragEnd = async (marker) => {
    try {
      await beaconsDataProvider.saveDto(this.beaconsTransformer.markerToDto(marker));
    } catch (err) {
      this.props.addPopupMessageText(this.props.translate('mapAlerts.saveError'), ERROR);
      throw err;
    }
  };

  onMarkerRemove = async (marker) => {
    try {
      await beaconsDataProvider.removeDto(this.beaconsTransformer.markerToDto(marker));
      this.markerHandler.removeMarkerFromMap(marker, this.props.selectedMap);
    } catch (err) {
      this.props.addPopupMessageText(this.props.translate('mapAlerts.deleteError'), ERROR);
      throw err;
    }
  };

  onRemoveAllMarkers = async (levelId) => {
    try {
      await beaconsDataProvider.removeAll(levelId);
    } catch (err) {
      this.props.addPopupMessageText(this.props.translate('mapAlerts.deleteError'), ERROR);
      throw err;
    }
  };

  infoTooltip = (marker) => {
    return new Promise((resolve) => {
      resolve(ReactDOMServer.renderToString(<BeaconTooltip marker={marker} />));
    });
  };

  changeEditMode = () => {
    const { history } = this.props;
    const { building: buildingId, level: levelId, edit: editMode } = this.props.match.params;
    if (editMode) {
      history.push(LocationService.getBeaconsLocation(buildingId, levelId, false));
    } else {
      history.push(LocationService.getBeaconsLocation(buildingId, levelId, true));
    }
  };

  render() {
    return (
      <MarkerHolder
        getDtos={beaconsDataProvider.getDtos}
        vertexDtoToMarker={this.beaconsTransformer.dtoToMarker}
        markerHandler={this.markerHandler}
        setMarkerListeners={this.setMarkerListeners}
        onRemoveAllMarkers={this.onRemoveAllMarkers}
        onMarkerCreate={this.onMarkerCreate}
        changeEditMode={this.changeEditMode}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  selectedMap: state.mapSettings.selectedMap,
  selectedMapProvider: state.mapSettings.selectedMapProvider,
  selectedMapProviderName: state.mapSettings.selectedMapProviderName
});

const mapDispatchToProps = {
  setMapRenderedStatus,
  addPopupMessageText
};

BeaconMarkers.propTypes = {
  selectedMap: PropTypes.object.isRequired,
  selectedMapProvider: PropTypes.object.isRequired,
  selectedMapProviderName: PropTypes.string.isRequired,
  setMapRenderedStatus: PropTypes.func.isRequired,
  addPopupMessageText: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(withLocalize(BeaconMarkers));
