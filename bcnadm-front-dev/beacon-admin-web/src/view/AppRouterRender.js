import { AppRouter } from 'src/view/AppRouter';
import { WELCOME_PAGE } from 'src/consts/RouteConsts';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import PropTypes from 'prop-types';

class AppRouterRender extends PureComponent {
  isLoginPage() {
    return this.props.location.pathname === WELCOME_PAGE;
  }

  render() {
    if (this.props.isLoggedIn && !this.isLoginPage() && this.props.initialPage) {
      return <AppRouter />;
    }
    return null;
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.userSettings.isLogged,
    initialPage: state.userSettings.initialPage
  };
};

AppRouterRender.propTypes = {
  location: PropTypes.object,
  isLoggedIn: PropTypes.bool,
  initialPage: PropTypes.string
};

export default withRouter(connect(mapStateToProps, null)(AppRouterRender));
