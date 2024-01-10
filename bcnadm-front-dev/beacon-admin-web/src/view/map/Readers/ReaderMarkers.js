import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { withLocalize } from 'react-localize-redux';
import { connect } from 'react-redux';

import googleReaderTransformer from 'src/transformers/ReaderTransformers/GoogleReaderTransformer';
import osmReaderTransformer from 'src/transformers/ReaderTransformers/OSMReaderTransformer';
import { LocationService } from 'src/utils/LocationService';
import { mapProviders } from 'src/view/map/MapConsts';
import { setMapRenderedStatus } from 'src/reducers/mapSettingsReducer/mapSettingsSlice';
import { addPopupMessageText } from 'src/actions/popupMessage';
import { ERROR } from 'src/utils/popUpConsts';
import PropTypes from 'prop-types';
import { ReaderTooltip } from './ReaderTooltip';
import MarkerHolder from '../MarkerHolder';
import osmMarkerHandler from '../MarkerHandler/OSMMarkerHandler';
import googleMarkerHandler from '../MarkerHandler/GoogleMarkerHandler';
import readersDataProvider from './ReadersDataProvider';
import AbstractWithMarkers from '../AbstractWithMarkers';

class ReaderMarkers extends AbstractWithMarkers {
  constructor(props) {
    super(props);
    this.readerTransformer = null;
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
      this.readerTransformer = osmReaderTransformer;
      this.markerHandler = osmMarkerHandler;
    } else {
      this.readerTransformer = googleReaderTransformer;
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

    history.push(LocationService.getReadersDialogLocation(buildingId, levelId, true, 'new'), {
      latitude: lat,
      longitude: lng
    });
  };

  onMarkerSelect = (marker) => {
    const { history } = this.props;
    const { building: buildingId, level: levelId } = this.props.match.params;
    history.push(LocationService.getReadersDialogLocation(buildingId, levelId, true, marker.entityId));
  };

  onMarkerDragEnd = async (marker) => {
    try {
      await readersDataProvider.saveDto(this.readerTransformer.markerToDto(marker));
    } catch (err) {
      this.props.addPopupMessageText(this.props.translate('mapAlerts.saveError'), ERROR);
      throw err;
    }
  };

  onMarkerRemove = async (marker) => {
    try {
      await readersDataProvider.removeDto(this.readerTransformer.markerToDto(marker));
      this.markerHandler.removeMarkerFromMap(marker, this.props.selectedMap);
    } catch (err) {
      this.props.addPopupMessageText(this.props.translate('mapAlerts.deleteError'), ERROR);
      throw err;
    }
  };

  onRemoveAllMarkers = async (levelId) => {
    try {
      await readersDataProvider.removeAll(levelId);
    } catch (err) {
      this.props.addPopupMessageText(this.props.translate('mapAlerts.deleteError'), ERROR);
      throw err;
    }
  };

  infoTooltip = (marker) => {
    return new Promise((resolve) => {
      resolve(ReactDOMServer.renderToString(<ReaderTooltip marker={marker} />));
    });
  };

  changeEditMode = () => {
    const { history } = this.props;
    const { building: buildingId, level: levelId, edit: editMode } = this.props.match.params;
    if (editMode) {
      history.push(LocationService.getReadersLocation(buildingId, levelId, false));
    } else {
      history.push(LocationService.getReadersLocation(buildingId, levelId, true));
    }
  };

  render() {
    return (
      <MarkerHolder
        getDtos={readersDataProvider.getDtos}
        vertexDtoToMarker={this.readerTransformer.dtoToMarker}
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

ReaderMarkers.propTypes = {
  selectedMap: PropTypes.object.isRequired,
  selectedMapProvider: PropTypes.object.isRequired,
  selectedMapProviderName: PropTypes.string.isRequired,
  setMapRenderedStatus: PropTypes.func.isRequired,
  addPopupMessageText: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(withLocalize(ReaderMarkers));
