/* @flow */
import osmMarkerHandler from 'src/view/map/MarkerHandler/OSMMarkerHandler';
import images from 'src/view/images';
import AbstractTransformer from '../AbstractTransformer';

class OSMAreaTransformer extends AbstractTransformer {
  dtoToMarker = (dto: { entityId: String }, mapProvider: {}): {} => {
    const { L } = mapProvider;
    const ICON_SIZE_IN_PIXELS = 33;
    const location = dto.coordinate;

    const areaIcon = osmMarkerHandler.createIcon(L, images.areas, ICON_SIZE_IN_PIXELS);
    const areaMarker = osmMarkerHandler.createMarker(L, areaIcon, location);

    return Object.assign(areaMarker, {
      entityId: dto.entityId,
      description: dto.description,
      name: dto.name,
      levelId: dto.levelId
    });
  };

  markerToDto = (marker: { entityId: String }): {} => ({
    entityId: marker.entityId,
    coordinate: {
      longitude: marker.getLatLng().lng,
      latitude: marker.getLatLng().lat
    },
    description: marker.description,
    roomNumber: marker.roomNumber,
    levelId: marker.levelId
  });
}

const osmAreaTransformer = new OSMAreaTransformer();

export default Object.freeze(osmAreaTransformer);
