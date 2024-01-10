import CustomTextField from 'src/view/map/CustomTextField';
import { addPopupMessageText } from 'src/actions/popupMessage';
import UserProfileService from 'src/service/UserProfileService';
import { PROFILE, USER } from 'src/consts/RouteConsts';
import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import PropTypes from 'prop-types';
import { withLocalize } from 'react-localize-redux';

const errorMessageStyle = {
  marginTop: '15px',
  color: 'red'
};

class ChangePasswordDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDifferentPasswords: false,
      isInvalidPassword: false
    };
  }

  checkPassword = () => {
    const re = new RegExp('^[a-zA-Z0-9_-]{4,14}$');
    if (!re.test(this.props.values.newPassword)) {
      this.setState({
        isInvalidPassword: true
      });
    } else {
      this.setState({
        isInvalidPassword: false
      });
      this.comparePasswords();
    }
  };

  comparePasswords = () => {
    if (
      this.props.values.newPassword !== this.props.values.confirmPassword ||
      this.props.values.newPassword === '' ||
      this.props.values.confirmPassword === ''
    ) {
      this.setState({
        isDifferentPasswords: true
      });
    } else {
      this.setState({
        isDifferentPasswords: false
      });
      UserProfileService.changeCurrentUserPassword(this.props.values.newPassword)
        .then(() => {
          this.props.addPopupMessageText(this.props.translate('popUpText.requestSent'));
        })
        .catch(() => {
          this.props.addPopupMessageText(this.props.translate('popUpText.failedRequest'));
        });
      this.closeDialog();
    }
  };

  closeDialog = () => {
    this.props.history.push({
      pathname: USER + PROFILE,
      updated: true
    });
    this.props.reset();
  };

  validate = (value) => {
    return value ? null : this.props.translate('validation.required');
  };

  render() {
    return (
      <Dialog open onClose={this.closeDialog}>
        <DialogTitle>{this.props.translate('userProfile.settings.changePassword')}</DialogTitle>
        <DialogContent>
          <form>
            <Field
              name="newPassword"
              component={CustomTextField}
              params={{
                label: this.props.translate('userProfile.settings.newPasswordField'),
                type: 'password'
              }}
              fieldName="newPassword"
              validate={this.validate}
            />
            <Field
              name="confirmPassword"
              component={CustomTextField}
              params={{
                label: this.props.translate('userProfile.settings.confirmPasswordField'),
                type: 'password'
              }}
              fieldName="confirmPassword"
              validate={this.validate}
            />
          </form>
          <div style={errorMessageStyle}>
            {(this.state.isDifferentPasswords && (
              <span>{this.props.translate('userProfile.settings.confirmationFailed')}</span>
            )) ||
              (this.state.isInvalidPassword && (
                <span>{this.props.translate('userProfile.settings.validationFailed')}</span>
              ))}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.closeDialog}>{this.props.translate('admin.cancel')}</Button>
          <Button onClick={this.props.handleSubmit(this.checkPassword)} disabled={!this.props.valid} color="primary">
            {this.props.translate('admin.save')}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

ChangePasswordDialog.propTypes = {
  translate: PropTypes.func.isRequired,
  addPopupMessageText: PropTypes.func.isRequired,
  values: PropTypes.shape({
    newPassword: PropTypes.string,
    confirmPassword: PropTypes.string
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func
  }),
  reset: PropTypes.func,
  handleSubmit: PropTypes.func,
  valid: PropTypes.func
};

const mapStateToProps = (state) => {
  const passwordForm = state.form.ChangePasswordDialog;
  return {
    values: passwordForm ? passwordForm.values : null
  };
};

const mapDispatchToProps = {
  addPopupMessageText
};

export default reduxForm({
  form: 'ChangePasswordDialog',
  enableReinitialize: true
})(connect(mapStateToProps, mapDispatchToProps)(withLocalize(ChangePasswordDialog)));
