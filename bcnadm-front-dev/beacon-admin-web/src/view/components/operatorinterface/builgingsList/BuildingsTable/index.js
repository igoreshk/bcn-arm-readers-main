import PropTypes from 'prop-types';
import React from 'react';
import SearchPanel from 'src/view/components/common/SearchPanel';
import { Button, Table, TableBody, TableCell, TableHead, TableRow, Avatar } from '@material-ui/core';
import WithSearch from 'src/view/components/common/WithSearch';
import './buildingsTable.scss';
import { BuildingImageService } from 'src/service/BuildingImageService';

const iconStyle = {
  borderRadius: '0%',
  width: '100%',
  maxWidth: '60px',
  height: '60px',
  marginRight: '0px',
  objectFit: 'cover'
};

export const BuildingsTable = ({ data, onEditClick, onRemoveClick, showMap, translate }) => (
  <Table className="buildingsTable">
    <TableHead>
      <TableRow>
        <TableCell>{translate('buildings.name')}</TableCell>
        <TableCell>{translate('buildings.address')}</TableCell>
        <TableCell>{translate('buildings.lat')}</TableCell>
        <TableCell>{translate('buildings.lng')}</TableCell>
        <TableCell>{translate('buildings.preview')}</TableCell>
        <TableCell className="buttonsCell">
          <SearchPanel
            className="buldingSearch"
            textFieldRest={{
              fullWidth: true,
              InputProps: {
                disableUnderline: true
              }
            }}
          />
        </TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {data.map((building) => (
        <TableRow key={building.entityId} hover onClick={showMap(building)}>
          <TableCell data-label={translate('buildings.name')}>{building.name}</TableCell>
          <TableCell data-label={translate('buildings.address')}>{building.address}</TableCell>
          <TableCell data-label={translate('buildings.lat')}>{building.latitude}</TableCell>
          <TableCell data-label={translate('buildings.lng')}>{building.longitude}</TableCell>
          <TableCell data-label={translate('buildings.preview')}>
            <Avatar style={iconStyle} src={BuildingImageService.getBuildingImageLink(building.entityId)} />
          </TableCell>
          <TableCell className="buttonsCell">
            <Button classes={{ label: 'buttonText' }} name="edit-building-button" onClick={onEditClick(building)}>
              {translate('buildings.edit')}
            </Button>
            <Button classes={{ label: 'buttonText' }} name="remove-building-button" onClick={onRemoveClick(building)}>
              {translate('common.remove')}
            </Button>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

BuildingsTable.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      address: PropTypes.string.isRequired,
      latitude: PropTypes.number.isRequired,
      longitude: PropTypes.number.isRequired,
      entityId: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    }).isRequired
  ).isRequired,
  onEditClick: PropTypes.func.isRequired,
  onRemoveClick: PropTypes.func.isRequired,
  showMap: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired
};

export default WithSearch(BuildingsTable);
