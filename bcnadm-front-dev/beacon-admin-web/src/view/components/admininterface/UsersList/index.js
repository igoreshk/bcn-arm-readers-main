import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from 'src/view/components/ErrorFallback';

import AdminAppBarTitle from '../appbar/AdminAppBarTitle';
import CustomAppBar from '../appbar/CustomAppBar';
import UsersTable from '../UsersTable';

export const UsersList = ({ isLoading, location }) => {
  const userListStyle = isLoading
    ? {
        height: '100vh',
        overflow: 'hidden'
      }
    : {};

  // updated prop is sent to make users list updated after saving/editing
  return (
    <div style={userListStyle}>
      <CustomAppBar title={<AdminAppBarTitle />} />
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <UsersTable updated={location.updated} />
      </ErrorBoundary>
    </div>
  );
};

UsersList.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  location: PropTypes.shape({
    updated: PropTypes.bool
  }).isRequired
};

const mapStateToProps = (state) => ({
  isLoading: state.loading.processesFetching
});

export default connect(mapStateToProps)(UsersList);
