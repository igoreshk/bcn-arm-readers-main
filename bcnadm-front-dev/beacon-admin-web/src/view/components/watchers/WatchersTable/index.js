import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Table, TableHead, TableBody, TableRow, TableCell, TextField, Button } from '@material-ui/core';
import PropTypes from 'prop-types';
import { withLocalize } from 'react-localize-redux';
import { getSortType, sortWatchers } from 'src/utils/watchersSort';
import { filterWatchers } from 'src/utils/watchersFilter';
import VisitorGroupsService from 'src/service/VisitorGroupsService';
import VisitorService from 'src/service/VisitorService';
import { DELETE, WATCHERS_LIST } from 'src/consts/RouteConsts';
import { hideLoadingScreen, showLoadingScreen } from 'src/actions/loadingScreen';
import WatchersTableHeader from '../WatchersTableHeader/WatchersTableHeader';

import './watchersTable.scss';

export class WatchersTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      watchers: [],
      visitors: [],
      isFilterShown: false,
      filteredWatchers: [],
      sortedBy: null,
      filter: {
        name: '',
        visitorNames: ''
      }
    };
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

  async loadWatchersAndVisitors() {
    const watchers = await VisitorGroupsService.findAll()
      .then((res) => res)
      .catch((err) => {
        throw err;
      });

    const visitors = await VisitorService.findAll()
      .then((res) => res)
      .catch((err) => {
        throw err;
      });

    this.setState({
      watchers,
      visitors
    });
  }

  loadData() {
    this.loadWatchersAndVisitors()
      .then(() => {
        this.props.hideLoadingScreen();
        this.applyFilters();
      })
      .catch((err) => {
        throw err;
      });
  }

  toggleSortWatchersByField = (field) => {
    this.setState((prevState) => ({
      sortedBy: getSortType(field, prevState.sortedBy),
      filteredWatchers: sortWatchers(field, prevState.filteredWatchers, prevState.sortedBy)
    }));
  };

  toggleFilter = () => {
    this.setState((prevState) => ({ isFilterShown: !prevState.isFilterShown }));
  };

  handleRowClick = (id) => () => {
    this.props.history.push(`${WATCHERS_LIST}/${id}`);
  };

  setStringFilter = (value, field) => {
    const { filter } = this.state;
    filter[field] = value.toLowerCase();
    this.setState({ filter }, this.applyFilters);
  };

  applyFilters = () => {
    this.setState((prevState) => ({
      filteredWatchers: filterWatchers(prevState.filter, prevState.watchers, prevState.visitors)
    }));
  };

  deleteWatcher = (id) => (event) => {
    event.stopPropagation();
    this.props.history.push(`${WATCHERS_LIST}/${id}${DELETE}`);
  };

  render() {
    const { filter, sortedBy, isFilterShown, filteredWatchers, visitors } = this.state;
    const { translate } = this.props;

    if (!filteredWatchers) {
      return null;
    }

    return (
      <Table className="watchersTable">
        <TableHead>
          <WatchersTableHeader
            className="header"
            toggleSortWatchersByField={this.toggleSortWatchersByField}
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
                  placeholder={this.props.translate('watchers.byWatcherName')}
                  onChange={(event) => this.setStringFilter(event.target.value, 'name')}
                  value={filter.name}
                  fullWidth
                  className="filter-name"
                />
              </TableCell>
              <TableCell>
                <TextField
                  placeholder={this.props.translate('watchers.byVisitorName')}
                  onChange={(event) => this.setStringFilter(event.target.value, 'visitorNames')}
                  value={filter.visitorNames}
                  fullWidth
                  className="filter-visitor-names"
                />
              </TableCell>
              <TableCell className="remove" />
            </TableRow>
          )}

          {filteredWatchers.map((watcher) => {
            return (
              <TableRow key={watcher.entityId} onClick={this.handleRowClick(watcher.entityId)}>
                <TableCell data-label="WATCHER NAME">{watcher.name}</TableCell>
                <TableCell>
                  {watcher.visitorIds.map((id) => (
                    <p key={id}>{visitors.find((visitor) => visitor.entityId === id).name}</p>
                  ))}
                </TableCell>
                <TableCell>
                  <Button
                    name="remove-watcher-button"
                    onClick={this.deleteWatcher(watcher.entityId)}
                    classes={{ label: 'removeButtonText' }}
                  >
                    {this.props.translate('common.remove')}
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

WatchersTable.propTypes = {
  showLoadingScreen: PropTypes.func.isRequired,
  hideLoadingScreen: PropTypes.func.isRequired,
  updated: PropTypes.bool,
  history: PropTypes.object.isRequired,
  translate: PropTypes.func.isRequired
};

export default withRouter(connect(null, mapDispatchToProps)(withLocalize(WatchersTable)));
