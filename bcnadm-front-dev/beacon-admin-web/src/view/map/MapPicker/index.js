import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Select, MenuItem, FormControl } from '@material-ui/core';
import { setMapProviderName } from 'src/reducers/mapSettingsReducer/mapSettingsSlice';
import PropTypes from 'prop-types';

import './mapPicker.scss';

const MapPicker = ({ selectedMapProviderName, setProviderName }) => {
  const handleMapChange = (event) => {
    const newMap = event.target.value;
    if (newMap !== selectedMapProviderName) {
      setProviderName({ selectedMapProviderName: newMap });
    }
  };

  return (
    <FormControl className="filledForm">
      <Select value={selectedMapProviderName} onChange={handleMapChange} displayEmpty>
        <MenuItem value="Google">Google</MenuItem>
        <MenuItem value="OSM">OSM</MenuItem>
      </Select>
    </FormControl>
  );
};

const mapStateToProps = (state) => {
  return {
    selectedMapProviderName: state.mapSettings.selectedMapProviderName
  };
};

const mapDispatchToProps = {
  setProviderName: setMapProviderName
};

MapPicker.propTypes = {
  selectedMapProviderName: PropTypes.string.isRequired,
  setProviderName: PropTypes.func
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MapPicker));
