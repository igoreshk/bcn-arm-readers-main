/* @flow*/
import googleMarkerHandler from 'src/view/map/MarkerHandler/GoogleMarkerHandler';
import images from 'src/view/images';
import AbstractTransformer from '../AbstractTransformer';

class GoogleRoutingTransformer extends AbstractTransformer {
  dtoToMarker = (dto: { entityId: String }, google: {}): {} => {
    const vertexMarker = googleMarkerHandler.createMarker(
      google,
      images.vertexIcon,
      new google.maps.LatLng(dto.latitude, dto.longitude)
    );
    const listenerMap = new Map([
      ['dragend', null],
      ['rightclick', null],
      ['click', null],
      ['dragstart', null]
    ]);

    return Object.assign(vertexMarker, {
      entityId: dto.entityId,
      levelId: dto.levelId,
      outgoingEdges: dto.outgoingEdges,
      listenerMap
    });
  };

  markerToDto = (marker: { entityId: String }): {} => ({
    entityId: marker.entityId,
    longitude: marker.position.lng(),
    latitude: marker.position.lat(),
    levelId: marker.levelId
  });
}

const googleRoutingTransformer = new GoogleRoutingTransformer();

export default Object.freeze(googleRoutingTransformer);
