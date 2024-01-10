import React from 'react';
import { withLocalize } from 'react-localize-redux';
import PropTypes from 'prop-types';

import './buildingSizeLegend.scss';

const DIGITS = 2;

export function BuildingSizeLegend({ width, height, translate }) {
  return (
    <span className="buidingSize">
      {translate('map.buidingSize', {
        value1: width.toFixed(DIGITS),
        value2: height.toFixed(DIGITS)
      })}
    </span>
  );
}

BuildingSizeLegend.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  translate: PropTypes.func.isRequired
};

export default withLocalize(BuildingSizeLegend);
