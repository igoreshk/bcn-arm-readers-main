import googleMarkerHandler from 'src/view/map/MarkerHandler/GoogleMarkerHandler';

class GoogleScalingEdgeTransformer {
  levelToPolyline = (level, google, map) => {
    const { scaleStartLatitude, scaleStartLongitude, scaleEndLatitude, scaleEndLongitude, scaleDistance } = level;

    if (scaleDistance === 0) {
      return [];
    }

    const coordinates = [
      { lat: scaleStartLatitude, lng: scaleStartLongitude },
      { lat: scaleEndLatitude, lng: scaleEndLongitude }
    ];
    const polyline = googleMarkerHandler.createScalingPolyline(google, map, coordinates);
    const listenerMap = new Map([
      ['click', null],
      ['mouseover', null],
      ['mouseout', null]
    ]);

    return [Object.assign(polyline, { distance: scaleDistance, listenerMap })];
  };
}

const googleScalingEdgeTransformer = new GoogleScalingEdgeTransformer();

export default Object.freeze(googleScalingEdgeTransformer);
