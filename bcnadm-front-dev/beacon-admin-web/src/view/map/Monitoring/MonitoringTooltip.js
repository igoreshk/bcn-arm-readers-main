import React from 'react';
import PropTypes from 'prop-types';
import { withLocalize } from 'react-localize-redux';

const rootStyle = {};

const headerStyle = {
  display: 'flex',
  alignItems: 'center'
};

const nameStyle = {
  marginLeft: '8px',
  fontSize: '15px',
  fontWeight: 'bold'
};

const vitalContainerStyle = {
  marginTop: '8px'
};

const vitalHeaderStyle = {
  fontWeight: 'bold'
};

const vitalDetailsStyle = {};

export const MonitoringTooltip = (props) => {
  const { marker, translate } = props;
  const visitorId = marker.visitorId;
  const name = marker.name || '';
  const heartRate = marker.heartRate
    ? `${marker.heartRate} ${translate('monitoringTooltip.bpm')}`
    : translate('monitoringTooltip.unknown');
  const bodyTemperature = marker.bodyTemperature
    ? `${marker.bodyTemperature} °C`
    : translate('monitoringTooltip.unknown');
  const stepCount = marker.stepCount
    ? `${marker.stepCount} ${translate('monitoringTooltip.steps')}`
    : translate('monitoringTooltip.unknown');

  return (
    <div style={rootStyle}>
      <div style={headerStyle}>
        <span style={nameStyle}>{name}</span>
        <span style={nameStyle}>{visitorId}</span>
      </div>
      <div style={vitalContainerStyle}>
        <div style={vitalHeaderStyle}>{translate('monitoringTooltip.vital')}</div>
        <div style={vitalDetailsStyle}>
          <div>
            {' '}
            {translate('monitoringTooltip.heart')} {heartRate}
          </div>
          <div>
            {' '}
            {translate('monitoringTooltip.body')} {bodyTemperature}
          </div>
          <div>
            {' '}
            {translate('monitoringTooltip.step')} {stepCount}
          </div>
        </div>
      </div>
    </div>
  );
};

MonitoringTooltip.propTypes = {
  translate: PropTypes.func,
  marker: PropTypes.object.isRequired
};

export default withLocalize(MonitoringTooltip);
