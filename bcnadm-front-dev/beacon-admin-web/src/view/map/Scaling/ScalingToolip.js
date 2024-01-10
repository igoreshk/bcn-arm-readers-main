import React from 'react';
import PropTypes from 'prop-types';

export const ScalingTooltip = ({ distance, translate }) => {
  return (
    <>
      <b>{translate('map.distance')}:</b> {distance}
    </>
  );
};

ScalingTooltip.propTypes = {
  distance: PropTypes.number,
  translate: PropTypes.func.isRequired
};
