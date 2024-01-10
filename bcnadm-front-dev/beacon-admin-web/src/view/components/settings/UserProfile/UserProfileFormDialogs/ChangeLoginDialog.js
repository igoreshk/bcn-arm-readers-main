import CustomTextField from 'src/view/map/CustomTextField';
import { addPopupMessageText } from 'src/actions/popupMessage';
import UserProfileService from 'src/service/UserProfileService';
import { PROFILE, USER } from 'src/consts/RouteConsts';
import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import PropTypes from 'prop-types';
import { withLocalize } from 'react-localize-redux';

class ChangeLoginDialog extends Component {
  changeLogin = () => {
    const newLogin = this.props.values.newLogin;
    UserProfileService.isValidCurrentUserLogin(newLogin)
      .then((valid) => {
        UserProfileService.changeCurrentUserLogin(valid)
          .then(() => {
            this.closeDialog();
            this.props.addPopupMessageText(this.props.translate('popUpText.requestSent'));
          })
          .catch(() => {
            this.props.addPopupMessageText(this.props.translate('popUpText.failedRequest'));
          });
      })
      .catch(() => {
        this.props.addPopupMessageText(this.props.translate('popUpText.repeatedLogin'));
      });
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
      <Dialog open onClose={this.closeDialog} PaperProps={{ style: { width: 400 } }}>
        <DialogTitle>{this.props.translate('userProfile.settings.newLoginTitle')}</DialogTitle>
        <DialogContent>
          <form>
            <Field
              name="newLogin"
              component={CustomTextField}
              params={{
                label: this.props.translate('userProfile.settings.newLoginField'),
                type: 'text'
              }}
              fieldName="newLogin"
              validate={this.validate}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.closeDialog}>{this.props.translate('admin.cancel')}</Button>
          <Button onClick={this.props.handleSubmit(this.changeLogin)} disabled={!this.props.valid} color="primary">
            {this.props.translate('admin.save')}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

ChangeLoginDialog.propTypes = {
  translate: PropTypes.func.isRequired,
  addPopupMessageText: PropTypes.func.isRequired
};

const mapDispatchToProps = {
  addPopupMessageText
};

const mapStateToProps = (state) => {
  const loginForm = state.form.ChangeLoginDialog;
  return {
    values: loginForm ? loginForm.values : null
  };
};

ChangeLoginDialog.propTypes = {
  values: PropTypes.object,
  history: PropTypes.object,
  reset: PropTypes.func,
  handleSubmit: PropTypes.func,
  valid: PropTypes.func
};

export default reduxForm({
  form: 'ChangeLoginDialog'
})(withRouter(connect(mapStateToProps, mapDispatchToProps)(withLocalize(ChangeLoginDialog))));
