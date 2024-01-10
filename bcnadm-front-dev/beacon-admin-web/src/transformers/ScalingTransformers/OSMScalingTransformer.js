import AbstractTransformer from 'src/transformers/AbstractTransformer';
import osmMarkerHandler from 'src/view/map/MarkerHandler/OSMMarkerHandler';
import images from 'src/view/images';
import { modes } from 'src/view/map/MapConsts';

class OSMScalingTransformer extends AbstractTransformer {
  levelToMarkers = (level, mapProvider) => {
    const { scaleStartLatitude, scaleStartLongitude, scaleEndLatitude, scaleEndLongitude } = level;

    if (scaleStartLatitude === 0 && scaleStartLongitude === 0) {
      return [];
    }

    const { L } = mapProvider;
    const ICON_SIZE_IN_PIXELS = 30;
    const scalingIcon = osmMarkerHandler.createIcon(L, images.scaleVertexIcon, ICON_SIZE_IN_PIXELS, modes.SCALE_MODE);
    const startScalingMarker = Object.assign(
      osmMarkerHandler.createMarker(L, scalingIcon, {
        latitude: scaleStartLatitude,
        longitude: scaleStartLongitude
      }),
      { isStartVertex: true }
    );

    if (scaleEndLatitude === 0 && scaleEndLongitude === 0) {
      return [startScalingMarker];
    }

    const endScalingMarker = Object.assign(
      osmMarkerHandler.createMarker(L, scalingIcon, {
        latitude: scaleEndLatitude,
        longitude: scaleEndLongitude
      }),
      { isStartVertex: false }
    );

    return [startScalingMarker, endScalingMarker];
  };

  markerToDto = (marker) => {
    if (marker.isStartVertex) {
      return {
        scaleStartLatitude: marker.getLatLng().lat,
        scaleStartLongitude: marker.getLatLng().lng
      };
    }
    return {
      scaleEndLatitude: marker.getLatLng().lat,
      scaleEndLongitude: marker.getLatLng().lng
    };
  };
}

const osmMarketTransformer = new OSMScalingTransformer();

export default Object.freeze(osmMarketTransformer);
