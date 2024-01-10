import React, { useEffect } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import { formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withLocalize } from 'react-localize-redux';

import { ERROR, SUCCESSFUL } from 'src/utils/popUpConsts';
import { setMapRenderedStatus } from 'reducers/mapSettingsReducer/mapSettingsSlice';
import {
  setCurrentLevel,
  resetTemporaryScaleEdge,
  resetScaleEdge
} from 'src/reducers/activeLevelInfoReducer/activeLevelInfoSlice';
import { addPopupMessageText } from 'src/actions/popupMessage';
import { LevelService } from 'src/service/LevelService';
import { LocationService } from 'src/utils/LocationService';
import PropTypes from 'prop-types';
import { validateDistance } from '../validateDistanceDialog';
import DistanceForm from './DistanceForm';
import { dialog } from '../MapConsts';

import '../GeneralDialogsStyles/dialogs.scss';

function DistanceDialog({
  ifOpened,
  translate,
  distance,
  currentLevel,
  temporaryScaleEdge,
  history,
  setLevel,
  resetTemporaryScaling,
  resetScaling,
  setMapStatus,
  openPopup,
  match: {
    params: { building: buildingId, level: levelId }
  }
}) {
  useEffect(() => {
    return () => {
      setMapStatus({ isMapRendered: false });
    };
  }, []);

  const saveDistance = () => {
    const updatedLevel = { ...currentLevel, ...temporaryScaleEdge, scaleDistance: distance };
    LevelService.saveLevel(updatedLevel)
      .then(() => {
        setLevel({ level: updatedLevel });
        resetTemporaryScaling();
        history.push({
          pathname: LocationService.getScalingLocation(buildingId, levelId, true)
        });
        openPopup(translate('mapAlerts.scaleEdge.success'), SUCCESSFUL);
      })
      .catch((err) => {
        throw err;
      });
  };

  const closeDistanceDialog = () => {
    resetScaling();
    history.push({
      pathname: LocationService.getScalingLocation(buildingId, levelId, true)
    });
    openPopup(translate('mapAlerts.scaleEdge.cancelledEdition'), ERROR);
  };

  return (
    <Dialog
      open={ifOpened === dialog.DISTANCE_DIALOG_OPEN}
      classes={{ paper: 'mapDialog' }}
      onClose={closeDistanceDialog}
    >
      <DialogTitle>{translate('map.distanceWarn')}</DialogTitle>
      <DialogContent>
        <DistanceForm
          initialValues={
            currentLevel.scaleDistance
              ? {
                  distance: currentLevel.scaleDistance
                }
              : {}
          }
          enableReinitialize
          translate={translate}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDistanceDialog}>{translate('map.cancel')}</Button>
        <Button hovercolor="#E4F3F6" onClick={saveDistance} disabled={!validateDistance(distance)} color="primary">
          {translate('map.save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

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

const selector = formValueSelector('ScaleInfo');

const mapStateToProps = (state) => {
  const form = state.form.ScaleInfo;
  return {
    currentLevel: state.activeLevelInfo.currentLevel,
    temporaryScaleEdge: state.activeLevelInfo.temporaryScaleEdge,
    distance: parseInt(selector(state, 'distance'), 10),
    isValid: form ? !form.syncErrors : false
  };
};

const mapDispatchToProps = {
  setMapStatus: setMapRenderedStatus,
  setLevel: setCurrentLevel,
  resetTemporaryScaling: resetTemporaryScaleEdge,
  resetScaling: resetScaleEdge,
  openPopup: addPopupMessageText
};

DistanceDialog.propTypes = {
  translate: PropTypes.func,
  distance: PropTypes.number,
  ifOpened: PropTypes.string,
  currentLevel: PropTypes.object.isRequired,
  temporaryScaleEdge: PropTypes.object,
  setLevel: PropTypes.func.isRequired,
  resetTemporaryScaling: PropTypes.func.isRequired,
  resetScaling: PropTypes.func.isRequired,
  openPopup: PropTypes.func.isRequired
};

export default withRouter(withLocalize(connect(mapStateToProps, mapDispatchToProps)(DistanceDialog)));
