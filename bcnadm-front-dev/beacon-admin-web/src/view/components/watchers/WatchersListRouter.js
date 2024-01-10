import { WATCHER_DIALOG, WATCHERS_DELETE_DIALOG, WATCHERS_LIST } from 'src/consts/RouteConsts';
import React from 'react';
import { Route } from 'react-router-dom';

import WatchersList from './WatchersList';
import WatcherDeleteDialog from './WatcherDeleteDialog';
import WatcherDialog from './WatcherDialog';

const WatchersListRouter = () => {
  return (
    <>
      <Route path={WATCHERS_LIST} component={WatchersList} />
      <Route exact path={WATCHER_DIALOG} component={WatcherDialog} />
      <Route exact path={WATCHERS_DELETE_DIALOG} component={WatcherDeleteDialog} />
    </>
  );
};

export default WatchersListRouter;
