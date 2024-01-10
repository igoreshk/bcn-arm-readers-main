import { BUILDINGS_LIST, USERS_LIST, VISITORS_LIST, WATCHERS_LIST } from 'src/consts/RouteConsts';
import images from 'src/view/images';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { withLocalize } from 'react-localize-redux';
import { Drawer, Divider, MenuItem, IconButton } from '@material-ui/core';
import NavigationMenu from '@material-ui/icons/Menu';
import Users from '@material-ui/icons/People';
import Message from '@material-ui/icons/Message';
import Help from '@material-ui/icons/HelpOutline';
import { FaBuilding as BuildingIcon } from 'react-icons/fa';
import { MdAccountBox as Visitor } from 'react-icons/md';
import PropTypes from 'prop-types';

import './leftIcons.scss';

export class LeftIcons extends Component {
  constructor(props) {
    super(props);
    this.state = { open: false };
  }

  handleToggle = () => this.setState((prevState) => ({ open: !prevState.open }));

  render() {
    const { translate } = this.props;

    return (
      <div className="appBarLeftIcons">
        <IconButton className="menuOpenButton" onClick={this.handleToggle}>
          <NavigationMenu style={{ color: 'white' }} />
        </IconButton>
        <img src={images.u305} role="presentation" />
        <Drawer variant="persistent" open={this.state.open} classes={{ paper: 'drawer' }}>
          <Link to={BUILDINGS_LIST}>
            <MenuItem>
              <BuildingIcon size={24} className="svg" />
              {translate('operator.buildings')}
            </MenuItem>
          </Link>
          <Link to={VISITORS_LIST}>
            <MenuItem>
              <Visitor size={24} className="svg" />
              {translate('operator.visitors')}
            </MenuItem>
          </Link>

          <Link to={WATCHERS_LIST}>
            <MenuItem>
              <Users className="svg" />
              {translate('operator.watchers')}
            </MenuItem>
          </Link>

          <Divider />

          <MenuItem disabled>
            <Message className="svg" />
            {translate('operator.messenger')}
          </MenuItem>

          <Divider />

          <Link to={USERS_LIST}>
            <MenuItem>
              <Users className="svg" />
              {translate('operator.users')}
            </MenuItem>
          </Link>

          <Divider />
          <MenuItem disabled>
            <Help className="svg" />
            {translate('operator.help')}
          </MenuItem>
        </Drawer>
      </div>
    );
  }
}

LeftIcons.propTypes = {
  translate: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    buildings: state.buildings.buildings,
    buildingsInvalidate: state.buildings.didInvalidate
  };
}

export default connect(mapStateToProps)(withLocalize(LeftIcons));
