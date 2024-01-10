import { BUILDING_ID, BUILDINGS, EDIT_MODE, LAYER, LEVEL_ID, LEVELS } from 'src/consts/RouteConsts';
import React from 'react';
import { Route } from 'react-router-dom';
import DrawingBar from 'view/map/DrawingBar/DrawingBar';

export const DrawingRouter = ({
  buildingCenterCoordinates,
  picture,
  pictureCoords,
  loadedOSMap,
  selectedMapProviderName
}) => {
  return (
    <Route
      path={BUILDINGS + BUILDING_ID + LEVELS + LEVEL_ID + LAYER + EDIT_MODE}
      render={(props) => (
        <DrawingBar
          props={props}
          match={props.match}
          selectedMapProviderName={selectedMapProviderName}
          buildingCenterCoordinates={buildingCenterCoordinates}
          picture={picture}
          pictureCoords={pictureCoords}
          loadedOSMap={loadedOSMap}
        />
      )}
    />
  );
};
