import osmMarkerHandler from 'src/view/map/MarkerHandler/OSMMarkerHandler';

class OSMScalingEdgeTransformer {
  levelToPolyline = (level, mapProvider, map) => {
    const { scaleStartLatitude, scaleStartLongitude, scaleEndLatitude, scaleEndLongitude, scaleDistance } = level;
    const { L } = mapProvider;

    if (scaleDistance === 0) {
      return [];
    }

    const coordinates = [
      [scaleStartLatitude, scaleStartLongitude],
      [scaleEndLatitude, scaleEndLongitude]
    ];
    const polyline = osmMarkerHandler.createScalingPolyline(L, map, coordinates);
    return [Object.assign(polyline, { distance: scaleDistance })];
  };
}

const osmScalingEdgeTransformer = new OSMScalingEdgeTransformer();

export default Object.freeze(osmScalingEdgeTransformer);
