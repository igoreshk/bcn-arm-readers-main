import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withLocalize } from 'react-localize-redux';
import { withStyles } from '@material-ui/core';

import ClearDate from '@material-ui/icons/Clear';
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

import WatchersSelectField from 'src/view/components/watchers/WatchersSelectField';
import VisitorsSelectFieldMonitoring from 'view/components/visitors/VisitorsSelectFieldMonitoring';
import TimePicker from 'src/view/components/common/TimePicker';
import WatcherService from 'src/service/VisitorGroupsService';
import VisitorService from 'src/service/VisitorService';
import { MonitoringService } from 'src/service/MonitoringService';
import { SERVER_TIMEZONE_OFFSET_IN_MS } from 'src/config/MonitoringRefreshTimeout';
import { addPopupMessageText } from 'src/actions/popupMessage';
import { AreaService } from 'service/AreaService';
import { mapProviders } from 'view/map/MapConsts';

import { ERROR, SUCCESSFUL } from 'src/utils/popUpConsts';
import { updateComponentIfPropsChanged } from './helpers';
import ModeButtonGroup from '../../ModeButtonGroup';

import './monitoringHolder.scss';

const dateIconStyle = {
  fill: 'white',
  paddingLeft: 0
};

const styles = {
  input: {
    color: 'white',
    '&::placeholder': {
      color: 'white'
    }
  }
};

export class MonitoringHolder extends Component {
  constructor(props) {
    super(props);

    this.getCurrentTimeInSeconds = () => {
      const timeConverter = 60;
      const presentDay = new Date(Date.now());
      return (
        presentDay.getHours() * timeConverter * timeConverter +
        presentDay.getMinutes() * timeConverter +
        presentDay.getSeconds()
      );
    };

    this.state = {
      watchersList: [],
      selectedWatchersIds: [],
      listAllVisitors: [],
      visitorsList: [],
      selectedVisitorIds: [],
      startDate: null,
      endDate: null,
      time: this.getCurrentTimeInSeconds(),
      areasList: [],
      visitorIDs: [],
      loadedVisitors: null,
      loadingState: false
    };

    this.visitorMarkers = [];
    this.lockedMonitoring = false;
    this.isCurrentDay = true;
    this.isTheSameDay = false;
    this.shouldMonitoringUpdate = true;
  }

  async componentDidMount() {
    window.addEventListener('focus', this.unlock);
    window.addEventListener('blur', this.lock);
    await this.getWatchersList();
    this.shouldMonitoringUpdate = false;
    await this.getAllVisitors();
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (updateComponentIfPropsChanged(this.props, nextProps)) {
      return true;
    }

    if (this.shouldMonitoringUpdate) {
      return true;
    }

    // for re-render after selected watchers/visitors change
    if (
      this.state.selectedVisitorIds !== nextState.selectedVisitorIds ||
      nextState.selectedWatchersIds !== this.state.selectedWatchersIds ||
      this.state.visitorIDs !== nextState.visitorIDs
    ) {
      return true;
    }

    // for re-render after choosing date to monitor
    if (nextState.startDate !== this.state.startDate || nextState.endDate !== this.state.endDate) {
      return true;
    }

    // for re-render after changing time to monitor
    if (nextState.areasList !== this.state.areasList || nextState.loadedVisitors !== this.state.loadedVisitors) {
      return true;
    }

    // for re-render after choosing area to monitor
    return nextState.selectedAreaId !== this.state.selectedAreaId;
  }

  componentDidUpdate() {
    const { selectedMap, selectedMapProvider, match, addPopupMessageText: addPopupText, translate } = this.props;

    if (this.state.selectedWatchersIds.length === 0 || !this.state.selectedVisitorIds.length) {
      this.clearMarkersFromMap();
    }

    if (selectedMap && this.state.selectedVisitorIds.length) {
      if (this.state.startDate) {
        this.loadHistoryMarkers()
          .then((markers) => {
            if (!markers.length) {
              addPopupText(translate('monitoring.noHistoryDataMessage'), SUCCESSFUL);
              this.clearMarkersFromMap();
            }
            this.updateLoadMarkers(markers, selectedMapProvider, match);
          })
          .catch(() => {
            addPopupText(translate('monitoring.loadDataError'), ERROR);
          });
      }
    }
  }

  componentWillUnmount() {
    if (this.props.selectedMap) {
      this.clearMarkersFromMap();
    }

    window.removeEventListener('focus', this.unlock);
    window.removeEventListener('blur', this.lock);
  }

  async getWatchersList() {
    const watchers = await WatcherService.findAll();
    if (!this._calledComponentWillUnmount) {
      this.setState({ watchersList: watchers.filter((w) => w.visitorIds.length !== 0) });
    }
  }

  async getAllVisitors() {
    try {
      const visitors = await VisitorService.findAll();
      const listAllVisitors = visitors.map((visitor) => visitor);
      this.setState({ listAllVisitors });
    } catch (err) {
      console.error(err);
    }
  }

  getVisitors = (selectedWatchers) => {
    const { listAllVisitors } = this.state;
    const visitorsIds = [];
    selectedWatchers.forEach((watcher) => {
      visitorsIds.push(...watcher.visitorIds);
    });
    const visitorsList = listAllVisitors.filter((visitor) => visitorsIds.includes(visitor.entityId));
    this.setState({ visitorsList });
  };

  changeListVisitorIds = async (newSelectedVisitors) => {
    const selectedVisitorIds = newSelectedVisitors.map((visitor) => visitor.entityId);
    await this.setState({ selectedVisitorIds });
    if (this.state.startDate) {
      const markers = await this.loadHistoryMarkers();
      this.updateLoadMarkers(markers, this.props.selectedMapProvider, this.props.match);
    }
  };

  updateLoadMarkers(markers, mapProvider, map) {
    if (markers.length !== 0 && !this._calledComponentWillUnmount) {
      this.setMarkersOnMap(markers);
      this.clearMarkersFromMap();
      this.props.setListeners(markers, map, mapProvider);
      this.visitorMarkers = markers;
    }
  }

  lock = () => {
    this.lockedMonitoring = true;
  };

  unlock = () => {
    this.lockedMonitoring = false;
  };

  dateToISOString = (date) => {
    const begin = 0;
    const end = -5;
    return date.toISOString().replace('T', ' ').slice(begin, end);
  };

  loadHistoryMarkersByArea = async (startDateQueryParam, endDateQueryParam, shapeName) => {
    const areasLevel = await AreaService.findAll(this.props.match.params.level);
    if (areasLevel.length !== 0) {
      const areaID = areasLevel.map((area) => area.entityId);
      const visitors = areaID.map(() =>
        MonitoringService.getHistoryByArea(shapeName, startDateQueryParam, endDateQueryParam)
      );
      const loadedVisitors = (await Promise.all(visitors)).flat();
      if (loadedVisitors.length === 0) {
        this.setState({ loadingState: true });
      } else {
        this.setState({ loadingState: false });
      }
      this.setState({ loadedVisitors });
    }
  };

  async loadHistoryMarkers() {
    const { transformer, selectedMapProvider } = this.props;
    const { selectedVisitorIds } = this.state;
    const startDateQueryParam = this.state.startDate !== null ? this.dateToISOString(this.state.startDate) : null;
    const endDateQueryParam = this.state.endDate !== null ? this.dateToISOString(this.state.endDate) : null;
    const visitorIDs = selectedVisitorIds;
    this.setState({ visitorIDs });
    if (visitorIDs.length !== 0) {
      const promises = visitorIDs.map((visitorId) =>
        MonitoringService.getVisitorHistory(visitorId, startDateQueryParam, endDateQueryParam)
      );
      const visitorsInfo = await Promise.all(promises);
      return visitorsInfo
        .flat()
        .filter((info) => info !== null)
        .map((visitor) => transformer(visitor, selectedMapProvider));
    }
    return [];
  }

  async loadLastMarkers() {
    const { match, transformer, selectedMapProvider } = this.props;
    const levelId = match.params.level;
    const { selectedWatchersIds } = this.state;

    const promises = selectedWatchersIds.map((visitorGroupId) =>
      MonitoringService.getLastMarkers(visitorGroupId, levelId)
    );
    const lastMarkersInfo = await Promise.all(promises);

    return lastMarkersInfo
      .flat()
      .filter((info) => info !== null)
      .map((visitor) => transformer(visitor, selectedMapProvider));
  }

  setMarkersOnMap(markers) {
    const { selectedVisitorIds, startDate, endDate } = this.state;
    if (!startDate && !endDate) {
      this.setLastMarkersOnMap(markers);
      return;
    }
    if (selectedVisitorIds) {
      this.setSelectedVisitorMarkersOnMap(markers);
    }
  }

  setSelectedVisitorMarkersOnMap = (markers) => {
    const { selectedMap, markerHandler } = this.props;
    markers.forEach((marker) => markerHandler.setMarkerOnMap(marker, selectedMap));
  };

  setLastMarkersOnMap = (markers) => {
    const { selectedMap, markerHandler } = this.props;
    markers.forEach((marker) => {
      markerHandler.setMarkerOnMap(marker, selectedMap);
    });
  };

  smoothMotion = (mapProvider, marker, prevPosition, newPosition) => {
    let count = 0;
    const delta = 100;
    let positionLat = prevPosition.latitude;
    let positionLng = prevPosition.longitude;
    const deltaLat = (newPosition.latitude - prevPosition.latitude) / delta;
    const deltaLng = (newPosition.longitude - prevPosition.longitude) / delta;

    function move() {
      count++;
      positionLat += deltaLat;
      positionLng += deltaLng;

      marker.setPosition(new mapProvider.maps.LatLng(positionLat, positionLng));

      if (count < delta) {
        setTimeout(() => {
          move();
        }, 0);
      }
    }

    move();
  };

  selectWatchersIds = (selectedWatchers) => {
    const selectedWatchersIds = selectedWatchers.map((value) => value.entityId);
    this.setState({ selectedWatchersIds });
    this.getVisitors(selectedWatchers);
  };

  clearMarkersFromMap = () => {
    const { selectedMap } = this.props;

    if (this.visitorMarkers.length !== 0) {
      this.visitorMarkers.forEach((marker) => this.props.markerHandler.removeMarkerFromMap(marker, selectedMap));
    }
  };

  checkIsCurrentDay = (date) => {
    const currentDay = new Date(Date.now());
    if (
      date.getFullYear() === currentDay.getFullYear() &&
      date.getMonth() === currentDay.getMonth() &&
      date.getDate() === currentDay.getDate()
    ) {
      return true;
    }
    return false;
  };

  checkIsTheSameDay = (date) => {
    if (
      this.state.startDate &&
      this.state.startDate.getFullYear() === date.getFullYear() &&
      this.state.startDate.getMonth() === date.getMonth() &&
      this.state.startDate.getDate() === date.getDate()
    ) {
      this.isTheSameDay = true;
      return;
    }
    this.isTheSameDay = false;
    return;
  };

  setStartDate = (date) => {
    this.setState({ startDate: date, time: this.getCurrentTimeInSeconds() });
  };

  setEndDate = (date) => {
    this.isCurrentDay = this.checkIsCurrentDay(date);
    this.setState({ endDate: date, time: this.getCurrentTimeInSeconds() });
    this.checkIsTheSameDay(date);
  };

  clearDateField = () => {
    this.setState({ startDate: null, endDate: null });
  };

  handleLoadLastMarkers = async () => {
    const { selectedMapProvider, match, addPopupMessageText: addPopupText, translate } = this.props;
    const markers = await this.loadLastMarkers();
    if (!markers.length) {
      addPopupText(translate('monitoring.noCurrentDataMessage'), SUCCESSFUL);
      this.clearMarkersFromMap();
    }
    this.updateLoadMarkers(markers, selectedMapProvider, match);
  };

  disableFutureDays = (date) => {
    return date.getTime() > Date.now();
  };

  setTime = (time) => {
    this.setState({ time });
  };

  getMonitoringTimeInMilliseconds = () => {
    if (this.state.startDate) {
      return Date.parse(this.state.startDate);
    } else if (this.state.endDate) {
      return Date.parse(this.state.endDate);
    }
    return null;
  };

  getStartDateQueryParam = () => {
    const queryStartDate = new Date(this.getMonitoringTimeInMilliseconds() + SERVER_TIMEZONE_OFFSET_IN_MS);
    return this.dateToISOString(queryStartDate);
  };

  render() {
    const { translate, classes, selectedMapProviderName } = this.props;
    const { watchersList, visitorsList, loadingState, loadedVisitors } = this.state;
    const todayInMs = new Date().getTime();
    const dayLength = 86400;
    const periodToGetMonitoringHistory = 13;
    const multiplier = 1000;
    const map = document.getElementById(selectedMapProviderName === mapProviders.GOOGLE ? 'map' : 'OSMap');
    const visitorsGetter = (shapeName) => {
      const startDateQueryParam = this.state.startDate !== null ? this.dateToISOString(this.state.startDate) : null;
      const endDateQueryParam = this.state.endDate !== null ? this.dateToISOString(this.state.endDate) : null;

      if (startDateQueryParam !== null && shapeName) {
        return this.loadHistoryMarkersByArea(startDateQueryParam, endDateQueryParam, shapeName);
      }
    };

    map?.addEventListener('click', (evt) => {
      evt.stopImmediatePropagation();
      evt.target.value && visitorsGetter(evt.target.value);
    });

    if (!this.props.isMapRendered) {
      return null;
    }
    return (
      <div className="monitoringHolder">
        <div className="actions">
          <div className="firstGroup">
            <span className="levelNumber">
              {translate('building.level', {
                value: this.props.levelNumber
              })}
            </span>

            <ModeButtonGroup />
          </div>
          {loadingState === true ? (
            <div className="loaded-visitors">
              <div>{translate('monitoring.noVisitors')}</div>
            </div>
          ) : (
            loadedVisitors?.map((visitor) => (
              <div className="loaded-visitors" key={visitor.entityId}>
                {translate('monitoring.visitorName')}: {visitor.name}
                <div>
                  {' '}
                  {translate('monitoring.visitorID')}: {visitor.entityId}
                </div>
              </div>
            ))
          )}
          <div className="secondGroup">
            <WatchersSelectField
              watchers={watchersList}
              selectWatchersIds={this.selectWatchersIds}
              translate={translate}
            />
            <VisitorsSelectFieldMonitoring
              visitors={visitorsList}
              changeListVisitorIds={this.changeListVisitorIds}
              translate={translate}
            />
            <div className={'startEndDatePiker'}>
              <div className="datePickerContainer startDateContainer">
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <DateTimePicker
                    showTodayButton
                    placeholder={translate('monitoring.datePickerLabel')}
                    value={this.state.startDate === null ? undefined : this.state.startDate.toLocaleString('en-US')}
                    onChange={(value) => this.setStartDate(value)}
                    shouldDisableDate={this.disableFutureDays}
                    className="datePicker"
                    mode="landscape"
                    label={translate('monitoring.chooseStartDate')}
                    minDate={todayInMs - dayLength * periodToGetMonitoringHistory * multiplier}
                    maxDate={this.state.endDate}
                    InputProps={{
                      className: classes.input,
                      disableUnderline: true
                    }}
                  />
                </MuiPickersUtilsProvider>
              </div>
              <div className="datePickerContainer">
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <DateTimePicker
                    showTodayButton
                    placeholder={translate('monitoring.datePickerLabel')}
                    value={
                      this.state.endDate === null ? undefined : new Date(this.state.endDate.toLocaleString('en-US'))
                    }
                    onChange={(value) => {
                      this.setEndDate(value);
                    }}
                    shouldDisableDate={this.disableFutureDays}
                    className="datePicker"
                    mode="landscape"
                    disabled={this.state.startDate === null}
                    label={translate('monitoring.chooseEndDate')}
                    minDate={this.state.startDate}
                    InputProps={{
                      className: classes.input,
                      disableUnderline: true
                    }}
                  />
                </MuiPickersUtilsProvider>
                {(this.state.startDate || this.state.endDate) && (
                  <ClearDate onClick={this.clearDateField} style={dateIconStyle} />
                )}
              </div>
              <div>
                <button
                  type="button"
                  disabled={this.state.selectedWatchersIds.length === 0 || this.state.startDate}
                  onClick={this.handleLoadLastMarkers}
                  className="lastHistoryButton"
                >
                  {'Last Visitor Position'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {this.state.startDate && (
          <TimePicker
            time={this.state.time}
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            setTime={this.setTime}
            isTheSameDay={this.isTheSameDay}
            getCurrentTimeInSeconds={this.getCurrentTimeInSeconds}
            transformer={this.props.transformer}
            selectedMapProvider={this.props.selectedMapProvider}
            visitorIDs={this.state.visitorIDs}
            translate={this.props.translate}
            selectedVisitorIds={this.state.selectedVisitorIds}
            match={this.props.match}
            markerHandler={this.props.markerHandler}
            selectedMap={this.props.selectedMap}
            setListeners={this.props.setListeners}
            clearMarkersFromMap={this.clearMarkersFromMap}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    selectedMap: state.mapSettings.selectedMap,
    selectedMapProvider: state.mapSettings.selectedMapProvider,
    isMapRendered: state.mapSettings.isMapRendered,
    levelNumber: state.activeLevelInfo.currentLevel.number
  };
};

const mapDispatchToProps = {
  addPopupMessageText
};

MonitoringHolder.propTypes = {
  selectedMap: PropTypes.object,
  selectedMapProvider: PropTypes.object,
  markerHandler: PropTypes.object,
  translate: PropTypes.func,
  transformer: PropTypes.func,
  levelNumber: PropTypes.number,
  setListeners: PropTypes.func,
  match: PropTypes.object,
  isMapRendered: PropTypes.bool,
  addPopupMessageText: PropTypes.func
};

export default withStyles(styles)(
  withRouter(connect(mapStateToProps, mapDispatchToProps)(withLocalize(MonitoringHolder)))
);
