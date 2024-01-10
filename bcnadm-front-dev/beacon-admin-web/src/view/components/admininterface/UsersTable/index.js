import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { Table, TableHead, TableBody, TableRow, TableCell, TextField, Button, Avatar } from '@material-ui/core';
import ClearDate from '@material-ui/icons/Clear';
import { withLocalize } from 'react-localize-redux';

import { UserService } from 'src/service/UserService';
import { hideLoadingScreen, showLoadingScreen } from 'src/actions/loadingScreen';
import { UserRolesService } from 'src/service/UserRolesService';
import UserProfileService from 'src/service/UserProfileService';
import { DELETE, USERS_LIST } from 'src/consts/RouteConsts';
import { getSortType, sortUsers } from 'src/utils/usersSort';
import { filterUsers, getStringLastEntryDate } from 'src/utils/usersFilter';
import { formatUserValuesFromGetRequest } from 'src/utils/usersEndpointNamesFormatters';
import './userTable.scss';
import images from 'src/view/images';
import { UsersTableHeader } from '../UsersTableHeader';
import { SelectRolesFilter } from '../SelectRolesFilter';
import { SelectStatusFilter } from '../SelectStatusFilter';

const getUsersWithFormattedNames = (users) => users.map((user) => formatUserValuesFromGetRequest(user));

export class UsersTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      users: [],
      rolesState: [],
      isFilterShown: false,
      filteredUsers: [],
      sortedBy: null,
      filter: {
        firstName: '',
        lastName: '',
        email: '',
        date: null,
        role: '',
        status: ''
      }
    };
    this.deleteUser = this.deleteUser.bind(this);
  }

  componentDidMount() {
    this.props.showLoadingScreen();
    this.loadData();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.updated !== this.props.updated) {
      this.props.showLoadingScreen();
      this.loadData();
    }
  }

  setUsers(users) {
    this.setState({ users, filteredUsers: users });
  }

  setCurrentUser(user) {
    this.setState({ currentUser: user });
  }

  setRoles(role) {
    this.setState({
      rolesState: role
    });
  }

  toggleSortUsersByField = (field) => {
    this.setState((prevState) => ({
      sortedBy: getSortType(field, prevState.sortedBy),
      filteredUsers: sortUsers(field, prevState.filteredUsers, prevState.sortedBy)
    }));
  };

  loadRoles() {
    return new Promise((resolve) => {
      UserRolesService.findAll()
        .then((role) => {
          this.setRoles(role);
        })
        .finally(() => {
          resolve();
        })
        .catch((err) => {
          throw err;
        });
    });
  }

  loadCurrentUser() {
    return new Promise((resolve) => {
      UserProfileService.getCurrentUserProfile()
        .then((user) => {
          this.setCurrentUser(user);
        })
        .finally(() => {
          resolve();
        })
        .catch((err) => {
          throw err;
        });
    });
  }

  loadUsers() {
    return new Promise((resolve) => {
      UserService.findAll()
        .then((users) => {
          if (users.length) {
            const formattedUsers = getUsersWithFormattedNames(users);
            this.setUsers(formattedUsers);
          }
        })
        .finally(() => {
          resolve();
        })
        .catch((err) => {
          throw err;
        });
    });
  }

  loadData() {
    Promise.all([this.loadCurrentUser(), this.loadRoles(), this.loadUsers()])
      .then(() => {
        this.props.hideLoadingScreen();
        this.applyFilters();
      })
      .catch((err) => {
        throw err;
      });
  }

  toggleFilter = () => {
    this.setState((prevState) => ({
      isFilterShown: !prevState.isFilterShown
    }));
  };

  handleRowClick = (id) => () => {
    this.props.history.push(`${USERS_LIST}/${id}`);
  };

  setRolesFilter = (role) => {
    const { firstName, lastName, email, date, status } = this.state.filter;
    this.setState(
      {
        filter: {
          firstName: firstName || '',
          lastName: lastName || '',
          email: email || '',
          date: date || null,
          status: status || '',
          role
        }
      },
      this.applyFilters
    );
  };

  setStatusFilter = (status) => {
    const { firstName, lastName, email, date, role } = this.state.filter;
    this.setState(
      {
        filter: {
          firstName: firstName || '',
          lastName: lastName || '',
          email: email || '',
          date: date || null,
          role: role || '',
          status
        }
      },
      this.applyFilters
    );
  };

  setStringFilter = (value, field) => {
    const { firstName, lastName, email, date, role, status } = this.state.filter;
    this.setState(
      {
        filter: {
          firstName: firstName || '',
          lastName: lastName || '',
          email: email || '',
          date: date || null,
          role: role || '',
          status: status || '',
          [field]: value.toLowerCase()
        }
      },
      this.applyFilters
    );
  };

  applyFilters = () => {
    this.setState((prevState) => ({
      filteredUsers: filterUsers(prevState.filter, prevState.users)
    }));
  };

  deleteUser = (entityId) => (event) => {
    event.stopPropagation();
    this.props.history.push(`${USERS_LIST}/${entityId}${DELETE}`);
  };

  setDateFilter = (value) => {
    const { firstName, lastName, email, role, status } = this.state.filter;
    this.setState(
      {
        filter: {
          firstName: firstName || '',
          lastName: lastName || '',
          email: email || '',
          role: role || '',
          status: status || '',
          date: value.toLocaleString('en-US')
        }
      },
      this.applyFilters
    );
  };

  // have to implement this function because older version of material-ui
  // (which we are using) doesn't support removing the date
  clearDateField = () => {
    const { firstName, lastName, email, role, status } = this.state.filter;
    this.setState(
      {
        filter: {
          firstName: firstName || '',
          lastName: lastName || '',
          email: email || '',
          role: role || '',
          status: status || '',
          date: null
        }
      },
      this.applyFilters
    );
  };

  disableFutureDays = (date) => {
    return date.getTime() > Date.now();
  };

  render() {
    const { filter, sortedBy, isFilterShown, filteredUsers, currentUser, rolesState } = this.state;
    const { translate } = this.props;

    if (!filteredUsers || !currentUser) {
      return null;
    }

    return (
      <Table className="userTable">
        <TableHead>
          <UsersTableHeader
            className="header"
            toggleSortUsersByField={this.toggleSortUsersByField}
            sortedBy={sortedBy}
            toggleFilter={this.toggleFilter}
            translate={translate}
          />
        </TableHead>
        <TableBody>
          {isFilterShown && (
            <TableRow className="filter">
              <TableCell>
                <TextField
                  placeholder={translate('admin.userFilter.byFirstName')}
                  onChange={(event) => this.setStringFilter(event.target.value, 'firstName')}
                  value={filter.firstName}
                  fullWidth
                />
              </TableCell>
              <TableCell>
                <TextField
                  placeholder={translate('admin.userFilter.byLastName')}
                  onChange={(event) => this.setStringFilter(event.target.value, 'lastName')}
                  value={filter.lastName}
                  fullWidth
                />
              </TableCell>
              <TableCell>
                <TextField
                  placeholder={translate('admin.userFilter.byEmail')}
                  onChange={(event) => this.setStringFilter(event.target.value, 'email')}
                  value={filter.email}
                  fullWidth
                />
              </TableCell>
              <TableCell>
                <div className="dateDivStyle">
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <DatePicker
                      placeholder={translate('admin.userFilter.byDate')}
                      onChange={(value) => this.setDateFilter(value)}
                      value={filter.date === null ? undefined : new Date(filter.date)}
                      className="datePicker"
                      shouldDisableDate={this.disableFutureDays}
                    />
                  </MuiPickersUtilsProvider>
                  {filter.date && <ClearDate onClick={this.clearDateField} className="clearDateStyle" />}
                </div>
              </TableCell>
              <TableCell>
                <SelectRolesFilter
                  hintText={translate('admin.userFilter.byRoles')}
                  role={rolesState}
                  setRolesFilter={this.setRolesFilter}
                />
              </TableCell>
              <TableCell>
                <SelectStatusFilter
                  hintText={translate('admin.userFilter.byStatus')}
                  setStatusFilter={this.setStatusFilter}
                />
              </TableCell>
              <TableCell />
            </TableRow>
          )}

          {filteredUsers.map((entity) => {
            return (
              <TableRow key={entity.entityId} onClick={this.handleRowClick(entity.entityId)} className="user">
                <TableCell data-label={this.props.translate('admin.name')}>{entity.firstName}</TableCell>
                <TableCell data-label={this.props.translate('admin.surname')}>{entity.lastName}</TableCell>
                <TableCell data-label={this.props.translate('admin.email')}>{entity.email}</TableCell>
                <TableCell data-label={this.props.translate('admin.lastDate')}>
                  {getStringLastEntryDate(entity.lastEntry)}
                </TableCell>
                <TableCell data-label={this.props.translate('admin.permissions')}>
                  {entity.role}
                  <Avatar className="avatarStyle" src={images.role} />
                </TableCell>
                <TableCell data-label={this.props.translate('admin.status')}>{entity.status}</TableCell>

                <TableCell>
                  <Button
                    disabled={currentUser.email === entity.email}
                    name="remove-user-button"
                    onClick={this.deleteUser(entity.entityId)}
                    classes={{ label: 'removeButtonText' }}
                  >
                    {translate('common.remove')}
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  }
}

const mapDispatchToProps = {
  showLoadingScreen,
  hideLoadingScreen
};

UsersTable.propTypes = {
  showLoadingScreen: PropTypes.func.isRequired,
  hideLoadingScreen: PropTypes.func.isRequired,
  updated: PropTypes.bool,
  history: PropTypes.object.isRequired,
  translate: PropTypes.func
};

export default withRouter(connect(null, mapDispatchToProps)(withLocalize(UsersTable)));
