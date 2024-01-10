import { INITIAL_ZOOM } from 'view/map/MapConsts';

export const isScaleEdgeChanged = (prevLevel, currentLevel) => {
  return (
    prevLevel.scaleStartLatitude !== currentLevel.scaleStartLatitude ||
    prevLevel.scaleStartLongitude !== currentLevel.scaleStartLongitude ||
    prevLevel.scaleEndLatitude !== currentLevel.scaleEndLatitude ||
    prevLevel.scaleEndLongitude !== currentLevel.scaleEndLongitude ||
    prevLevel.scaleDistance !== currentLevel.scaleDistance
  );
};

// Toggle background if map is not null
export const toggleBackgroundIfMapExist = (map, toggleBackgroundFunc) => {
  map && toggleBackgroundFunc();
};

export const calculatePixelsPerMeter = (map, google, level) => {
  const { scaleStartLatitude, scaleStartLongitude, scaleEndLatitude, scaleEndLongitude, scaleDistance } = level;

  const baseValue = 10;
  if (scaleDistance === 0) {
    return baseValue;
  }

  const degree = 2;
  const scale = degree ** INITIAL_ZOOM;
  const points = [
    map.getProjection().fromLatLngToPoint(new google.maps.LatLng(scaleStartLatitude, scaleStartLongitude)),
    map.getProjection().fromLatLngToPoint(new google.maps.LatLng(scaleEndLatitude, scaleEndLongitude))
  ];
  const distanceInPixels = Math.sqrt(
    ((points[0].x - points[1].x) * scale) ** degree + ((points[0].y - points[1].y) * scale) ** degree
  );
  return distanceInPixels / scaleDistance;
};

const degree = 2;

const canBeScaled = (scaleStartLatitude, scaleStartLongitude, scaleEndLatitude, scaleEndLongitude) => {
  return (scaleStartLatitude === 0 && scaleStartLongitude === 0) || (scaleEndLatitude === 0 && scaleEndLongitude === 0);
};

export const rotateImage = (map, google, level) => {
  const { scaleStartLatitude, scaleStartLongitude, scaleEndLatitude, scaleEndLongitude } = level;

  if (canBeScaled(scaleStartLatitude, scaleStartLongitude, scaleEndLatitude, scaleEndLongitude)) {
    return 0;
  }
  const A = map.getProjection().fromLatLngToPoint(new google.maps.LatLng(scaleStartLatitude, scaleStartLongitude));
  const B = map.getProjection().fromLatLngToPoint(new google.maps.LatLng(scaleEndLatitude, scaleEndLongitude));
  const hypotenuse = Math.sqrt((A.x - B.x) ** degree + (A.y - B.y) ** degree);
  const cathetus = Math.abs(A.y - B.y);
  let alpha = Math.acos(cathetus / hypotenuse);
  if ((A.x > B.x && A.y > B.y) || (A.x < B.x && A.y < B.y)) {
    alpha = alpha - Math.PI;
  }
  const minForAllRotate = 0;
  const maxForAllRotate = -1;
  if (minForAllRotate < alpha && alpha < maxForAllRotate) {
    return alpha;
  }
  return 0;
};
