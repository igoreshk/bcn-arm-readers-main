import React from 'react';
import { Route } from 'react-router-dom';

import { BUILDING_ID, BUILDINGS, EDIT, EDIT_MODE, LAYER, AREA_ID, LEVEL_ID, LEVELS } from 'src/consts/RouteConsts';
import AreaDialog from './AreaDialog';
import AreasMarkers from './AreasMarkers';
import { dialog } from '../MapConsts';

export const AreasRouter = () => {
  return (
    <>
      <Route
        path={BUILDINGS + BUILDING_ID + LEVELS + LEVEL_ID + LAYER + EDIT_MODE}
        render={(props) => <AreasMarkers {...props} />}
      />
      <Route
        path={BUILDINGS + BUILDING_ID + LEVELS + LEVEL_ID + LAYER + EDIT + AREA_ID}
        render={() => <AreaDialog ifOpened={dialog.AREAS_DIALOG_OPEN} enableReinitialize />}
      />
    </>
  );
};
