import { CREATE_VISITOR } from 'src/consts/RouteConsts';
import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withLocalize } from 'react-localize-redux';

import AddVisitorButton from './AddVisitorButton';

const VisitorsTitle = (props) => (
  <AddVisitorButton
    onClick={() => {
      props.history.push(CREATE_VISITOR);
    }}
    translate={props.translate}
  />
);

VisitorsTitle.propTypes = {
  translate: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired
};

export default withRouter(withLocalize(VisitorsTitle));
