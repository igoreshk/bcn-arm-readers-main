import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { LoginPage } from './components/loginpage/LoginPage/LoginPage';

class LoginPageRender extends PureComponent {
  render() {
    return <LoginPage />;
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.userSettings.isLogged,
    sessionChecked: state.session.status
  };
};

export default withRouter(connect(mapStateToProps, null)(LoginPageRender));
