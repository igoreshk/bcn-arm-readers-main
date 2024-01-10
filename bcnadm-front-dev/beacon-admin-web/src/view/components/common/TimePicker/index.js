import React, { Component } from 'react';
import { Slider } from '@material-ui/core';
import './timePicker.scss';
import PropTypes from 'prop-types';
import { MonitoringService } from 'service/MonitoringService';
import { addPopupMessageText } from 'src/actions/popupMessage';
import { SUCCESSFUL, ERROR } from 'src/utils/popUpConsts';
import {
  marks,
  changeMarksLength,
  changeDateView,
  getTranslate,
  checkIsCurrentDay,
  dateToISOString,
  dateToZeroTime
} from './helpers';

export default class TimePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      slider: this.props.time,
      startDateOfSlider: new Date(Number(this.props.startDate)).toString(),
      endDateOfSlider: null,
      currentDateToMonitor: new Date(Number(this.props.startDate)),
      numberOfVisitors: [],
      visitorMarkers: []
    };

    this.isSliderMove = false;
    this.didSliderMove = false;
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.slider !== nextState.slider) {
      return true;
    }
    // for re-render after choosing startDate to monitor
    if (nextProps.startDate !== this.props.startDate) {
      return true;
    }
    // for re-render after choosing endDate to monitor
    if (nextProps.endDate !== this.props.endDate) {
      return true;
    }
    // for re-render after shifting to another date to monitor
    if (
      this.state.startDateOfSlider !== nextState.startDateOfSlider ||
      this.state.endDateOfSlider !== nextState.endDateOfSlider ||
      this.state.currentDateToMonitor !== nextState.currentDateToMonitor
    ) {
      return true;
    }
    // for re-render after choosing other watchers/visitors
    if (nextProps.selectedVisitorIds !== this.props.selectedVisitorIds) {
      return true;
    }
    // for re-render after the number of visitors changed
    if (this.state.numberOfVisitors !== nextState.numberOfVisitors) {
      return true;
    }
    return false;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.time !== this.props.time && !this.isSliderMove) {
      this.setState({ slider: this.props.time });
    }
    if (prevProps.startDate !== this.props.startDate || prevProps.endDate !== this.props.endDate) {
      this.setState({ startDateOfSlider: new Date(this.props.startDate.getTime()).toString() });
      this.setState({ endDateOfSlider: this.getNextDate(new Date(Number(this.props.startDate))).toString() });
      this.setState({ currentDateToMonitor: new Date(this.props.startDate.getTime()) });
    }
    if (this.props.startDate && this.didSliderMove && this.props.selectedVisitorIds.length) {
      this.loadHistoryMarkers()
        .then((markers) => {
          if (!markers.length) {
            addPopupMessageText(this.props.translate('monitoring.noHistoryDataMessage'), SUCCESSFUL);
            this.clearMarkersFromMap();
          }
          this.updateLoadMarkers(markers, this.props.selectedMapProvider, this.props.match);
          this.didSliderMove = false;
        })
        .catch(() => {
          addPopupMessageText(this.props.translate('monitoring.loadDataError'), ERROR);
        });
    }
  }
  componentWillUnmount() {
    if (this.props.selectedMap) {
      this.clearMarkersFromMap();
    }
  }

  clearMarkersFromMap = () => {
    const { selectedMap, markerHandler } = this.props;

    if (this.state.visitorMarkers.length !== 0) {
      this.state.visitorMarkers.forEach((marker) => markerHandler.removeMarkerFromMap(marker, selectedMap));
    }
    this.props.clearMarkersFromMap();
  };

  setMarkersOnMap(markers) {
    const { selectedVisitorIds } = this.props;
    if (selectedVisitorIds) {
      this.setSelectedVisitorMarkersOnMap(markers);
    }
  }

  setSelectedVisitorMarkersOnMap = (markers) => {
    markers.forEach((marker) => this.props.markerHandler.setMarkerOnMap(marker, this.props.selectedMap));
  };

  updateLoadMarkers(markers, mapProvider, map) {
    if (markers.length !== 0) {
      this.clearMarkersFromMap();
      this.setMarkersOnMap(markers);
      this.props.setListeners(markers, map, mapProvider);
      this.setState({ visitorMarkers: markers });
    }
  }

  async loadHistoryMarkers() {
    const multiplier = 1000;
    const { transformer, selectedMapProvider } = this.props;
    const { currentDateToMonitor, slider } = this.state;
    const startDateQueryParam = dateToISOString(new Date(dateToZeroTime(currentDateToMonitor)));
    const endDateQueryParam = dateToISOString(
      new Date(dateToZeroTime(currentDateToMonitor).getTime() + slider * multiplier)
    );
    if (this.props.selectedVisitorIds.length !== 0) {
      const promises = this.props.selectedVisitorIds.map((visitorId) =>
        MonitoringService.getVisitorHistory(visitorId, startDateQueryParam, endDateQueryParam)
      );
      const visitorsInfo = await Promise.all(promises);
      const visitorNumber = [];
      const historyMarkers = visitorsInfo
        .flat()
        .filter((info) => info !== null)
        .map((visitor) => {
          visitorNumber.push(visitor.deviceId);
          return transformer(visitor, selectedMapProvider);
        });
      const numberOfVisitors = [...new Set(visitorNumber)];
      this.setState({ numberOfVisitors: numberOfVisitors.length });
      return historyMarkers;
    }
    return [];
  }

  getPreviousToMonitorDate = () => {
    const { currentDateToMonitor } = this.state;
    const { startDate, isTheSameDay } = this.props;
    const date = new Date(Number(currentDateToMonitor));
    const previousDayToMonitor = new Date(date.setDate(date.getDate() - 1));
    const date2 = new Date(Number(currentDateToMonitor));
    const nextDayToMonitor = new Date(date2.setDate(date2.getDate() + 1));
    const minDate = new Date(Number(startDate));
    if (
      !isTheSameDay &&
      previousDayToMonitor.getTime() >= minDate.getTime() &&
      currentDateToMonitor.getTime() !== startDate.getTime()
    ) {
      this.setState({
        startDateOfSlider: new Date(previousDayToMonitor).toString(),
        endDateOfSlider: new Date(nextDayToMonitor).toString()
      });
      return;
    } else if (isTheSameDay) {
      this.setState({
        startDateOfSlider: currentDateToMonitor.toString(),
        endDateOfSlider: currentDateToMonitor.toString()
      });
      return;
    } else if (this.props.endDate && this.props.endDate.getDate() === nextDayToMonitor.getDate()) {
      this.setState({
        startDateOfSlider: new Date(startDate).toString(),
        endDateOfSlider: nextDayToMonitor.toString()
      });
      return;
    }
    nextDayToMonitor.setDate(nextDayToMonitor.getDate() + 1);
    this.setState({
      startDateOfSlider: currentDateToMonitor.toString(),
      endDateOfSlider: new Date(nextDayToMonitor).toString()
    });
    return;
  };

  getNextToMonitorDate = () => {
    const { currentDateToMonitor } = this.state;
    const { endDate, startDate, isTheSameDay } = this.props;
    const date = new Date(Number(currentDateToMonitor));
    const nextDayToMonitor = date.setDate(date.getDate() + 1);
    const date2 = new Date(Number(currentDateToMonitor));
    const previousDayToMonitor = new Date(date2.setDate(date2.getDate() - 1));
    let maxDate = new Date(Number(endDate));
    if (endDate === null) {
      maxDate = new Date();
    }
    if (
      !isTheSameDay &&
      maxDate.getTime() >= nextDayToMonitor &&
      currentDateToMonitor.getTime() !== maxDate.getTime()
    ) {
      this.setState({
        startDateOfSlider: new Date(previousDayToMonitor).toString(),
        endDateOfSlider: new Date(nextDayToMonitor).toString()
      });
      return;
    } else if (isTheSameDay) {
      this.setState({
        startDateOfSlider: currentDateToMonitor.toString(),
        endDateOfSlider: currentDateToMonitor.toString()
      });
      return;
    } else if (startDate.getTime() < previousDayToMonitor.getTime()) {
      this.setState({
        startDateOfSlider: previousDayToMonitor.toString(),
        endDateOfSlider: currentDateToMonitor.toString()
      });
      return;
    }
  };

  valuetext = (value) => {
    const multiplier = 60;
    return value / multiplier;
  };

  handleDragStart = () => {
    this.isSliderMove = true;
  };

  handleDragStop = () => {
    this.isSliderMove = false;
    this.props.setTime(this.state.slider);
  };

  handleSlider = async (event, value) => {
    this.didSliderMove = true;
    await this.setState({ slider: value });
  };

  onSubmitPrev = async () => {
    const { currentDateToMonitor } = this.state;
    const { startDate } = this.props;
    this.didSliderMove = true;
    const prevState = new Date(Number(currentDateToMonitor));
    prevState.setDate(prevState.getDate() - 1);
    if (
      currentDateToMonitor.getDate() !== startDate.getDate() &&
      currentDateToMonitor.getTime() >= startDate.getTime()
    ) {
      await this.setState({ currentDateToMonitor: new Date(prevState) });
    }
    this.getPreviousToMonitorDate();
  };

  onSubmitNext = async () => {
    const { currentDateToMonitor } = this.state;
    this.didSliderMove = true;
    const prevState = new Date(Number(currentDateToMonitor));
    const prevStatePlusOneDy = new Date(prevState.setDate(prevState.getDate() + 1));
    let maxDate = new Date(Number(this.props.endDate));
    if (this.props.endDate === null) {
      maxDate = new Date();
    }
    if (currentDateToMonitor.getTime() !== maxDate.getTime() && prevStatePlusOneDy.getTime() <= maxDate.getTime()) {
      await this.setState({ currentDateToMonitor: prevStatePlusOneDy });
    }
    this.getNextToMonitorDate();
  };

  getNextDate = (date) => {
    if (this.props.isTheSameDay || checkIsCurrentDay(date)) {
      return date;
    }
    return new Date(date.setDate(date.getDate() + 1));
  };

  valueLabelFormat = (value) => {
    const { translate } = this.props;
    const { numberOfVisitors, currentDateToMonitor } = this.state;
    const multiplier = 60;
    const index = 2;
    const hours = Math.floor(value / multiplier / multiplier);
    const minutes = Math.floor(value / multiplier) - hours * multiplier;
    const seconds = value % multiplier;
    const formatted = [
      hours.toString().padStart(index, '0'),
      minutes.toString().padStart(index, '0'),
      seconds.toString().padStart(index, '0')
    ].join(':');
    const date = new Date(Number(currentDateToMonitor));
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return (
      <p>
        <b>{date.toLocaleDateString('en-US', options)}</b>
        <br />
        {formatted}
        <br />
        {numberOfVisitors.length !== 0
          ? `${numberOfVisitors} ${getTranslate(this.props.selectedVisitorIds, translate)}`
          : getTranslate(this.props.selectedVisitorIds, translate)}
      </p>
    );
  };

  render() {
    const dayLength = 86400;
    const { startDateOfSlider, endDateOfSlider, currentDateToMonitor, slider } = this.state;
    const { startDate, getCurrentTimeInSeconds } = this.props;

    return (
      <div className="timePicker">
        <div className={'nextPreviousDay'}>
          <div className={'dayChoose'}>
            <div className={'timePickerArrow leftArrow'} onClick={this.onSubmitPrev} />
            <div className={'timePickerButton'}>{changeDateView(startDateOfSlider)}</div>
          </div>
          <div className={'dayChoose'}>
            <div className={'timePickerButton'}>
              {endDateOfSlider !== null
                ? changeDateView(endDateOfSlider)
                : changeDateView(this.getNextDate(new Date(Number(startDate))).toString())}
            </div>
            <div className={'timePickerArrow'} onClick={this.onSubmitNext} />
          </div>
        </div>
        <Slider
          min={0}
          max={checkIsCurrentDay(currentDateToMonitor) ? getCurrentTimeInSeconds() : dayLength}
          getAriaValueText={this.valuetext}
          step={1}
          marks={checkIsCurrentDay(currentDateToMonitor) ? changeMarksLength(marks) : marks}
          value={slider}
          onChange={this.handleSlider}
          onDragStart={this.handleDragStart}
          onDragEnd={this.handleDragStop}
          valueLabelDisplay={'auto'}
          valueLabelFormat={this.valueLabelFormat}
        />
      </div>
    );
  }
}

TimePicker.propTypes = {
  time: PropTypes.number,
  setTime: PropTypes.func,
  translate: PropTypes.func,
  getCurrentTimeInSeconds: PropTypes.func,
  startDate: PropTypes.object,
  endDate: PropTypes.object,
  isTheSameDay: PropTypes.bool,
  transformer: PropTypes.func,
  selectedMapProvider: PropTypes.object,
  selectedMap: PropTypes.object,
  markerHandler: PropTypes.object,
  setListeners: PropTypes.func,
  selectedVisitorIds: PropTypes.arrayOf(PropTypes.string),
  match: PropTypes.object,
  clearMarkersFromMap: PropTypes.func
};
