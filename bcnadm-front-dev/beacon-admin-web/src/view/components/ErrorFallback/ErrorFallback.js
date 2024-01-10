import React from 'react';
import PropTypes from 'prop-types';
import './ErrorFallback.scss';
import { withLocalize } from 'react-localize-redux';

function ErrorFallback({ translate, resetErrorBoundary }) {
  return (
    <div role="alert" className="errorFallback">
      <p>{translate('errorBoundary.notification')}</p>
      <button className="repeatButton" type="button" onClick={resetErrorBoundary}>
        {translate('errorBoundary.repeatButton')}
      </button>
    </div>
  );
}

ErrorFallback.propTypes = {
  resetErrorBoundary: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired
};

export default withLocalize(ErrorFallback);
