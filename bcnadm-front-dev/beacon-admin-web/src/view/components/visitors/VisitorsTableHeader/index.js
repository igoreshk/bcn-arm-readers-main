import { SORTED as visitorsSort } from 'src/utils/visitorsSort';
import React from 'react';
import { TableRow, TableCell, Button } from '@material-ui/core';
import Filter from '@material-ui/icons/FilterList';
import SortedAsc from '@material-ui/icons/KeyboardArrowDown';
import SortedDesc from '@material-ui/icons/KeyboardArrowUp';
import PropTypes from 'prop-types';

const Unsorted = () => <SortedAsc style={{ fill: '#CCCCCC' }} />;

const headerStyle = {
  color: 'rgba(0, 0, 0, 0.54)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center'
};

const getIconByField = (sortedBy, field) => {
  switch (sortedBy) {
    case visitorsSort[field].desc:
      return <SortedDesc />;
    case visitorsSort[field].asc:
      return <SortedAsc />;
    default:
      return <Unsorted />;
  }
};

export const VisitorsTableHeader = (props) => {
  return (
    <TableRow>
      <TableCell>
        <div
          onClick={() => {
            props.toggleSortVisitorsByField('name');
          }}
          style={headerStyle}
        >
          {props.translate('visitors.name')}
          {getIconByField(props.sortedBy, 'name')}
        </div>
      </TableCell>
      <TableCell className="remove">
        <Button onClick={props.toggleFilter} className="filterButton">
          <Filter />
          <span style={{ marginLeft: '10px' }}>{props.translate('visitors.filter')}</span>
        </Button>
      </TableCell>
    </TableRow>
  );
};

VisitorsTableHeader.propTypes = {
  translate: PropTypes.func.isRequired,
  sortedBy: PropTypes.string,
  toggleFilter: PropTypes.func.isRequired,
  toggleSortVisitorsByField: PropTypes.func.isRequired
};

export default VisitorsTableHeader;
