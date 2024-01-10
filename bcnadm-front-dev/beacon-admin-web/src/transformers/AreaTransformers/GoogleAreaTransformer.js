/* @flow */
import googleMarkerHandler from 'src/view/map/MarkerHandler/GoogleMarkerHandler';
import images from 'src/view/images';
import AbstractTransformer from '../AbstractTransformer';

class GoogleAreaTransformer extends AbstractTransformer {
  dtoToMarker = (area: { entityId: String }, google: {}): {} => {
    const markerPosition = new google.maps.LatLng(area.coordinate.latitude, area.coordinate.longitude);
    const areaMarker = googleMarkerHandler.createMarker(google, images.areas, markerPosition);

    const listenerMap = new Map([
      ['dragend', null],
      ['mouseover', null],
      ['rightclick', null],
      ['click', null],
      ['mouseout', null]
    ]);

    return Object.assign(areaMarker, {
      entityId: area.entityId,
      description: area.description,
      name: area.name,
      levelId: area.levelId,
      listenerMap
    });
  };

  markerToDto = (areaMarker: {}): {} => {
    return {
      entityId: areaMarker.entityId,
      coordinate: {
        latitude: areaMarker.position.lat(),
        longitude: areaMarker.position.lng()
      },
      description: areaMarker.description,
      name: areaMarker.name,
      levelId: areaMarker.levelId
    };
  };
}

const googleAreaTransformer = new GoogleAreaTransformer();

export default Object.freeze(googleAreaTransformer);
