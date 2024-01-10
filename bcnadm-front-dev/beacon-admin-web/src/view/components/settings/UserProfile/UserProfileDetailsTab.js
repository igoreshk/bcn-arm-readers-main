import UserProfileService from 'src/service/UserProfileService';
import { hideLoadingScreen, showLoadingScreen } from 'src/actions/loadingScreen';
import { addPopupMessageText } from 'src/actions/popupMessage';
import { updateUserAvatar } from 'src/actions/updateUserAvatar';
import { linkBuilder } from 'src/utils/UrlBuilders/linkBuilder';
import { fetchUserSettings } from 'src/thunk/fetchUserSettings';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withLocalize } from 'react-localize-redux';
import { FORBIDDEN } from 'src/consts/ResponseConst';
import { ServerError } from 'src/utils/customErrors';
import networkErrorHandler from 'src/utils/networkErrorHandler';
import UserProfileFormContainer from './UserProfileFormContainer';

class UserProfileDetailsTab extends Component {
  state = {
    userProfile: {}
  };

  componentDidMount() {
    this.loadProfile();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.updated !== this.props.updated) {
      this.loadProfile();
    }
  }
  setSettings = (data) => {
    this.setState({ userProfile: data });
  };

  errorHandler = (error) => {
    const { translate } = this.props;
    if (error instanceof ServerError && error.response.status === FORBIDDEN) {
      this.props.addPopupMessageText(translate('popUpText.forbidden403'));
    }
    networkErrorHandler(error);
  };

  saveSettings = () => {
    const { values, translate } = this.props;
    values.entityId = this.state.userProfile.entityId;
    values.fileId = this.state.userProfile.image;
    UserProfileService.saveCurrentUserProfile(values)
      .then(() => {
        this.props.addPopupMessageText(translate('popUpText.saved'));
        this.loadProfile();
      })
      .catch(this.errorHandler);
  };

  loadProfile = () => {
    this.props.showLoadingScreen();
    this.props.fetchUserSettings();
    UserProfileService.getCurrentUserProfile()
      .then((profile) => {
        if (profile.fileId) {
          this.props.updateUserAvatar(linkBuilder().files(profile.fileId).img().build());
        }
        this.setSettings(profile);
      })
      .finally(this.props.hideLoadingScreen())
      .catch(this.errorHandler);
  };

  render() {
    return <UserProfileFormContainer userProfile={this.state.userProfile} saveSettings={this.saveSettings} />;
  }
}

UserProfileDetailsTab.propTypes = {
  showLoadingScreen: PropTypes.func.isRequired,
  hideLoadingScreen: PropTypes.func.isRequired,
  values: PropTypes.object,
  addPopupMessageText: PropTypes.func,
  translate: PropTypes.func,
  fetchUserSettings: PropTypes.func,
  updateUserAvatar: PropTypes.func,
  updated: PropTypes.bool
};

const mapStateToProps = (state) => {
  const form = state.form.UserProfileForm;
  return {
    values: form ? form.values : null
  };
};

const mapDispatchToProps = {
  showLoadingScreen,
  hideLoadingScreen,
  addPopupMessageText,
  updateUserAvatar,
  fetchUserSettings
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withLocalize(UserProfileDetailsTab)));
