import googleMarkerHandler from 'src/view/map/MarkerHandler/GoogleMarkerHandler';
import AbstractTransformer from '../AbstractTransformer';

class GoogleMonitoringTransformer extends AbstractTransformer {
  dtoToMarker = (visitor, google) => {
    const markerPosition = new google.maps.LatLng(visitor.latitude, visitor.longitude);

    const listenerMap = new Map([
      ['dragend', null],
      ['mouseover', null],
      ['rightclick', null],
      ['click', null],
      ['mouseout', null]
    ]);
    const sideLength = 40;

    const icon = {
      path: `M 16.396 3.775 c 1.864 0 3.376 1.536 3.376 3.43 c 0 1.896 -1.512 3.431 -3.376 3.431 c -1.864 0 -3.375
       -1.535 -3.375 -3.43 c 0 -1.895 1.511 -3.43 3.375 -3.43 m 2.532 7.718 h -0.6 a 4.567 4.567 0 0 1 -3.864 0 h
        -0.6 c -1.397 0 -2.53 1.152 -2.53 2.573 v 7.29 c 0 0.71 0.566 1.286 1.265 1.286 h 0.844 v 7.29 c 0 0.71
         0.566 1.286 1.266 1.286 h 3.375 c 0.699 0 1.266 -0.576 1.266 -1.286 v -7.29 h 0.844 c 0.699 0 1.265 -0.576
          1.265 -1.286 v -7.29 c 0 -1.421 -1.133 -2.573 -2.531 -2.573 z`,
      fillColor: 'currentColor',
      fillOpacity: 1,
      scale: 1.2,
      scaledSize: new google.maps.Size(sideLength, sideLength)
    };

    return Object.assign(googleMarkerHandler.createMarker(google, icon, markerPosition), {
      id: visitor.entityId,
      name: visitor.name,
      visitorId: visitor.visitorId,
      heartRate: visitor.heartRate,
      bodyTemperature: visitor.bodyTemperature,
      stepCount: visitor.stepCount,
      timestamp: visitor.timestamp,
      listenerMap
    });
  };
}

const googleMonitoringTransformer = new GoogleMonitoringTransformer();

export default Object.freeze(googleMonitoringTransformer);
