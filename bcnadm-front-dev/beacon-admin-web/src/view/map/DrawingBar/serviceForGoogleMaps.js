import { googleLayerForOSMap, shapesRender, zoomPosition } from 'view/map/DrawingBar/DrawingBar';
import { mapProviders, modes } from 'view/map/MapConsts';

export const setMapForGoogle = (props, buildingImage) => {
  const {
    selectedMapProviderName,
    loadedOSMap,
    match,
    buildingCenterCoordinates,
    pictureCoords,
    translate,
    google,
    selectedMap,
    shapes
  } = props;

  if (selectedMapProviderName === mapProviders.GOOGLE && match.params.layer !== modes.DRAWING_MODE) {
    shapes.data?.map((figure) => {
      const polygon = new google.maps.Polygon({
        paths: figure.coordinates
          .map((coordinate) => [{ lat: coordinate.latitude, lng: coordinate.longitude }])
          .flat(1),
        strokeColor: '#3388ff',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#3388ff',
        fillOpacity: 0.05,
        editable: false,
        draggable: false
      });

      const infoWindow = new google.maps.InfoWindow();

      google.maps.event.addListener(polygon, 'click', (event) => {
        infoWindow.setContent(
          match.params.layer === modes.MONITORING_MODE
            ? `${'<div class="drawing-bar__polygon-pop-up"></div>'}<span class="drawing-bar__polygon-pop-up-name">${
                figure.name
              }</span>
          <button type="button" id="shape-getter" class="drawing-bar__polygon-button_get-data" value='${
            figure.entityId
          }'>${translate('monitoring.getVisitors')}</button>`
            : `${'<div class="drawing-bar__polygon-pop-up"></div>'}<span class="drawing-bar__polygon-pop-up-name">${
                figure.name
              }</span>`
        );
        infoWindow.setPosition(event.latLng);
        infoWindow.open(polygon);
      });

      if (figure.levelId === match.params.level) {
        polygon.setMap(selectedMap);
      }
      return polygon;
    });
  }

  if (
    selectedMapProviderName === mapProviders.GOOGLE &&
    !loadedOSMap.current &&
    match.params.layer === modes.DRAWING_MODE &&
    buildingCenterCoordinates &&
    pictureCoords.length !== 0
  ) {
    googleLayerForOSMap(pictureCoords, loadedOSMap, buildingImage, zoomPosition, buildingCenterCoordinates);
    shapesRender(shapes, match, loadedOSMap, translate);
  }
};
