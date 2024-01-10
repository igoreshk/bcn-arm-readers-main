import {
  BEACONS,
  BUILDING_ID,
  BUILDINGS,
  EDIT_MODE,
  AREAS,
  LEVEL_ID,
  LEVELS,
  READERS,
  ROUTING,
  SCALING,
  MONITORING,
  LAYER,
  NEW_BUILDING,
  MAP,
  DRAWING
} from 'src/consts/RouteConsts';
import BuildingDialogContainer from 'src/view/containers/BuildingDialogContainer';
import React from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import { DrawingRouter } from 'view/map/DrawingRouter/DrawingRouter';
import { AreasRouter } from './Area/AreasRouter';
import { RoutingRouter } from './Routing/RoutingRouter';
import { ReadersRouter } from './Readers/ReadersRouter';
import { BeaconsRouter } from './Beacons/BeaconsRouter';
import { ScalingRouter } from './Scaling/ScalingRouter';
import { MonitoringRouter } from './Monitoring/MonitoringRouter';

const MapRouter = (props) => {
  const {
    isMapRendered,
    isCurrentLevelFetched,
    buildingCenterCoordinates,
    pictureCoords,
    picture,
    loadedOSMap,
    selectedMapProviderName
  } = props;

  if (!isMapRendered || !isCurrentLevelFetched) {
    return null;
  }
  return (
    <>
      <Route
        path={BUILDINGS + BUILDING_ID + LEVELS + LEVEL_ID + LAYER + EDIT_MODE + NEW_BUILDING}
        render={() => <BuildingDialogContainer root={MAP} />}
      />
      <Route path={BUILDINGS + BUILDING_ID + LEVELS + LEVEL_ID + AREAS + EDIT_MODE} component={AreasRouter} />
      <Route path={BUILDINGS + BUILDING_ID + LEVELS + LEVEL_ID + ROUTING + EDIT_MODE} component={RoutingRouter} />
      <Route path={BUILDINGS + BUILDING_ID + LEVELS + LEVEL_ID + BEACONS + EDIT_MODE} component={BeaconsRouter} />
      <Route path={BUILDINGS + BUILDING_ID + LEVELS + LEVEL_ID + READERS + EDIT_MODE} component={ReadersRouter} />
      <Route path={BUILDINGS + BUILDING_ID + LEVELS + LEVEL_ID + SCALING + EDIT_MODE} component={ScalingRouter} />
      <Route path={BUILDINGS + BUILDING_ID + LEVELS + LEVEL_ID + MONITORING + EDIT_MODE} component={MonitoringRouter} />
      <Route
        path={BUILDINGS + BUILDING_ID + LEVELS + LEVEL_ID + DRAWING + EDIT_MODE}
        render={() => (
          <DrawingRouter
            props={props}
            selectedMapProviderName={selectedMapProviderName}
            buildingCenterCoordinates={buildingCenterCoordinates}
            pictureCoords={pictureCoords}
            picture={picture}
            loadedOSMap={loadedOSMap}
          />
        )}
      />
    </>
  );
};
const mapStateToProps = (state) => ({
  isMapRendered: state.mapSettings.isMapRendered,
  isCurrentLevelFetched: state.activeLevelInfo.isCurrentLevelFetched
});

MapRouter.propTypes = {
  isMapRendered: PropTypes.bool,
  isCurrentLevelFetched: PropTypes.bool
};

export default connect(mapStateToProps)(MapRouter);
