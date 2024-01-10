import { BuildingService } from 'src/service/BuildingService';
import { BUILDINGS_LIST, MAP, NEW_BUILDING } from 'src/consts/RouteConsts';
import { hideLoadingScreen, showLoadingScreen } from 'src/actions/loadingScreen';
import { withLocalize } from 'react-localize-redux';
import { addPopupMessageText } from 'src/actions/popupMessage';
import { ERROR } from 'src/utils/popUpConsts';
import BuildingFormContainer from 'src/view/containers/BuildingFormContainer';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Dialog, DialogContent } from '@material-ui/core';
import PropTypes from 'prop-types';
import { setBuildingFormCurrentStep } from 'src/actions/getBuildingsAction';

import './buildingDialog.scss';

const SET_LEVELS_MAPS = 'SET_BUILDING_INFO';
const SET_LEVELS_MAPS_INDEX = 0;

const newBuildingTemplate = {
  entityId: null,
  address: null,
  createdBy: null,
  height: 0,
  latitude: 0,
  longitude: 0,
  name: null,
  phoneNumber: null,
  width: 0,
  workingHours: null
};

export class BuildingDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentBuilding: null,
      levels: null
    };
  }

  componentDidMount() {
    const timeOutTime = 400;
    const buildingId = this.props.match.params.id;
    if (buildingId === 'new') {
      this.setState({ currentBuilding: newBuildingTemplate });
      this.setState({ levels: [] });
    } else {
      this.props.showLoadingScreen();
      Promise.all([this.loadBuilding(buildingId), this.loadLevels(buildingId)])
        .then(() => {
          setTimeout(() => this.props.hideLoadingScreen(), timeOutTime); // for smoothness
        })
        .catch(() => {
          this.props.history.push(BUILDINGS_LIST);
          const errorText =
            buildingId === 'new'
              ? this.props.translate('buildings.createBuildingError')
              : this.props.translate('buildings.openToEditBuildingError');
          this.props.addPopupMessageText(errorText, ERROR);
        });
    }
  }

  async loadBuilding(buildingId) {
    const currentBuilding = await BuildingService.findOne(buildingId);
    this.setState({ currentBuilding });
  }

  async loadLevels(buildingId) {
    const levels = await BuildingService.findBuildingLevels(buildingId);
    this.setState({ levels });
  }

  closeDialog = () => {
    if (this.props.root === BUILDINGS_LIST) {
      this.props.history.push({
        pathname: BUILDINGS_LIST,
        updated: true
      });
    }
    if (this.props.root === MAP) {
      const { pathname } = this.props.location;
      this.props.history.push({
        pathname: pathname.substring(0, pathname.indexOf(NEW_BUILDING))
      });
    }
    this.props.setBuildingFormCurrentStep(SET_LEVELS_MAPS, SET_LEVELS_MAPS_INDEX);
  };

  render() {
    const { currentBuilding, levels } = this.state;

    if (currentBuilding && levels) {
      return (
        <Dialog classes={{ paper: 'buildingDialog' }} open onClose={this.closeDialog}>
          <DialogContent>
            <BuildingFormContainer
              // TODO change name og submitMap + fix saving image
              currentBuilding={currentBuilding}
              levels={levels}
              setCurrentLevels={(newLevels) => this.setState({ levels: newLevels })}
              closeDialog={this.closeDialog}
              translate={this.props.translate}
            />
          </DialogContent>
        </Dialog>
      );
    }

    return null;
  }
}

BuildingDialog.propTypes = {
  showLoadingScreen: PropTypes.func.isRequired,
  hideLoadingScreen: PropTypes.func.isRequired,
  addPopupMessageText: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  translate: PropTypes.func.isRequired,
  root: PropTypes.string,
  location: PropTypes.object
};

const mapDispatchToProps = {
  showLoadingScreen,
  hideLoadingScreen,
  setBuildingFormCurrentStep,
  addPopupMessageText
};

export default withRouter(withLocalize(connect(null, mapDispatchToProps)(BuildingDialog)));
