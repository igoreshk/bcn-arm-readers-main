import React from 'react';
import { Route } from 'react-router-dom';

import { BUILDING_ID, BUILDINGS, EDGE_ID, EDIT, EDIT_MODE, LAYER, LEVEL_ID, LEVELS } from 'src/consts/RouteConsts';
import DistanceDialog from './DistanceDialog';
import { dialog } from '../MapConsts';
import ScalingMarkers from './ScalingMarkers';

export const ScalingRouter = () => {
  return (
    <>
      <Route
        path={BUILDINGS + BUILDING_ID + LEVELS + LEVEL_ID + LAYER + EDIT_MODE}
        render={(props) => <ScalingMarkers {...props} />}
      />
      <Route
        path={BUILDINGS + BUILDING_ID + LEVELS + LEVEL_ID + LAYER + EDIT + EDGE_ID}
        render={() => <DistanceDialog ifOpened={dialog.DISTANCE_DIALOG_OPEN} enableReinitialize />}
      />
    </>
  );
};
