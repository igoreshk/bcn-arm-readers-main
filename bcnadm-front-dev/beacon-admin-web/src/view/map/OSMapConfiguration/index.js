/* eslint-disable no-unused-vars */
import L from 'leaflet';
import { LevelImageService } from 'src/service/LevelImageService';
import AbstractMapConfiguration from '../AbstractMapConfiguration';
import { INITIAL_ZOOM, mapProviders } from '../MapConsts';

export default class OSMapConfiguration extends AbstractMapConfiguration {
  constructor(center) {
    super();
    this.center = center;
  }

  createMap() {
    return new Promise((resolve) => {
      const map = L.map('OSMap', {
        center: this.center,
        zoom: INITIAL_ZOOM
      });
      map.provider = mapProviders.OSM;
      resolve(map);
    });
  }

  setMapBackground(map) {
    // Nothing to do here
  }

  getImageAndCalculateBounds(map, levelId, size, pixelsPerMeter) {
    map.panTo(new L.LatLng(this.center[0], this.center[1]));
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = LevelImageService.getLevelImageLink(levelId);

      image.onload = () => {
        const centerPX = map.latLngToLayerPoint(map.getCenter());
        const divider = 2;
        const heightInPixels = size.height * pixelsPerMeter;
        const widthInPixels = size.width * pixelsPerMeter;
        const southWest = L.point(centerPX.x - widthInPixels / divider, centerPX.y - heightInPixels / divider);
        const northEast = L.point(centerPX.x + widthInPixels / divider, centerPX.y + heightInPixels / divider);
        const bounds = L.latLngBounds(map.layerPointToLatLng(southWest), map.layerPointToLatLng(northEast));
        resolve({ bounds, imageLink: image.src });
      };
      image.onerror = () => {
        reject(new Error());
      };
    });
  }

  configureOverlay(map, image, mapParams) {
    const { bounds, rotation, isMapRendered } = mapParams;
    return new Promise((resolve) => {
      if (isMapRendered.current) {
        map.eachLayer((layer) => {
          map.removeLayer(layer);
        });
        map.removeOldControl();
      }

      const mapLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      });
      const overlayLayer = L.imageOverlay(image, bounds);
      const editableLayer = L.featureGroup();

      mapLayer.id = 'mapLayer';
      overlayLayer.id = 'overlayLayer';
      editableLayer.id = 'editableLayer';

      mapLayer.addTo(map);
      overlayLayer.addTo(map);
      editableLayer.addTo(map);

      const controlBar = L.control
        .layers(
          {},
          {
            'map': mapLayer,
            'overlay': overlayLayer,
            'drawlayer': editableLayer
          },
          { position: 'topleft' }
        )
        .addTo(map);

      map.removeOldControl = ((oldControl) => {
        return () => {
          map.removeControl(oldControl);
        };
      })(controlBar);

      // Initialising draw control bar
      // const drawControl = new L.Control.Draw({
      //   edit: {
      //     featureGroup: editableLayers
      //   }
      // });
      // map.addControl(drawControl);
      resolve(map);
    });
  }

  setMapDraggingListener(map, bounds) {
    let lastValidCenter = map.getCenter();
    map.on('drag', () => {
      const center = map.getCenter();
      if (bounds.contains(center)) {
        lastValidCenter = center;
      } else {
        map.panTo(lastValidCenter, { animate: false });
      }
    });
  }
}
