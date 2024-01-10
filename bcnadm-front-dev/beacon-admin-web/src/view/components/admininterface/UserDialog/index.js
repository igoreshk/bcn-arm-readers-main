import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { addPopupMessageText } from 'src/actions/popupMessage';
import { ERROR } from 'src/utils/popUpConsts';
import { withLocalize } from 'react-localize-redux';
import { hideLoadingScreen, showLoadingScreen } from 'src/actions/loadingScreen';
import { UserService } from 'src/service/UserService';
import { UserRolesService } from 'src/service/UserRolesService';
import UserFormContainer from 'src/view/containers/UserDialogFormContainer';
import { USERS_LIST } from 'src/consts/RouteConsts';
import { USER_DIALOG_FORM } from 'src/consts/FormsNames';
import { formatUserValuesFromGetRequest, formatUserValuesForPostRequest } from 'src/utils/usersEndpointNamesFormatters';

const newUserId = 'new';
const newUserEntity = {
  login: null,
  firstName: '',
  lastName: '',
  email: null,
  locale: null,
  lastEntry: null,
  lastLogout: null,
  lastSessionInterval: null,
  password: null,
  role: null,
  status: null
};

export class UserDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      entity: null,
      rolesState: []
    };
  }

  componentDidMount() {
    this.props.showLoadingScreen();
    this.loadData();
  }

  setCurrentUser(entity) {
    this.setState({ entity });
  }

  setRoles(roles) {
    this.setState({
      rolesState: roles
    });
  }

  async loadUser() {
    const {
      history,
      translate,
      addPopupMessageText: addPopupText,
      match: {
        params: { id }
      }
    } = this.props;

    try {
      if (id !== newUserId) {
        const currentUser = await UserService.findOne(id);
        const formattedUser = formatUserValuesFromGetRequest(currentUser);
        this.setCurrentUser(formattedUser);
      } else {
        this.setCurrentUser(newUserEntity);
      }
    } catch {
      history.push(USERS_LIST);
      const errorMessage = translate('admin.loadError');
      addPopupText(errorMessage, ERROR);
    }
  }

  loadRoles() {
    return new Promise((resolve) => {
      UserRolesService.findAll()
        .then((roles) => {
          this.setRoles(roles);
        })
        .finally(() => {
          resolve();
        })
        .catch((err) => {
          throw err;
        });
    });
  }

  loadData() {
    const timeOutTime = 400;
    Promise.all([this.loadRoles(), this.loadUser()])
      .then(() => {
        setTimeout(() => this.props.hideLoadingScreen(), timeOutTime); // for smoothness
      })
      .catch((err) => {
        throw err;
      });
  }

  saveUser = () => {
    const { values, history } = this.props;
    UserService.saveUser(values)
      .then(() =>
        history.push({
          pathname: USERS_LIST,
          // to update users list
          updated: true
        })
      )
      .catch((err) => {
        throw err;
      });
  };

  cancel = () => {
    this.props.history.push(USERS_LIST);
  };

  render() {
    const { entity, rolesState } = this.state;

    if (entity) {
      return <UserFormContainer roles={rolesState} entity={entity} saveUser={this.saveUser} cancel={this.cancel} />;
    }

    return null;
  }
}

UserDialog.propTypes = {
  match: PropTypes.object.isRequired,
  showLoadingScreen: PropTypes.func.isRequired,
  hideLoadingScreen: PropTypes.func.isRequired,
  values: PropTypes.object,
  history: PropTypes.shape({
    push: PropTypes.func
  }),
  addPopupMessageText: PropTypes.func.isRequired
};

const mapDispatchToProps = {
  showLoadingScreen,
  hideLoadingScreen,
  addPopupMessageText
};

const mapStateToProps = (state) => {
  const userForm = state.form[USER_DIALOG_FORM];
  const formValues = formatUserValuesForPostRequest(state);
  return {
    values: userForm ? formValues : null
  };
};

export default withRouter(withLocalize(connect(mapStateToProps, mapDispatchToProps)(UserDialog)));
