/* @flow */
import osmMarkerHandler from 'src/view/map/MarkerHandler/OSMMarkerHandler';
import images from 'src/view/images';
import AbstractTransformer from '../AbstractTransformer';

class OSMReaderTransformer extends AbstractTransformer {
  dtoToMarker = (dto: { id: String }, mapProvider: {}): {} => {
    const { L } = mapProvider;
    const ICON_SIZE_IN_PIXELS = 25;
    const { entityId, latitude, longitude, uuid } = dto;
    const location = { latitude, longitude };

    const readerIcon = osmMarkerHandler.createIcon(L, images.readerIcon, ICON_SIZE_IN_PIXELS);
    const readerMarker = osmMarkerHandler.createMarker(L, readerIcon, location);

    return Object.assign(readerMarker, {
      entityId,
      uuid
    });
  };

  markerToDto = (marker: { id: String }): {} => ({
    entityId: marker.entityId,
    uuid: marker.uuid,
    longitude: marker.getLatLng().lng,
    latitude: marker.getLatLng().lat
  });
}

const osmReaderTransformer = new OSMReaderTransformer();

export default Object.freeze(osmReaderTransformer);
