import React from 'react';
import { Route } from 'react-router-dom';

import { BEACON_ID, BUILDING_ID, BUILDINGS, EDIT, EDIT_MODE, LAYER, LEVEL_ID, LEVELS } from 'src/consts/RouteConsts';
import BeaconDialog from './BeaconDialog';
import { dialog } from '../MapConsts';
import BeaconMarkers from './BeaconMarkers';

export const BeaconsRouter = () => {
  return (
    <>
      <Route
        path={BUILDINGS + BUILDING_ID + LEVELS + LEVEL_ID + LAYER + EDIT_MODE}
        render={(props) => <BeaconMarkers {...props} />}
      />
      <Route
        path={BUILDINGS + BUILDING_ID + LEVELS + LEVEL_ID + LAYER + EDIT + BEACON_ID}
        render={() => <BeaconDialog ifOpened={dialog.BEACON_DIALOG_OPEN} enableReinitialize />}
      />
    </>
  );
};
