import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from 'src/view/components/ErrorFallback';

import CustomAppBar from '../../admininterface/appbar/CustomAppBar';
import VisitorsTitle from '../VisitorsTitle';
import VisitorsTable from '../VisitorsTable';
import './visitorsList.scss';

export const VisitorsList = (props) => {
  // updated prop is sent to make visitors list updated after saving/editing
  return (
    <div className={props.isLoading ? 'visitorsList' : ''}>
      <CustomAppBar title={<VisitorsTitle />} />
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <VisitorsTable updated={props.location.updated} />
      </ErrorBoundary>
    </div>
  );
};

VisitorsList.propTypes = {
  location: PropTypes.shape(
    {
      updated: PropTypes.bool
    }.isRequired
  ),
  isLoading: PropTypes.bool
};

const mapStateToProps = (state) => ({
  isLoading: state.loading.processesFetching
});

export default connect(mapStateToProps)(VisitorsList);
