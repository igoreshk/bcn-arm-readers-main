import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { MdWifiTethering as Beacon } from 'react-icons/md';
import Marker from '@material-ui/icons/Place';
import Scale from '@material-ui/icons/LinearScale';
import Route from '@material-ui/icons/SwapCalls';
import Monitoring from '@material-ui/icons/People';
import { withRouter } from 'react-router-dom';
import { withLocalize } from 'react-localize-redux';
import { LocationService } from 'src/utils/LocationService';
import { PhotoAlbum } from '@material-ui/icons';
import PropTypes from 'prop-types';
import { modes } from '../MapConsts';
import ModeButton, { buttonType } from '../ModeButton';

import './modeButtonGroup.scss';

export const ModeButtonGroup = ({
  translate,
  history,
  scaleDistance,
  match: {
    params: { building: buildingId, level: levelId, layer: currentMode, edit: editMode }
  }
}) => {
  useEffect(() => {
    if (!scaleDistance && !isScaleEditUrl()) {
      history.push(LocationService.getScalingLocation(buildingId, levelId, true));
    }
  });

  function isScaleEditUrl() {
    return currentMode === modes.SCALE_MODE && editMode;
  }

  const setClassName = (isActive) => (isActive ? 'activeButtonIcon' : 'inactiveButtonIcon');

  return (
    <div className="modeButtonGroup">
      <div className="firstModeButtonGroup">
        <ModeButton
          icon={<Marker className={setClassName(currentMode === modes.AREAS_MODE)} />}
          link={modes.AREAS_MODE}
          active={currentMode === modes.AREAS_MODE}
          tooltip={translate('operator.areas')}
          buttonId={modes.AREAS_MODE}
          buttonType={buttonType.MODE}
          // Button should be disabled until the functionality responsible for areas appears
          // https://jirapct.epam.com/jira/browse/EPMLSTRBCN-2727
          disabled
        />
        <ModeButton
          icon={<Route className={setClassName(currentMode === modes.ROUTE_MODE)} />}
          link={modes.ROUTE_MODE}
          active={currentMode === modes.ROUTE_MODE}
          tooltip={translate('operator.routes')}
          buttonId={modes.ROUTE_MODE}
          buttonType={buttonType.MODE}
          disabled={!scaleDistance}
        />
        <ModeButton
          icon={<Beacon className={setClassName(currentMode === modes.BEACON_MODE)} />}
          link={modes.BEACON_MODE}
          active={currentMode === modes.BEACON_MODE}
          tooltip={translate('operator.beacons')}
          buttonId={modes.BEACON_MODE}
          buttonType={buttonType.MODE}
          disabled={!scaleDistance}
        />
        <ModeButton
          icon={<Beacon className={setClassName(currentMode === modes.READER_MODE)} />}
          link={modes.READER_MODE}
          active={currentMode === modes.READER_MODE}
          tooltip={translate('operator.readers')}
          buttonId={modes.READER_MODE}
          buttonType={buttonType.MODE}
          disabled={!scaleDistance}
        />
      </div>
      <div className="secondModeButtonGroup">
        <ModeButton
          icon={<Scale className={setClassName(currentMode === modes.SCALE_MODE)} />}
          link={modes.SCALE_MODE}
          active={currentMode === modes.SCALE_MODE}
          tooltip={translate('operator.scale')}
          buttonId={modes.SCALE_MODE}
          buttonType={buttonType.MODE}
        />
        <ModeButton
          icon={<Monitoring className={setClassName(currentMode === modes.MONITORING_MODE)} />}
          link={modes.MONITORING_MODE}
          active={currentMode === modes.MONITORING_MODE}
          tooltip={translate('operator.monitoring')}
          buttonId={modes.MONITORING_MODE}
          buttonType={buttonType.MODE}
          disabled={!scaleDistance}
        />
        <ModeButton
          icon={<PhotoAlbum className={setClassName(currentMode === modes.DRAWING_MODE)} />}
          link={modes.DRAWING_MODE}
          active={currentMode === modes.DRAWING_MODE}
          tooltip={translate('operator.drawing')}
          buttonId={modes.DRAWING_MODE}
          buttonType={buttonType.MODE}
          disabled={!scaleDistance}
        />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  scaleDistance: state.activeLevelInfo.currentLevel.scaleDistance
});

ModeButtonGroup.propTypes = {
  scaleDistance: PropTypes.number,
  translate: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      layer: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  history: PropTypes.object
};

export default withRouter(connect(mapStateToProps)(withLocalize(ModeButtonGroup)));
