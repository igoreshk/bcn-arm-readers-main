import React from 'react';
import { TableRow, TableCell, Button } from '@material-ui/core';
import Filter from '@material-ui/icons/FilterList';
import SortedAsc from '@material-ui/icons/KeyboardArrowDown';
import SortedDesc from '@material-ui/icons/KeyboardArrowUp';
import PropTypes from 'prop-types';

import { SORTED } from 'src/utils/usersSort';

const Unsorted = () => <SortedAsc style={{ fill: '#CCCCCC' }} />;

const headerStyle = {
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center'
};

const getIconByField = (sortedBy, field) => {
  const insideTernary = Object.is(sortedBy, SORTED[field].desc) ? <SortedDesc /> : <Unsorted />;
  return Object.is(sortedBy, SORTED[field].asc) ? <SortedAsc /> : insideTernary;
};

export const UsersTableHeader = (props) => {
  return (
    <TableRow>
      <TableCell>
        <div
          onClick={() => {
            props.toggleSortUsersByField('firstName');
          }}
          style={headerStyle}
        >
          {props.translate('admin.name')}
          {getIconByField(props.sortedBy, 'firstName')}
        </div>
      </TableCell>
      <TableCell>
        <div
          onClick={() => {
            props.toggleSortUsersByField('lastName');
          }}
          style={headerStyle}
        >
          {props.translate('admin.surname')}
          {getIconByField(props.sortedBy, 'lastName')}
        </div>
      </TableCell>
      <TableCell>
        <div
          onClick={() => {
            props.toggleSortUsersByField('email');
          }}
          style={headerStyle}
        >
          {props.translate('admin.email')}
          {getIconByField(props.sortedBy, 'email')}
        </div>
      </TableCell>
      <TableCell>{props.translate('admin.lastDate')}</TableCell>
      <TableCell>{props.translate('admin.permissions')}</TableCell>
      <TableCell>{props.translate('admin.status')}</TableCell>
      <TableCell>
        <Button style={{ float: 'right' }} onClick={props.toggleFilter}>
          <Filter />
          <span style={{ marginLeft: '8px' }}>{props.translate('admin.filter')}</span>
        </Button>
      </TableCell>
    </TableRow>
  );
};

UsersTableHeader.propTypes = {
  translate: PropTypes.func.isRequired,
  sortedBy: PropTypes.string,
  toggleFilter: PropTypes.func.isRequired,
  toggleSortUsersByField: PropTypes.func.isRequired
};
