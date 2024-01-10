import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from 'src/view/components/ErrorFallback';

import CustomAppBar from '../../../admininterface/appbar/CustomAppBar';
import BuildingsListAppBar from '../../../admininterface/appbar/BuildingsListAppBar';
import BuildingsTableContainer from '../BuildingsTableContainer';

export const BuildingsList = ({ isLoading, location }) => {
  const buildingsListStyle = isLoading
    ? {
        height: '100vh',
        overflow: 'hidden'
      }
    : {};

  return (
    <div style={buildingsListStyle}>
      <CustomAppBar title={<BuildingsListAppBar />} />
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <BuildingsTableContainer updated={location.updated} />
      </ErrorBoundary>
    </div>
  );
};

BuildingsList.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  location: PropTypes.shape({
    updated: PropTypes.bool
  }).isRequired
};

const mapStateToProps = (state) => ({
  isLoading: state.loading.processesFetching
});

export default connect(mapStateToProps)(BuildingsList);
