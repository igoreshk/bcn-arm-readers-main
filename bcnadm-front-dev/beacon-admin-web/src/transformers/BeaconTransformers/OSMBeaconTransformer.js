/* @flow */
import osmMarkerHandler from 'src/view/map/MarkerHandler/OSMMarkerHandler';
import images from 'src/view/images';
import AbstractTransformer from '../AbstractTransformer';

class OSMBeaconTransformer extends AbstractTransformer {
  dtoToMarker = (dto: { id: String }, mapProvider: {}): {} => {
    const { L } = mapProvider;
    const ICON_SIZE_IN_PIXELS = 25;
    const location = { latitude: dto.latitude, longitude: dto.longitude };

    const beaconIcon = osmMarkerHandler.createIcon(L, images.beaconIcon, ICON_SIZE_IN_PIXELS);
    const beaconMarker = osmMarkerHandler.createMarker(L, beaconIcon, location);

    return Object.assign(beaconMarker, {
      uuid: dto.uuid,
      entityId: dto.entityId,
      legacyId: dto.legacyId,
      levelId: dto.levelId
    });
  };

  markerToDto = (marker: { id: String }): {} => ({
    entityId: marker.entityId,
    uuid: marker.uuid,
    legacyId: marker.legacyId,
    levelId: marker.levelId,
    longitude: marker.getLatLng().lng,
    latitude: marker.getLatLng().lat
  });
}

const osmBeaconsTransformer = new OSMBeaconTransformer();

export default Object.freeze(osmBeaconsTransformer);
