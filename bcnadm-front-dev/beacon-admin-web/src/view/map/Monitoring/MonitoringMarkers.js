import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { withLocalize } from 'react-localize-redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import osmMonitoringTransformer from 'src/transformers/MonitoringTransformers/OSMMonitoringTransformer';
import osmMarkerHandler from 'src/view/map/MarkerHandler/OSMMarkerHandler';
import googleMonitoringTransformer from 'src/transformers/MonitoringTransformers/GoogleMonitoringTransformer';
import googleMarkerHandler from 'src/view/map/MarkerHandler/GoogleMarkerHandler';
import { mapProviders } from 'src/view/map/MapConsts';
import MonitoringTooltip from './MonitoringTooltip';
import MonitoringHolder from './MonitoringHolder';
import AbstractWithMarkers from '../AbstractWithMarkers';

export class MonitoringMarkers extends AbstractWithMarkers {
  constructor(props) {
    super(props);
    this.state = {
      monitoringTransformer: null,
      markerHandler: null
    };
  }

  componentDidMount() {
    this.chooseMapProvider();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.selectedMapProviderName !== this.props.selectedMapProviderName) {
      this.chooseMapProvider();
    }
  }

  chooseMapProvider = () => {
    if (this.props.selectedMapProviderName === mapProviders.OSM) {
      this.setState({
        monitoringTransformer: osmMonitoringTransformer,
        markerHandler: osmMarkerHandler
      });
    } else {
      this.setState({
        monitoringTransformer: googleMonitoringTransformer,
        markerHandler: googleMarkerHandler
      });
    }
  };

  setListeners = (markers, map, mapProvider) => {
    const { markerHandler } = this.state;

    markers.forEach((marker) => {
      markerHandler.setInfoTooltip(mapProvider, marker, map, this.infoTooltip);
    });
  };

  infoTooltip = (marker) => {
    return new Promise((resolve) => {
      resolve(ReactDOMServer.renderToString(<MonitoringTooltip marker={marker} translate={this.props.translate} />));
    });
  };

  render() {
    if (this.state.monitoringTransformer === null) {
      return null;
    }
    return (
      <MonitoringHolder
        transformer={this.state.monitoringTransformer.dtoToMarker}
        markerHandler={this.state.markerHandler}
        setListeners={this.setListeners}
        {...this.props}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  selectedMapProviderName: state.mapSettings.selectedMapProviderName
});

MonitoringMarkers.propTypes = {
  selectedMapProviderName: PropTypes.string
};

export default withLocalize(connect(mapStateToProps)(MonitoringMarkers));
