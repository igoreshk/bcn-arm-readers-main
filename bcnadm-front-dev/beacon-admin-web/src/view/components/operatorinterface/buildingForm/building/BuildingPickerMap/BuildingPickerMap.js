import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import { setBuildingFormField } from 'src/actions/setBuildingFormField';

const MARKER_DEFAULT_LATITUDE = 59.887973;
const MARKER_DEFAULT_LONGITUDE = 30.32818;

export class BuildingPickerMap extends Component {
  constructor(props) {
    super(props);
    this.onMapClick = this.onMapClick.bind(this);
  }

  onMapClick = (ref, map, coords) => {
    const latitude = coords.latLng.lat();
    const longitude = coords.latLng.lng();

    this.props.setBuildingFormField('latitude', latitude);
    this.props.setBuildingFormField('longitude', longitude);
  };

  adjustForZeroCoordinates(latid, long) {
    if (latid && long) {
      return { lat: latid, lng: long };
    }
    return { lat: MARKER_DEFAULT_LATITUDE, lng: MARKER_DEFAULT_LONGITUDE };
  }

  render() {
    const latitude = this.props.buildingFormProps.BuildingForm.values.latitude;
    const longitude = this.props.buildingFormProps.BuildingForm.values.longitude;

    return (
      <Map
        item
        xs={12}
        google={this.props.google}
        onClick={(ref, map, coords) => this.onMapClick(ref, map, coords)}
        zoom={14}
        initialCenter={this.adjustForZeroCoordinates(latitude, longitude)}
        center={this.adjustForZeroCoordinates(latitude, longitude)}
        className="building-picker-map"
      >
        {latitude && longitude && <Marker position={{ lat: latitude, lng: longitude }} />}
      </Map>
    );
  }
}

const mapStateToProps = (state) => {
  return { buildingFormProps: state.form };
};

const mapDispatchToProps = {
  setBuildingFormField
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  GoogleApiWrapper({
    apiKey: process.env.GOOGLE_API_KEY
  })(BuildingPickerMap)
);
