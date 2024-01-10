import AreasSorter from 'src/utils/AreasSorter';
import React from 'react';
import { TableRow, TableCell } from '@material-ui/core';
import SortedAsc from '@material-ui/icons/KeyboardArrowDown';
import SortedDesc from '@material-ui/icons/KeyboardArrowUp';
import PropTypes from 'prop-types';

const Unsorted = () => <SortedAsc style={{ fill: '#CCCCCC' }} />;

const headerStyle = {
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  fontSize: '16px'
};

const tableRowStyle = {
  borderBottom: 'none'
};

const getIconByField = (sortedBy, field) => {
  const inside = Object.is(sortedBy, AreasSorter.mapFieldToOrder.get(field).desc) ? <SortedDesc /> : <Unsorted />;
  return Object.is(sortedBy, AreasSorter.mapFieldToOrder.get(field).asc) ? <SortedAsc /> : inside;
};

const AreasTableHeader = (props) => {
  return (
    <TableRow style={tableRowStyle}>
      <TableCell>
        <div onClick={() => !props.isAreasLoading && props.toggleSortAreasByField('name')} style={headerStyle}>
          {props.translate('areas.name')}
          {getIconByField(props.sortedBy, 'name')}
        </div>
      </TableCell>
      <TableCell>
        <div onClick={() => !props.isAreasLoading && props.toggleSortAreasByField('description')} style={headerStyle}>
          {props.translate('areas.description')}
          {getIconByField(props.sortedBy, 'description')}
        </div>
      </TableCell>
      <TableCell className="editColumn" />
    </TableRow>
  );
};

AreasTableHeader.propTypes = {
  isAreasLoading: PropTypes.bool.isRequired,
  sortedBy: PropTypes.string,
  toggleSortAreasByField: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired
};

export default AreasTableHeader;
