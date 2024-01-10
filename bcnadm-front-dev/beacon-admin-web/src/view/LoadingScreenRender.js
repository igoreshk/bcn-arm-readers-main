import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import PropTypes from 'prop-types';
import { LoadingScreen } from './LoadingScreen';

class LoadingScreenRender extends PureComponent {
  render() {
    if (this.props.isFetching || !this.props.sessionChecked) {
      return <LoadingScreen />;
    }
    return null;
  }
}

const mapStateToProps = (state) => {
  return {
    isFetching: state.loading.processesFetching,
    sessionChecked: state.session.status
  };
};

LoadingScreenRender.propTypes = {
  sessionChecked: PropTypes.bool,
  isFetching: PropTypes.bool
};

export default withRouter(connect(mapStateToProps, null)(LoadingScreenRender));
