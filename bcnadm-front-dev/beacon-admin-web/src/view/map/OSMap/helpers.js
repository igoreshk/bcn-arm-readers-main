import L from 'leaflet';

export const calculatePixelsPerMeter = (map, level) => {
  const { scaleStartLatitude, scaleStartLongitude, scaleEndLatitude, scaleEndLongitude, scaleDistance } = level;

  const baseValue = 10;
  if (scaleDistance === 0) {
    return baseValue;
  }
  const latLngPoints = [
    L.latLng(scaleStartLatitude, scaleStartLongitude),
    L.latLng(scaleEndLatitude, scaleEndLongitude)
  ];
  const points = [map.latLngToLayerPoint(latLngPoints[0]), map.latLngToLayerPoint(latLngPoints[1])];
  const degree = 2;
  const distanceInPixels = Math.sqrt((points[0].x - points[1].x) ** degree + (points[0].y - points[1].y) ** degree);
  return distanceInPixels / scaleDistance;
};

export const rotateImage = (map, level) => {
  const { scaleStartLatitude, scaleStartLongitude, scaleEndLatitude, scaleEndLongitude } = level;

  if ((scaleStartLatitude === 0 && scaleStartLongitude === 0) || (scaleEndLatitude === 0 && scaleEndLongitude === 0)) {
    return 0;
  }

  const A = map.project(L.latLng(scaleStartLatitude, scaleStartLongitude));
  const B = map.project(L.latLng(scaleEndLatitude, scaleEndLongitude));
  const degree = 2;
  const hypotenuse = Math.sqrt((A.x - B.x) ** degree + (A.y - B.y) ** degree);
  const cathetus = Math.abs(A.y - B.y);
  let alpha = Math.acos(cathetus / hypotenuse);
  if ((A.x > B.x && A.y > B.y) || (A.x < B.x && A.y < B.y)) {
    alpha = Math.PI - alpha;
  }
  return alpha;
};
