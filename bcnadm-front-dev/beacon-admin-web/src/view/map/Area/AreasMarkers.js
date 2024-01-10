/* eslint-disable no-unused-vars */
import React from 'react';
import { withLocalize } from 'react-localize-redux';
import { connect } from 'react-redux';

import googleAreaTransformer from 'src/transformers/AreaTransformers/GoogleAreaTransformer';
import osmAreaTransformer from 'src/transformers/AreaTransformers/OSMAreaTransformer';
import { LocationService } from 'src/utils/LocationService';
import { setMapRenderedStatus } from 'src/reducers/mapSettingsReducer/mapSettingsSlice';
import { addPopupMessageText } from 'src/actions/popupMessage';
import { ERROR } from 'src/utils/popUpConsts';
import PropTypes from 'prop-types';
import { mapProviders } from '../MapConsts';
import MarkerHolder from '../MarkerHolder';
import osmMarkerHandler from '../MarkerHandler/OSMMarkerHandler';
import googleMarkerHandler from '../MarkerHandler/GoogleMarkerHandler';
import areaDataProvider from './AreaDataProvider';
import AbstractWithMarkers from '../AbstractWithMarkers';

class AreasMarkers extends AbstractWithMarkers {
  constructor(props) {
    super(props);
    this.areaTransformer = null;
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
      this.areaTransformer = osmAreaTransformer;
      this.markerHandler = osmMarkerHandler;
    } else {
      this.areaTransformer = googleAreaTransformer;
      this.markerHandler = googleMarkerHandler;
    }
  };

  setMarkerListeners = (markers) => {};

  onMarkerCreate = (location) => {};

  onRemoveAllMarkers = async (levelId) => {
    try {
      await areaDataProvider.removeAll(levelId);
    } catch (err) {
      this.props.addPopupMessageText(this.props.translate('mapAlerts.deleteError'), ERROR);
    }
  };

  changeEditMode = () => {
    const { history } = this.props;
    const { building: buildingId, level: levelId, edit: editMode } = this.props.match.params;
    if (editMode) {
      history.push(LocationService.getAreaLocation(buildingId, levelId, false));
    } else {
      history.push(LocationService.getAreaLocation(buildingId, levelId, true));
    }
  };

  render() {
    return (
      <MarkerHolder
        getDtos={areaDataProvider.getDtos}
        vertexDtoToMarker={this.areaTransformer.dtoToMarker}
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
  selectedMapProviderName: state.mapSettings.selectedMapProviderName
});

const mapDispatchToProps = {
  setMapRenderedStatus,
  addPopupMessageText
};

AreasMarkers.propTypes = {
  selectedMap: PropTypes.object.isRequired,
  selectedMapProviderName: PropTypes.string.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(withLocalize(AreasMarkers));
