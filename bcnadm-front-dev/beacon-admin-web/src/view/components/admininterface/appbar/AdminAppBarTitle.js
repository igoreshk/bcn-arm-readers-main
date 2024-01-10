import { CREATE_USER } from 'src/consts/RouteConsts';
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { withLocalize } from 'react-localize-redux';

import AddUserButton from './AddUserButton';

export const AdminAppBarTitle = (props) => (
  <AddUserButton
    onClick={() => {
      props.history.push(CREATE_USER);
    }}
    translate={props.translate}
  />
);

AdminAppBarTitle.propTypes = {
  translate: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired
};

export default withRouter(withLocalize(AdminAppBarTitle));
