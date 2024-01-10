/* @flow*/
import googleMarkerHandler from 'src/view/map/MarkerHandler/GoogleMarkerHandler';
import images from 'src/view/images';
import AbstractTransformer from '../AbstractTransformer';

class GoogleReaderTransformer extends AbstractTransformer {
  dtoToMarker = (dto: { id: String }, google: {}): {} => {
    const readerMarker = googleMarkerHandler.createMarker(
      google,
      images.readerIcon,
      new google.maps.LatLng(dto.latitude, dto.longitude)
    );

    const listenerMap = new Map([
      ['dragend', null],
      ['mouseover', null],
      ['rightclick', null],
      ['click', null],
      ['mouseout', null]
    ]);

    return Object.assign(readerMarker, {
      entityId: dto.entityId,
      uuid: dto.uuid,
      listenerMap
    });
  };

  markerToDto = (marker: { entityId: String }): {} => ({
    entityId: marker.entityId,
    uuid: marker.uuid,
    longitude: marker.position.lng(),
    latitude: marker.position.lat()
  });
}

const googleReaderTransformer = new GoogleReaderTransformer();

export default Object.freeze(googleReaderTransformer);
