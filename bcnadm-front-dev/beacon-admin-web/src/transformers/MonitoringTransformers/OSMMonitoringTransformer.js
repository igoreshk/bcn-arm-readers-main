import osmMarkerHandler from 'src/view/map/MarkerHandler/OSMMarkerHandler';
import images from 'src/view/images';
import AbstractTransformer from '../AbstractTransformer';

class OSMMonitoringTransformer extends AbstractTransformer {
  dtoToMarker = (dto, mapProvider) => {
    const { L } = mapProvider;
    const ICON_SIZE_IN_PIXELS = 40;
    const location = { latitude: dto.latitude, longitude: dto.longitude };

    const monitoringIcon = osmMarkerHandler.createIcon(L, images.visitor, ICON_SIZE_IN_PIXELS);
    monitoringIcon.options.className = 'iconMonitoring';
    const monitoringMarker = osmMarkerHandler.createMarker(L, monitoringIcon, location);

    return Object.assign(monitoringMarker, {
      id: dto.entityId,
      name: dto.name,
      visitorId: dto.visitorId,
      heartRate: dto.heartRate,
      bodyTemperature: dto.bodyTemperature,
      stepCount: dto.stepCount,
      timestamp: dto.timestamp
    });
  };
}

const osmMonitoringTransformer = new OSMMonitoringTransformer();

export default Object.freeze(osmMonitoringTransformer);
