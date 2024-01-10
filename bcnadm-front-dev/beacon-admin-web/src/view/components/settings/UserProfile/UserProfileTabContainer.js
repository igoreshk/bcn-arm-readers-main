import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Tabs, Tab } from '@material-ui/core';
import { withLocalize } from 'react-localize-redux';
import PropTypes from 'prop-types';
import { UserProfileDetailsRouter } from './UserProfileDetailsRouter';

class UserProfileTabContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value
    };
  }

  handleChangeTab = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { value } = this.state;

    return (
      <>
        <Tabs
          value={this.state.value}
          onChange={this.handleChangeTab}
          variant="fullWidth"
          style={{ backgroundColor: '#39C2D7', color: '#FFFFFF' }}
          TabIndicatorProps={{ style: { height: '4px' } }}
        >
          <Tab label={this.props.translate('userProfile.settings.userProfileSettings')} value="profile" />
        </Tabs>
        {value === 'profile' && <UserProfileDetailsRouter updated={this.props.location.updated} />}
      </>
    );
  }
}

UserProfileTabContainer.propTypes = {
  value: PropTypes.string,
  translate: PropTypes.func,
  location: PropTypes.shape({
    updated: PropTypes.bool
  })
};

export default withRouter(withLocalize(UserProfileTabContainer));
