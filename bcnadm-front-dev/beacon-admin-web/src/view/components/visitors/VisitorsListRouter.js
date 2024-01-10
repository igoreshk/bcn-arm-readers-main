import { VISITOR_DIALOG, VISITORS_DELETE_DIALOG, VISITORS_LIST } from 'src/consts/RouteConsts';
import React from 'react';
import { Route } from 'react-router-dom';

import VisitorsList from './VisitorsList';
import VisitorDeleteDialog from './VisitorDeleteDialog';
import VisitorDialog from './VisitorDialog';

const VisitorsListRouter = () => {
  return (
    <>
      <Route path={VISITORS_LIST} component={VisitorsList} />
      <Route exact path={VISITOR_DIALOG} component={VisitorDialog} />
      <Route exact path={VISITORS_DELETE_DIALOG} component={VisitorDeleteDialog} />
    </>
  );
};

export default VisitorsListRouter;
