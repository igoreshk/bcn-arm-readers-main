import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import LeftIcons from '../LeftIcons';
import RightIcons from '../RightIcons';

import './appBar.scss';

export function CustomAppBar(props) {
  const { title, avatar } = props;
  return (
    <>
      <header className="appBar">
        <LeftIcons />
        <div style={{ flexGrow: 1 }}>{title}</div>
        <RightIcons avatar={avatar} />
      </header>
      <div style={{ paddingTop: 56 }} />
    </>
  );
}

const mapStateToProps = (state) => ({
  avatar: state.userSettings.avatar
});

CustomAppBar.propTypes = {
  title: PropTypes.object,
  avatar: PropTypes.string
};

export default connect(mapStateToProps, null)(CustomAppBar);
