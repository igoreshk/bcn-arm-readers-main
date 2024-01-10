import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Table, TableHead, TableBody, TableRow, TableCell, TextField, Button } from '@material-ui/core';
import PropTypes from 'prop-types';
import { withLocalize } from 'react-localize-redux';
import { getSortType, sortVisitors } from 'src/utils/visitorsSort';
import { filterVisitors } from 'src/utils/visitorsFilter';
import { VisitorService } from 'src/service/VisitorService';
import { DELETE, VISITORS_LIST } from 'src/consts/RouteConsts';
import { hideLoadingScreen, showLoadingScreen } from 'src/actions/loadingScreen';
import VisitorsTableHeader from '../VisitorsTableHeader';

import './visitorsTable.scss';

export class VisitorsTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visitors: [],
      isFilterShown: false,
      filteredVisitors: [],
      sortedBy: null,
      filter: {
        name: ''
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

  loadVisitors() {
    return VisitorService.findAll()
      .then((visitors) => {
        this.setState({ visitors });
      })
      .catch((err) => {
        throw err;
      });
  }

  loadData() {
    this.loadVisitors()
      .then(() => {
        this.props.hideLoadingScreen();
        this.applyFilters();
      })
      .catch((err) => {
        throw err;
      });
  }

  toggleSortVisitorsByField = (field) => {
    this.setState((prevState) => ({
      sortedBy: getSortType(field, prevState.sortedBy),
      filteredVisitors: sortVisitors(field, prevState.filteredVisitors, prevState.sortedBy)
    }));
  };

  toggleFilter = () => {
    this.setState((prevState) => ({ isFilterShown: !prevState.isFilterShown }));
  };

  handleRowClick = (id) => () => {
    this.props.history.push(`${VISITORS_LIST}/${id}`);
  };

  setStringFilter = (value, field) => {
    const { filter } = this.state;
    filter[field] = value.toLowerCase();
    this.setState({ filter }, this.applyFilters);
  };

  applyFilters = () => {
    this.setState((prevState) => ({
      filteredVisitors: filterVisitors(prevState.filter, prevState.visitors)
    }));
  };

  deleteVisitor = (entityId) => (event) => {
    event.stopPropagation();
    this.props.history.push(`${VISITORS_LIST}/${entityId}${DELETE}`);
  };

  render() {
    const { filter, sortedBy, isFilterShown, filteredVisitors } = this.state;

    const { translate } = this.props;

    if (!filteredVisitors) {
      return null;
    }

    return (
      <Table className="visitorsTable">
        <TableHead>
          <VisitorsTableHeader
            toggleSortVisitorsByField={this.toggleSortVisitorsByField}
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
                  placeholder={translate('visitors.visitorFilter.byName')}
                  onChange={(event) => this.setStringFilter(event.target.value, 'name')}
                  value={filter.name}
                  fullWidth
                />
              </TableCell>
              <TableCell className="remove" />
            </TableRow>
          )}

          {filteredVisitors.map((visitor) => {
            return (
              <TableRow key={visitor.entityId} onClick={this.handleRowClick(visitor.entityId)}>
                <TableCell data-label={this.props.translate('visitors.name')}>{visitor.name}</TableCell>
                <TableCell>
                  <Button
                    name="remove-visitor-button"
                    onClick={this.deleteVisitor(visitor.entityId)}
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

VisitorsTable.propTypes = {
  showLoadingScreen: PropTypes.func.isRequired,
  hideLoadingScreen: PropTypes.func.isRequired,
  updated: PropTypes.bool,
  history: PropTypes.object.isRequired,
  translate: PropTypes.func
};

export default withRouter(connect(null, mapDispatchToProps)(withLocalize(VisitorsTable)));
