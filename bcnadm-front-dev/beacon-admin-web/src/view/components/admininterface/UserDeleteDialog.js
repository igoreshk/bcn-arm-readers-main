import { USERS_LIST } from 'src/consts/RouteConsts';
import { UserService } from 'src/service/UserService';
import { hideLoadingScreen, showLoadingScreen } from 'src/actions/loadingScreen';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import PropTypes from 'prop-types';
import { withLocalize } from 'react-localize-redux';

class UserDeleteDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null
    };
    this.onDeleteClick = this.onDeleteClick.bind(this);
  }

  componentDidMount() {
    const timeOutTime = 400;
    this.props.showLoadingScreen();
    this.loadUser()
      .then(() => {
        setTimeout(() => this.props.hideLoadingScreen(), timeOutTime); // for smoothness
      })
      .catch((err) => {
        throw err;
      });
  }

  setCurrentUser(user) {
    this.setState({ currentUser: user });
  }

  loadUser() {
    const id = this.props.match.params.id;
    return new Promise((resolve) => {
      if (id) {
        UserService.findOne(id)
          .then(
            (user) => {
              this.setCurrentUser(user);
              resolve();
            },
            () => {
              this.props.history.push(USERS_LIST);
            }
          )
          .finally(() => {
            resolve();
          })
          .catch((err) => {
            throw err;
          });
      }
    });
  }

  onDeleteClick() {
    UserService.remove(this.state.currentUser.entityId)
      .then(() => {
        this.props.history.push({
          pathname: USERS_LIST,
          // to update buildings list
          updated: true
        });
      })
      .catch((err) => {
        throw err;
      });
  }

  onCancelClick = () => {
    this.props.history.push(USERS_LIST);
  };

  render() {
    const { currentUser } = this.state;

    if (currentUser) {
      const { translate } = this.props;

      return (
        <Dialog open onClose={this.onCancelClick}>
          <DialogTitle>{translate('admin.dialog.deleteUserTitle')}</DialogTitle>
          <DialogContent>
            <p>
              {translate('admin.dialog.warningMessage')}
              <strong>{currentUser.email}</strong>
              <br />
              {translate('buildingsTable.undoneMessage')}
            </p>
          </DialogContent>
          <DialogActions>
            <Button key="user-cancel-button" onClick={this.onCancelClick}>
              {translate('common.cancel')}
            </Button>
            <Button key="user-remove-button" onClick={this.onDeleteClick} color="primary">
              {translate('common.remove')}
            </Button>
          </DialogActions>
        </Dialog>
      );
    }

    return null;
  }
}

UserDeleteDialog.propTypes = {
  showLoadingScreen: PropTypes.func.isRequired,
  hideLoadingScreen: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string
    })
  })
};

const mapDispatchToProps = {
  showLoadingScreen,
  hideLoadingScreen
};

export default withRouter(connect(null, mapDispatchToProps)(withLocalize(UserDeleteDialog)));
