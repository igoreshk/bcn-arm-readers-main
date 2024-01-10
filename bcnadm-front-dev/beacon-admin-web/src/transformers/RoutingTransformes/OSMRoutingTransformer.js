/* @flow */
import osmMarkerHandler from 'src/view/map/MarkerHandler/OSMMarkerHandler';
import images from 'src/view/images';
import AbstractTransformer from '../AbstractTransformer';

class OSMRoutingTransformer extends AbstractTransformer {
  dtoToMarker = (dto: { id: String }, mapProvider: {}): {} => {
    const { L } = mapProvider;
    const ICON_SIZE_IN_PIXELS = 30;
    const location = { latitude: dto.latitude, longitude: dto.longitude };

    const vertexIcon = osmMarkerHandler.createIcon(L, images.vertexIcon, ICON_SIZE_IN_PIXELS);
    const scalingMarker = osmMarkerHandler.createMarker(L, vertexIcon, location);

    return Object.assign(scalingMarker, {
      entityId: dto.entityId,
      levelId: dto.levelId,
      type: dto.type
    });
  };

  markerToDto = (marker: { id: String }): {} => {
    return {
      entityId: marker.entityId,
      longitude: marker.getLatLng().lng,
      latitude: marker.getLatLng().lat,
      levelId: marker.levelId,
      type: marker.type
    };
  };
}

const osmRoutingTransformer = new OSMRoutingTransformer();

export default Object.freeze(osmRoutingTransformer);
