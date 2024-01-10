import CustomTextField from 'src/view/map/CustomTextField';
import LocaleSelect from 'src/view/components/admininterface/appbar/Settings/LocaleSelect';
import { EMAIL, PROFILE, USER, LOGIN, PASSWORD } from 'src/consts/RouteConsts';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Field } from 'redux-form';
import { Button, Paper } from '@material-ui/core';
import NotificationsIcon from '@material-ui/icons/Mail';
import PropTypes from 'prop-types';
import { withLocalize } from 'react-localize-redux';

const notifIconStyle = {
  margin: '0 0 0 5px',
  color: '#9E9E9E'
};

class UserProfileDetails extends Component {
  emailDialogOpen = () => {
    this.props.history.push(USER + PROFILE + EMAIL);
  };

  loginDialogOpen = () => {
    this.props.history.push(USER + PROFILE + LOGIN);
  };

  passwordDialogOpen = () => {
    this.props.history.push(USER + PROFILE + PASSWORD);
  };

  validate = (value) => {
    return value ? null : this.props.translate('validation.required');
  };

  render() {
    return (
      <Paper className="userDetails" elevation={6}>
        <div>
          <Field
            name="name"
            component={CustomTextField}
            params={{
              label: this.props.translate('userProfile.settings.name'),
              type: 'text'
            }}
            fieldName="firstName"
            validate={this.validate}
          />
          <Field
            name="lastName"
            component={CustomTextField}
            params={{
              label: this.props.translate('userProfile.settings.surname'),
              type: 'text'
            }}
            fieldName="lastName"
            validate={this.validate}
          />
        </div>

        <div>
          <Field
            name="login"
            component={CustomTextField}
            params={{
              label: this.props.translate('userProfile.settings.login'),
              type: 'text',
              disabled: true
            }}
            fieldName="login"
          />
          {this.props.profile.isLoginChanging && <NotificationsIcon style={notifIconStyle} />}
          <Button onClick={this.loginDialogOpen} variant="contained" className="changeButton">
            {this.props.translate('userProfile.settings.change')}
          </Button>
        </div>

        <div>
          <Field
            name="email"
            component={CustomTextField}
            params={{
              label: this.props.translate('userProfile.settings.email'),
              type: 'text',
              disabled: true
            }}
            fieldName="email"
          />
          {this.props.profile.isEmailChanging && <NotificationsIcon style={notifIconStyle} />}
          <Button onClick={this.emailDialogOpen} variant="contained" className="changeButton">
            {this.props.translate('userProfile.settings.change')}
          </Button>
        </div>

        <div>
          <Field
            name="locale"
            component={LocaleSelect}
            curLocale={this.props.profile.locale}
            floatingLabelText={this.props.translate('settings.language')}
          />
        </div>

        <Button className="changePasswordButton" onClick={this.passwordDialogOpen} variant="contained">
          {this.props.translate('userProfile.settings.changePassword')}
        </Button>

        {this.props.profile.isPasswordChanging && <NotificationsIcon style={notifIconStyle} />}

        <div className="saveButton">
          <Button onClick={this.props.saveSettings} disabled={!this.props.valid} color="primary">
            {this.props.translate('admin.save')}
          </Button>
        </div>
      </Paper>
    );
  }
}

UserProfileDetails.propTypes = {
  profile: PropTypes.shape(
    {
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      login: PropTypes.string.isRequired,
      fileId: PropTypes.string,
      isLoginChanging: PropTypes.bool.isRequired,
      isEmailChanging: PropTypes.bool.isRequired,
      isPasswordChanging: PropTypes.bool.isRequired
    }.isRequired
  ),
  translate: PropTypes.func.isRequired,
  history: PropTypes.object,
  saveSettings: PropTypes.func,
  valid: PropTypes.bool
};

export default withRouter(withLocalize(UserProfileDetails));
