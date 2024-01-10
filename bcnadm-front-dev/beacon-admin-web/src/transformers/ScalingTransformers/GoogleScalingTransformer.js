import googleMarkerHandler from 'src/view/map/MarkerHandler/GoogleMarkerHandler';
import images from 'src/view/images';
import AbstractTransformer from '../AbstractTransformer';

class GoogleScalingTransformer extends AbstractTransformer {
  levelToMarkers = (level, google) => {
    const { scaleStartLatitude, scaleStartLongitude, scaleEndLatitude, scaleEndLongitude } = level;

    if (scaleStartLatitude === 0 && scaleStartLongitude === 0) {
      return [];
    }

    const listenerMap = new Map([
      ['dragend', null],
      ['dragstart', null]
    ]);

    const startScalingMarker = Object.assign(
      googleMarkerHandler.createMarker(
        google,
        images.scaleVertexIcon,
        new google.maps.LatLng(scaleStartLatitude, scaleStartLongitude)
      ),
      { isStartVertex: true, listenerMap }
    );

    if (scaleEndLatitude === 0 && scaleEndLongitude === 0) {
      return [startScalingMarker];
    }

    const endScalingMarker = Object.assign(
      googleMarkerHandler.createMarker(
        google,
        images.scaleVertexIcon,
        new google.maps.LatLng(scaleEndLatitude, scaleEndLongitude)
      ),
      { isStartVertex: false, listenerMap: new Map(listenerMap) }
    );

    return [startScalingMarker, endScalingMarker];
  };

  markerToDto = (marker) => {
    if (marker.isStartVertex) {
      return {
        scaleStartLatitude: marker.position.lat(),
        scaleStartLongitude: marker.position.lng()
      };
    }
    return {
      scaleEndLatitude: marker.position.lat(),
      scaleEndLongitude: marker.position.lng()
    };
  };
}

const googleScalingTransformer = new GoogleScalingTransformer();

export default Object.freeze(googleScalingTransformer);
