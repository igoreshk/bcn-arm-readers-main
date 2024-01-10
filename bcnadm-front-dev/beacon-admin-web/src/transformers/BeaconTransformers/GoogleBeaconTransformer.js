/* @flow */
import googleMarkerHandler from 'src/view/map/MarkerHandler/GoogleMarkerHandler';
import images from 'src/view/images';
import AbstractTransformer from '../AbstractTransformer';

class GoogleBeaconTransformer extends AbstractTransformer {
  dtoToMarker = (dto: { id: String }, google: {}): {} => {
    const beaconMarker = googleMarkerHandler.createMarker(
      google,
      images.beaconIcon,
      new google.maps.LatLng(dto.latitude, dto.longitude)
    );

    const listenerMap = new Map([
      ['dragend', null],
      ['mouseover', null],
      ['rightclick', null],
      ['click', null],
      ['mouseout', null]
    ]);

    return Object.assign(beaconMarker, {
      uuid: dto.uuid,
      entityId: dto.entityId,
      legacyId: dto.legacyId,
      levelId: dto.levelId,
      listenerMap
    });
  };

  markerToDto = (marker: { entityId: String }): {} => ({
    entityId: marker.entityId,
    uuid: marker.uuid,
    legacyId: marker.legacyId,
    levelId: marker.levelId,
    longitude: marker.position.lng(),
    latitude: marker.position.lat()
  });
}

const googleBeaconsTransformer = new GoogleBeaconTransformer();

export default Object.freeze(googleBeaconsTransformer);
