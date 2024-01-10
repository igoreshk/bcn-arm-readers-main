import React from 'react';
import { TableRow, TableCell, Button } from '@material-ui/core';
import Filter from '@material-ui/icons/FilterList';
import SortedAsc from '@material-ui/icons/KeyboardArrowDown';
import SortedDesc from '@material-ui/icons/KeyboardArrowUp';
import PropTypes from 'prop-types';
import { SORTED as watchersSort } from 'src/utils/watchersSort';

const Unsorted = () => <SortedAsc style={{ fill: '#CCCCCC' }} />;

const headerStyle = {
  color: 'rgba(0, 0, 0, 0.54)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center'
};

const getIconByField = (sortedBy, field) => {
  if (sortedBy === watchersSort[field].desc) {
    return <SortedDesc />;
  }
  if (sortedBy === watchersSort[field].asc) {
    return <SortedAsc />;
  }
  return <Unsorted />;
};

export const WatchersTableHeader = (props) => {
  return (
    <TableRow>
      <TableCell>
        <div
          onClick={() => {
            props.toggleSortWatchersByField('name');
          }}
          style={headerStyle}
          className="name"
        >
          {props.translate('watchers.watcherName')}
          {getIconByField(props.sortedBy, 'name')}
        </div>
      </TableCell>
      <TableCell>
        <div
          onClick={() => {
            props.toggleSortWatchersByField('visitors');
          }}
          style={headerStyle}
          className="visitors"
        >
          {props.translate('watchers.visitor')}
          {getIconByField(props.sortedBy, 'visitors')}
        </div>
      </TableCell>
      <TableCell className="remove">
        <Button onClick={props.toggleFilter} className="removeButton">
          <Filter />
          <span style={{ marginLeft: '10px' }}>{props.translate('visitors.filter')}</span>
        </Button>
      </TableCell>
    </TableRow>
  );
};

WatchersTableHeader.propTypes = {
  sortedBy: PropTypes.string,
  toggleFilter: PropTypes.func.isRequired,
  toggleSortWatchersByField: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired
};

export default WatchersTableHeader;
