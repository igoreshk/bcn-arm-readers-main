import { BUILDING_ID, BUILDINGS, EDIT_MODE, LAYER, LEVEL_ID, LEVELS } from 'src/consts/RouteConsts';
import React from 'react';
import { Route } from 'react-router-dom';

import RoutingMarkers from './RoutingMarkers';

export const RoutingRouter = () => {
  return (
    <Route
      path={BUILDINGS + BUILDING_ID + LEVELS + LEVEL_ID + LAYER + EDIT_MODE}
      render={(props) => <RoutingMarkers {...props} />}
    />
  );
};
