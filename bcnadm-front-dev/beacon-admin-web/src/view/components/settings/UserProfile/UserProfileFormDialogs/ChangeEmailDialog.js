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

class ChangeEmailDialog extends Component {
  changeEmail = () => {
    const newEmail = this.props.values.newEmail;
    UserProfileService.isValidCurrentUserEmail(newEmail)
      .then((valid) => {
        UserProfileService.changeCurrentUserEmail(valid)
          .then(() => {
            this.closeDialog();
            this.props.addPopupMessageText(this.props.translate('popUpText.requestSent'));
          })
          .catch(() => {
            this.props.addPopupMessageText(this.props.translate('popUpText.failedRequest'));
          });
      })
      .catch(() => {
        this.props.addPopupMessageText(this.props.translate('popUpText.repeatedEmail'));
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
        <DialogTitle>{this.props.translate('userProfile.settings.newEmailTitle')}</DialogTitle>
        <DialogContent>
          <form>
            <Field
              name="newEmail"
              component={CustomTextField}
              params={{
                label: this.props.translate('userProfile.settings.newEmailField'),
                type: 'text'
              }}
              fieldName="newEmail"
              validate={this.validate}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.closeDialog}>{this.props.translate('admin.cancel')}</Button>
          <Button onClick={this.props.handleSubmit(this.changeEmail)} disabled={!this.props.valid} color="primary">
            {this.props.translate('admin.save')}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

ChangeEmailDialog.propTypes = {
  translate: PropTypes.func.isRequired,
  addPopupMessageText: PropTypes.func.isRequired,
  values: PropTypes.object,
  history: PropTypes.object,
  reset: PropTypes.func,
  handleSubmit: PropTypes.func,
  valid: PropTypes.func
};

const mapDispatchToProps = {
  addPopupMessageText
};

const mapStateToProps = (state) => {
  const emailForm = state.form.ChangeEmailDialog;
  return {
    values: emailForm ? emailForm.values : null
  };
};

export default reduxForm({
  form: 'ChangeEmailDialog'
})(withRouter(connect(mapStateToProps, mapDispatchToProps)(withLocalize(ChangeEmailDialog))));
