import React from 'react';
import PropTypes from 'prop-types';

export const BeaconTooltip = (props) => {
  const { uuid } = props.marker;

  return (
    <>
      <div>
        <b>UUID:</b> {uuid}
      </div>
    </>
  );
};

BeaconTooltip.propTypes = {
  marker: PropTypes.shape(
    {
      uuid: PropTypes.string.isRequired
    }.isRequired
  )
};
