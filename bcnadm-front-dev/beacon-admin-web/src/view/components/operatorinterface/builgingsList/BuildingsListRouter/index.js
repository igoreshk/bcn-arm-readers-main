import BuildingDialogContainer from 'src/view/containers/BuildingDialogContainer';
import { BUILDING_DELETE_DIALOG, BUILDING_DIALOG, BUILDINGS_LIST } from 'src/consts/RouteConsts';
import React from 'react';
import { Route } from 'react-router-dom';

import BuildingsList from '../BuildingsList';
import BuildingDeleteDialog from '../../BuildingDeleteDialog';

export const BuildingsListRouter = () => {
  return (
    <>
      <Route path={BUILDINGS_LIST} component={BuildingsList} />
      <Route exact path={BUILDING_DELETE_DIALOG} component={BuildingDeleteDialog} />
      <Route exact path={BUILDING_DIALOG} render={() => <BuildingDialogContainer root={BUILDINGS_LIST} />} />
    </>
  );
};
