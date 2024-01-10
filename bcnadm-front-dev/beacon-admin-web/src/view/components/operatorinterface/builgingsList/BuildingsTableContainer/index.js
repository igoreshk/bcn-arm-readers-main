import { BUILDINGS_LIST, DELETE } from 'src/consts/RouteConsts';
import { hideLoadingScreen, showLoadingScreen } from 'src/actions/loadingScreen';

import { BuildingService } from 'src/service/BuildingService';
import { LocationService } from 'src/utils/LocationService';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withLocalize } from 'react-localize-redux';
import { withRouter } from 'react-router-dom';

import { Button, Snackbar, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { setBuildingFormCurrentStep } from 'src/actions/getBuildingsAction';
import BuildingsTable from '../BuildingsTable';

const SET_LEVELS_MAPS = 'SET_LEVELS_MAPS';
const SET_LEVELS_MAPS_INDEX = 2;

export class BuildingsTableContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buildings: [],
      open: false,
      buildingForSnackbar: null
    };
  }
  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.updated !== this.props.updated) {
      this.loadData();
    }
  }

  loadBuildings() {
    return new Promise((resolve) => {
      BuildingService.findAll()
        .then((buildings) => {
          this.setState({ buildings });
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
    this.props.showLoadingScreen();
    this.loadBuildings()
      .then(() => this.props.hideLoadingScreen())
      .catch((err) => {
        throw err;
      });
  }

  onEditClick = (building) => (event) => {
    event.stopPropagation();
    this.props.history.push(`${BUILDINGS_LIST}/${building.entityId}`);
  };

  onRemoveClick = (building) => (event) => {
    event.stopPropagation();
    this.props.history.push({
      pathname: `${BUILDINGS_LIST}/${building.entityId}${DELETE}`
    });
  };

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ open: false, buildingForSnackbar: null });
  };

  showMap = (building) => (event) => {
    event.stopPropagation();
    return BuildingService.findBuildingLevels(building.entityId).then((levels) => {
      if (levels.length) {
        this.props.history.push(LocationService.getBeaconsLocation(building.entityId, levels[0].entityId, false));
      } else if (!levels.length) {
        this.setState({ open: true, buildingForSnackbar: building });
      }
    });
  };

  handleAddLevels = () => {
    const building = this.state.buildingForSnackbar;
    if (building) {
      this.props.setBuildingFormCurrentStep(SET_LEVELS_MAPS, SET_LEVELS_MAPS_INDEX);
      this.props.history.push(`${BUILDINGS_LIST}/${building.entityId}`);
      this.handleClose();
    }
  };

  render() {
    return (
      <>
        <BuildingsTable
          source={this.state.buildings}
          onEditClick={this.onEditClick}
          keys={['name', 'address']}
          onRemoveClick={this.onRemoveClick}
          showMap={this.showMap}
          translate={this.props.translate}
        />
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}
          open={this.state.open}
          autoHideDuration={6000}
          onClose={this.handleClose}
          message={this.props.translate('building.messages.noLevels')}
          action={
            <>
              <Button color="secondary" size="small" onClick={this.handleAddLevels}>
                {this.props.translate('building.addLevel')}
              </Button>
              <IconButton size="small" aria-label="close" color="inherit" onClick={this.handleClose}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </>
          }
        />
      </>
    );
  }
}

const mapDispatchToProps = {
  showLoadingScreen,
  hideLoadingScreen,
  setBuildingFormCurrentStep
};

BuildingsTableContainer.propTypes = {
  hideLoadingScreen: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }),
  showLoadingScreen: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired,
  updated: PropTypes.bool
};

export default withRouter(connect(null, mapDispatchToProps)(withLocalize(BuildingsTableContainer)));
