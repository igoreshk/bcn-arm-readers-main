import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from 'src/view/components/ErrorFallback';

import CustomAppBar from '../admininterface/appbar/CustomAppBar';
import WatchersTitle from './WatchersTitle';
import WatchersTable from './WatchersTable';

const WatchersList = (props) => {
  const watchersListStyle = props.isLoading
    ? {
        height: '100vh',
        overflow: 'hidden'
      }
    : {};
  return (
    <div style={watchersListStyle}>
      <CustomAppBar title={<WatchersTitle />} />
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <WatchersTable updated={props.location.updated} />
      </ErrorBoundary>
    </div>
  );
};

WatchersList.propTypes = {
  location: PropTypes.shape(
    {
      updated: PropTypes.bool
    }.isRequired
  ),
  isLoading: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
  isLoading: state.loading.processesFetching
});

export default connect(mapStateToProps)(WatchersList);
