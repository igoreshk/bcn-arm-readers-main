import { USER_PROFILE } from 'src/consts/RouteConsts';
import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Popover, MenuItem, IconButton } from '@material-ui/core';
import ArrowDown from '@material-ui/icons/ArrowDropDown';
import ArrowUp from '@material-ui/icons/ArrowDropUp';
import PropTypes from 'prop-types';

class AvatarMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null
    };
  }

  handleClick = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleLogout = () => {
    this.props.doLogout(this.props.history);
  };

  render() {
    const { anchorEl } = this.state;

    return (
      <>
        <IconButton style={{ height: '100%' }} onClick={this.handleClick}>
          {anchorEl ? <ArrowUp style={{ color: 'white' }} /> : <ArrowDown style={{ color: 'white' }} />}
        </IconButton>
        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          onClose={this.handleClose}
          marginThreshold={0}
          PaperProps={{ style: { borderRadius: 0 } }}
        >
          <Link to={USER_PROFILE} style={{ color: 'rgba(0, 0, 0, 0.87)' }}>
            <MenuItem>{this.props.translate('settings.settings')}</MenuItem>
          </Link>
          <MenuItem onClick={this.handleLogout}>{this.props.translate('settings.logout')}</MenuItem>
        </Popover>
      </>
    );
  }
}

AvatarMenu.propTypes = {
  doLogout: PropTypes.func,
  history: PropTypes.object,
  translate: PropTypes.func.isRequired
};

export default withRouter(AvatarMenu);
