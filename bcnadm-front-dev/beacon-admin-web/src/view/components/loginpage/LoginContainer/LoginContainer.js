import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';
import { withLocalize } from 'react-localize-redux';

import './loginContainer.scss';

import LoginService from 'src/service/LoginService';

const LoginContainer = (props) => {
  const { translate } = props;

  return (
    <div id="loginContainer" className="loginContainer">
      <div className="buttonContainer">
        {/* <a href={'/login'}> */}
        <a href={LoginService.loginUrl()}>
          <Button classes={{ root: 'loginButton', label: 'label' }} variant="contained">
            {`< ${translate('epamloginpage.login')} >`}
          </Button>
        </a>
        <a href="https://password.epam.com/">
          <Button classes={{ root: 'restorePasswordButton', label: 'label' }} variant="contained">
            {`< ${translate('epamloginpage.password')} >`}
          </Button>
        </a>
      </div>
    </div>
  );
};

LoginContainer.propTypes = {
  translate: PropTypes.func.isRequired
};

export default withLocalize(LoginContainer);
