import { BUILDINGS_LIST } from 'src/consts/RouteConsts';
import { BuildingService } from 'src/service/BuildingService';
import { hideLoadingScreen, showLoadingScreen } from 'src/actions/loadingScreen';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import PropTypes from 'prop-types';
import { withLocalize } from 'react-localize-redux';

class BuildingDeleteDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentBuilding: null
    };
    this.onDeleteClick = this.onDeleteClick.bind(this);
  }

  componentDidMount() {
    const timeOutTime = 400;
    this.props.showLoadingScreen();
    this.loadBuilding()
      .then(() => {
        setTimeout(() => this.props.hideLoadingScreen(), timeOutTime); // for smoothness
      })
      .catch((err) => {
        throw err;
      });
  }

  loadBuilding() {
    const id = this.props.match.params.id;
    return new Promise((resolve) => {
      if (id) {
        BuildingService.findOne(id)
          .then(
            (building) => {
              this.setState({ currentBuilding: building });
            },
            () => {
              this.props.history.push(BUILDINGS_LIST);
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
    BuildingService.delete(this.state.currentBuilding.entityId)
      .then(() => {
        this.props.history.push({
          pathname: BUILDINGS_LIST,
          // to update buildings list
          updated: true
        });
      })
      .catch((err) => {
        throw err;
      });
  }

  onCancelClick = () => {
    this.props.history.push(BUILDINGS_LIST);
  };

  render() {
    const { currentBuilding } = this.state;

    if (currentBuilding) {
      const { translate } = this.props;

      return (
        <Dialog open onClose={this.onCancelClick}>
          <DialogTitle>{translate('buildings.remove')}</DialogTitle>
          <DialogContent>
            <p>
              {translate('buildingsTable.warningMessage')}
              <strong>{currentBuilding.name}</strong>?
              <br />
              {translate('buildingsTable.undoneMessage')}
            </p>
          </DialogContent>
          <DialogActions>
            <Button key="building-cancel-button" onClick={this.onCancelClick}>
              {translate('common.cancel')}
            </Button>
            <Button key="building-remove-button" color="primary" onClick={this.onDeleteClick}>
              {translate('common.remove')}
            </Button>
          </DialogActions>
        </Dialog>
      );
    }

    return null;
  }
}

BuildingDeleteDialog.propTypes = {
  showLoadingScreen: PropTypes.func.isRequired,
  hideLoadingScreen: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.object
};

const mapDispatchToProps = {
  showLoadingScreen,
  hideLoadingScreen
};

export default withRouter(connect(null, mapDispatchToProps)(withLocalize(BuildingDeleteDialog)));
