import React from 'react';
import PropTypes from 'prop-types';

export const ReaderTooltip = (props) => {
  const { entityId, uuid } = props.marker;

  return (
    <>
      <div>
        <b>entityId:</b> {entityId}
      </div>
      <div>
        <b>UUID:</b> {uuid}
      </div>
    </>
  );
};

ReaderTooltip.propTypes = {
  marker: PropTypes.shape(
    {
      id: PropTypes.string.isRequired,
      uuid: PropTypes.string.isRequired
    }.isRequired
  )
};
