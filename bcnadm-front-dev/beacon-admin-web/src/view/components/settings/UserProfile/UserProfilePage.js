import React from 'react';
import { connect } from 'react-redux';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from 'src/view/components/ErrorFallback';

import PropTypes from 'prop-types';
import CustomAppBar from '../../admininterface/appbar/CustomAppBar';
import { UserProfileRouter } from './UserProfileRouter';

const UserProfilePage = (props) => {
  const userProfilePageStyle = props.isLoading
    ? {
        height: '100vh',
        overflow: 'hidden'
      }
    : {};

  return (
    <div style={userProfilePageStyle}>
      <CustomAppBar />
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <UserProfileRouter />
      </ErrorBoundary>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    isLoading: state.loading.processesFetching
  };
};

UserProfilePage.propTypes = {
  isLoading: PropTypes.bool
};

export default connect(mapStateToProps)(UserProfilePage);
