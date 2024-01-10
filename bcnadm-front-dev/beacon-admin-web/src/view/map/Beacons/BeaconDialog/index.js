import { BeaconService } from 'src/service/BeaconService';
import { LocationService } from 'src/utils/LocationService';
import { LevelService } from 'src/service/LevelService';
import { addPopupMessageText } from 'src/actions/popupMessage';
import { SUCCESSFUL, ERROR } from 'src/utils/popUpConsts';
import React, { Component } from 'react';
import { formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import PropTypes from 'prop-types';
import { withLocalize } from 'react-localize-redux';

import { BuildingService } from 'service/BuildingService';
import BeaconForm from '../BeaconForm';
import '../../GeneralDialogsStyles/dialogs.scss';

export class BeaconDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      beacon: null,
      level: null
    };
  }

  componentDidMount() {
    const { beacon } = this.props.match.params;

    Promise.all([this.loadBeacon(beacon), this.getLevel()])
      .then((response) => {
        this.setState({
          beacon: response[0],
          level: response[1]
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  async loadBeacon(beaconId) {
    try {
      const beaconTemplate = {
        entityId: null,
        latitude: 0,
        longitude: 0,
        uuid: null,
        levelId: null
      };
      let beacon;
      if (beaconId === 'new') {
        beacon = beaconTemplate;
      } else {
        beacon = await BeaconService.findOne(beaconId);
      }

      if (this.props.location.state) {
        Object.assign(beacon, this.props.location.state);
      }
      if (!beacon.levelId) {
        Object.assign(beacon, {
          levelId: this.props.match.params.level
        });
      }
      return beacon;
    } catch {
      const errorText =
        beaconId === 'new'
          ? this.props.translate('mapAlerts.beacon.createBeaconError')
          : this.props.translate('mapAlerts.beacon.openBeaconError');
      this.closeBeaconDialog(errorText, ERROR);
    }
  }

  closeBeaconDialog = (messageText, style) => {
    this.props.history.push({
      pathname: LocationService.getBeaconsLocation(
        this.props.match.params.building,
        this.props.match.params.level,
        true
      ),
      updated: true
    });
    this.props.addPopupMessageText(messageText, style);
  };

  checkIsBeaconUnique = async (beaconInfo) => {
    try {
      const listOfAllBeacons = await BeaconService.findALlBeacons();
      const repeatedBeaconInfo = listOfAllBeacons.find((item) => item.uuid === beaconInfo.uuid);
      if (repeatedBeaconInfo) {
        const levelOfRepeatedBeacon = await LevelService.getLevel(repeatedBeaconInfo.levelId);
        const buildingOfRepeatedBeacon = await BuildingService.findOne(levelOfRepeatedBeacon.buildingId);
        return buildingOfRepeatedBeacon;
      }
      return null;
    } catch (err) {
      return null;
    }
  };

  saveBeacon = async () => {
    const { beaconInfo, translate } = this.props;
    try {
      const buildingOfRepeatedBeacon = await this.checkIsBeaconUnique(beaconInfo);
      if (buildingOfRepeatedBeacon) {
        this.closeBeaconDialog(
          translate('mapAlerts.beacon.repeatedBeaconUUID', { value: buildingOfRepeatedBeacon.name }),
          ERROR
        );
      } else {
        await BeaconService.saveBeacon(Object.assign(this.state.beacon, beaconInfo));
        this.closeBeaconDialog(translate('mapAlerts.beacon.success'), SUCCESSFUL);
      }
    } catch (err) {
      console.error(err);
    }
  };

  deleteBeacon = () => {
    const { translate } = this.props;
    BeaconService.deleteBeacon(this.state.beacon)
      .then(() => this.closeBeaconDialog(translate('mapAlerts.beacon.deleted'), ERROR))
      .catch((err) => {
        throw err;
      });
  };

  getLevel = () =>
    LevelService.getLevel(this.props.match.params.level).then((level) => {
      return level;
    });

  renderBeaconDeleteButton = (beacon) =>
    beacon && beacon.entityId ? (
      <Button key={1} onClick={this.deleteBeacon} className="deleteButton">
        {this.props.translate('map.delete')}
      </Button>
    ) : null;

  renderActions = (beacon) => (
    <>
      {this.renderBeaconDeleteButton(beacon)}
      <div className="mock" />
      <Button key={2} onClick={() => this.onCancel(beacon)}>
        {this.props.translate('map.cancel')}
      </Button>
      <Button key={3} onClick={this.saveBeacon} disabled={!this.props.isValid} color="primary">
        {this.props.translate('map.save')}
      </Button>
    </>
  );

  onCancel = (beacon) => {
    if (beacon.entityId) {
      this.closeBeaconDialog(this.props.translate('mapAlerts.beacon.cancelledEdition'), ERROR);
    } else {
      this.closeBeaconDialog(this.props.translate('mapAlerts.beacon.cancelledCreation'), ERROR);
    }
  };

  render() {
    const { beacon, level } = this.state;

    let title = null;

    if (level) {
      title =
        beacon && beacon.entityId
          ? this.props.translate('map.editBeacon', { value: level.number })
          : this.props.translate('map.newBeacon', { value: level.number });

      return (
        <Dialog open classes={{ paper: 'mapDialog' }} onClose={() => this.onCancel(beacon)}>
          <DialogTitle>{title}</DialogTitle>
          <DialogContent>
            <BeaconForm
              initialValues={
                this.state.beacon
                  ? {
                      UUID: this.state.beacon.uuid
                    }
                  : {}
              }
              enableReinitialize
            />
          </DialogContent>
          <DialogActions>{this.renderActions(beacon)}</DialogActions>
        </Dialog>
      );
    }

    return null;
  }
}

BeaconDialog.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.shape({
      latitude: PropTypes.number.isRequired,
      longitude: PropTypes.number.isRequired
    })
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      building: PropTypes.string.isRequired,
      layer: PropTypes.string.isRequired,
      level: PropTypes.string.isRequired,
      beacon: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  addPopupMessageText: PropTypes.func,
  history: PropTypes.object,
  beaconInfo: PropTypes.object,
  translate: PropTypes.func,
  isValid: PropTypes.bool
};

/**
 * There were some troubles with validation such as:
 * validation is triggered when values in fields are changed,
 * therefore, if to open dialog and to leave fields empty,
 * (setting 'touched' property to true)validation will be triggered.
 * If to close and reopen the dialog, validation will not be triggered
 * as values hasn't be changed (errors will be emptied cause form resets
 * on dialog closing).
 * Solution: using global variable that will contain errors so that
 * they will be stored even if form resets, so that when fields are 'touched'
 * and still empty, validation error will show up.
 * Possible solution: unmount the dialog component (considered as bad solution
 * in react ideology)
 */

const selector = formValueSelector('BeaconInfo');

const mapDispatchToProps = {
  addPopupMessageText
};

const mapStateToProps = (state) => {
  const form = state.form.BeaconInfo;
  return {
    beaconInfo: {
      uuid: selector(state, 'UUID')
    },
    isValid: form ? !form.syncErrors : false
  };
};

export default withRouter(withLocalize(connect(mapStateToProps, mapDispatchToProps)(BeaconDialog)));
