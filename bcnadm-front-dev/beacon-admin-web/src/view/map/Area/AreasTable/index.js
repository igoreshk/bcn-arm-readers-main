import './areasTable.scss';

import SearchPanel from 'src/view/components/common/SearchPanel';
import WithSearch from 'src/view/components/common/WithSearch';
import { Button, LinearProgress, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import Edit from '@material-ui/icons/Edit';
import PropTypes from 'prop-types';
import React from 'react';
import AreasTableHeader from '../AreasTableHeader';

export const AreasTable = ({
  close,
  data,
  editArea,
  isAreasLoading,
  levelNumber,
  sortedBy,
  toggleSortAreasByField,
  translate
}) => (
  <div className="areasTable">
    <div className="header">
      <span className="levelNumber">
        {translate('operator.listOfAreas')}
        <br />({translate('building.level', { value: levelNumber })})
      </span>
      <SearchPanel
        className="areasSearch"
        textFieldRest={{
          fullWidth: true,
          InputProps: {
            disableUnderline: true
          }
        }}
      />
    </div>

    {!isAreasLoading ? (
      <Table className="table">
        <TableHead>
          <AreasTableHeader
            toggleSortAreasByField={toggleSortAreasByField}
            sortedBy={sortedBy}
            translate={translate}
            isAreasLoading={isAreasLoading}
          />
        </TableHead>
        <TableBody>
          {data.map((area) => (
            <TableRow key={area.entityId}>
              <TableCell data-label={translate('areas.name')}>{area.name}</TableCell>
              <TableCell data-label={translate('areas.description')}>{area.description}</TableCell>
              <TableCell className="editColumn">
                <Edit onClick={editArea(area.entityId)} className="editIcon" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    ) : (
      <LinearProgress />
    )}

    <div id="buttonRoot" className="closeButtonContainer">
      <Button onClick={close} color="primary">
        {translate('admin.close')}
      </Button>
    </div>
  </div>
);

AreasTable.propTypes = {
  close: PropTypes.func.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      description: PropTypes.string
    }).isRequired
  ).isRequired,
  editArea: PropTypes.func.isRequired,
  isAreasLoading: PropTypes.bool.isRequired,
  levelNumber: PropTypes.number,
  toggleSortAreasByField: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired,
  sortedBy: PropTypes.string
};

export default WithSearch(AreasTable);
