/* eslint-disable no-magic-numbers */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import PropTypes from 'prop-types';
import { withLocalize } from 'react-localize-redux';
import { addPopupMessageText } from 'src/actions/popupMessage';
import { ERROR } from 'src/utils/popUpConsts';

import VisitorGroupsService from 'src/service/VisitorGroupsService';
import { WATCHERS_LIST } from 'src/consts/RouteConsts';
import { hideLoadingScreen, showLoadingScreen } from 'src/actions/loadingScreen';

class WatcherDeleteDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentWatcher: null
    };
  }

  componentDidMount() {
    this.props.showLoadingScreen();
    this.loadWatcher()
      .then(() => {
        setTimeout(() => this.props.hideLoadingScreen(), 400); // for smoothness
      })
      .catch((err) => {
        throw err;
      });
  }

  setCurrentWatcher(watcher) {
    this.setState({ currentWatcher: watcher });
  }

  loadWatcher() {
    const { id } = this.props.match.params;
    return VisitorGroupsService.findOne(id)
      .then((watcher) => {
        this.setCurrentWatcher(watcher);
      })
      .catch(() => {
        this.props.history.push(WATCHERS_LIST);
      })
      .finally(() => {
        setTimeout(() => this.props.hideLoadingScreen(), 400);
      });
  }

  onDeleteClick = () => {
    const { history } = this.props;
    this.props.showLoadingScreen();
    VisitorGroupsService.remove(this.state.currentWatcher.entityId)
      .then(() => {
        history.push({
          pathname: WATCHERS_LIST,
          // to update watchers list
          updated: true
        });
        this.props.hideLoadingScreen();
      })
      .catch(() => {
        history.push({
          pathname: WATCHERS_LIST,
          updated: true
        });
        this.props.hideLoadingScreen();
        this.props.addPopupMessageText(this.props.translate('watchers.deleteWatcherError'), ERROR);
      });
  };

  onCancelClick = () => {
    this.props.history.push(WATCHERS_LIST);
  };

  render() {
    const { currentWatcher } = this.state;

    if (currentWatcher) {
      const { translate } = this.props;

      return (
        <Dialog open onClose={this.onCancelClick}>
          <DialogTitle>
            {translate('watchers.deleteWatcher')} <br /> {this.state.currentWatcher.name}
          </DialogTitle>
          <DialogContent>
            <p>
              <br />
              {translate('buildingsTable.undoneMessage')}
            </p>
          </DialogContent>
          <DialogActions>
            <Button key="watcher-cancel-button" onClick={this.onCancelClick}>
              {translate('common.cancel')}
            </Button>
            <Button key="watcher-remove-button" color="primary" onClick={this.onDeleteClick}>
              {translate('common.remove')}
            </Button>
          </DialogActions>
        </Dialog>
      );
    }

    return null;
  }
}

WatcherDeleteDialog.propTypes = {
  match: PropTypes.object.isRequired,
  showLoadingScreen: PropTypes.func.isRequired,
  hideLoadingScreen: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired,
  addPopupMessageText: PropTypes.func,
  history: PropTypes.object.isRequired
};

const mapDispatchToProps = {
  showLoadingScreen,
  addPopupMessageText,
  hideLoadingScreen
};

export default withRouter(connect(null, mapDispatchToProps)(withLocalize(WatcherDeleteDialog)));
