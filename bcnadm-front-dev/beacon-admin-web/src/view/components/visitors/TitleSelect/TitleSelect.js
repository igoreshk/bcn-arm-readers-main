import React from 'react';
import PropTypes from 'prop-types';
import {
  checkNumberVisitorsZero,
  checkNumberVisitorsOne,
  checkNumberMoreTwentyEndsOne,
  checkNumberEndsTwoThreeFour
} from './helpers';

const TitleSelect = ({ listOfVisitors, translate }) => {
  if (checkNumberVisitorsZero(listOfVisitors)) {
    return <span className="placeholder">{translate('monitoring.selectVisitors')}</span>;
  }

  if (checkNumberVisitorsOne(listOfVisitors)) {
    return <span className="placeholder">{listOfVisitors[0].name}</span>;
  }

  if (checkNumberMoreTwentyEndsOne(listOfVisitors)) {
    return (
      <span className="placeholder">
        {translate('monitoring.numberOfSelectedVisitorsFirstVariant', {
          number: listOfVisitors.length
        })}
      </span>
    );
  }

  if (checkNumberEndsTwoThreeFour(listOfVisitors)) {
    return (
      <span className="placeholder">
        {translate('monitoring.numberOfSelectedVisitorsSecondVariant', {
          number: listOfVisitors.length
        })}
      </span>
    );
  }

  return (
    <span className="placeholder">
      {translate('monitoring.numberOfSelectedVisitorsThirdVariant', {
        number: listOfVisitors.length
      })}
    </span>
  );
};

TitleSelect.propTypes = {
  listOfVisitors: PropTypes.arrayOf(PropTypes.object).isRequired,
  translate: PropTypes.func.isRequired
};

export default TitleSelect;
