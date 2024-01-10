import React from 'react';
import { Route } from 'react-router-dom';

import { READER_ID, BUILDING_ID, BUILDINGS, EDIT, EDIT_MODE, LAYER, LEVEL_ID, LEVELS } from 'src/consts/RouteConsts';
import ReaderDialog from './ReaderDialog';
import { dialog } from '../MapConsts';
import ReaderMarkers from './ReaderMarkers';

export const ReadersRouter = () => {
  return (
    <>
      <Route
        path={BUILDINGS + BUILDING_ID + LEVELS + LEVEL_ID + LAYER + EDIT_MODE}
        render={(props) => <ReaderMarkers {...props} />}
      />
      <Route
        path={BUILDINGS + BUILDING_ID + LEVELS + LEVEL_ID + LAYER + EDIT + READER_ID}
        render={() => <ReaderDialog ifOpened={dialog.BEACON_DIALOG_OPEN} enableReinitialize />}
      />
    </>
  );
};
