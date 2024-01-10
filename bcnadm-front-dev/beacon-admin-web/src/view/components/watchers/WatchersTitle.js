import { CREATE_WATCHER } from 'src/consts/RouteConsts';
import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withLocalize } from 'react-localize-redux';

import AddWatcherButton from './AddWatcherButton';

const WatchersTitle = (props) => (
  <AddWatcherButton
    onClick={() => {
      props.history.push(CREATE_WATCHER);
    }}
    translate={props.translate}
  />
);

WatchersTitle.propTypes = {
  history: PropTypes.object.isRequired
};

export default withRouter(withLocalize(WatchersTitle));
