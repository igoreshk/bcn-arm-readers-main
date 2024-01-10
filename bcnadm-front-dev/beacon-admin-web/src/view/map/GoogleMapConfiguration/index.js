/* @flow*/
import { LevelImageService } from 'src/service/LevelImageService';
import AbstractMapConfiguration from '../AbstractMapConfiguration';
import mapConsts, { TILE_SIZE, INITIAL_ZOOM, mapProviders } from '../MapConsts';

export default class GoogleMapConfiguration extends AbstractMapConfiguration {
  constructor(google, node, center) {
    super();
    this.node = node;
    this.google = google;
    this.center = center;
  }

  createMap() {
    return new Promise((resolve) => {
      const map = new this.google.maps.Map(this.node, mapConsts.mapOptions);
      map.provider = mapProviders.GOOGLE;
      resolve(map);
    });
  }

  setMapBackground(map, showMapBackground) {
    function MapTile(tileSize) {
      this.tileSize = tileSize;
    }

    MapTile.prototype.getTile = mapConsts.divConfig;
    if (showMapBackground) {
      map.overlayMapTypes.clear();
    } else {
      map.overlayMapTypes.insertAt(0, new MapTile(new this.google.maps.Size(TILE_SIZE, TILE_SIZE)));
    }
  }

  getImageAndCalculateBounds(map, levelId: String, size, pixelsPerMeter) {
    const google = this.google;
    map.setCenter({ lat: this.center.lat, lng: this.center.lng });
    return new Promise((resolve, reject) => {
      const base = 2;
      const image = new Image();
      image.src = LevelImageService.getLevelImageLink(levelId);
      const projection = map.getProjection();
      const centerPX = projection.fromLatLngToPoint(map.getCenter());
      const scale = Math.pow(base, INITIAL_ZOOM);
      const bounds = new google.maps.LatLngBounds();
      const divider = 2;
      image.onload = () => {
        const heightInPixels = size.height * pixelsPerMeter;
        const widthInPixels = size.width * pixelsPerMeter;
        const southWest = new google.maps.Point(
          (centerPX.x * scale - widthInPixels / divider) / scale,
          (centerPX.y * scale - heightInPixels / divider) / scale
        );
        const northEast = new google.maps.Point(
          (centerPX.x * scale + widthInPixels / divider) / scale,
          (centerPX.y * scale + heightInPixels / divider) / scale
        );
        bounds.extend(projection.fromPointToLatLng(southWest));
        bounds.extend(projection.fromPointToLatLng(northEast));
        resolve({ bounds, imageLink: image.src });
      };
      image.onerror = () => {
        reject(new Error());
      };
    });
  }

  configureOverlay(map, bounds, image, rotation) {
    return new Promise((resolve) => {
      UsgsOverlay.prototype = new this.google.maps.OverlayView();
      const overlay = new UsgsOverlay();
      /**
       * @constructor
       * @see [Custom overlay]{@link https://developers.google.com/maps/documentation/javascript/customoverlays?hl=en}
       * To read about configuring custom overlay
       */
      function UsgsOverlay() {
        this.bounds = bounds;
        this.image = image;
        this.map = map;
        this.rotation = rotation;
        this.div = null;
      }

      UsgsOverlay.prototype.onAdd = mapConsts.onAdd;
      UsgsOverlay.prototype.draw = mapConsts.draw;
      UsgsOverlay.prototype.onRemove = mapConsts.onRemove;
      return resolve(overlay);
    });
  }

  setMapDraggingListener(map, bounds) {
    let lastValidCenter = map.getCenter();
    this.google.maps.event.addListener(map, 'center_changed', () => {
      if (bounds.contains(map.getCenter())) {
        lastValidCenter = map.getCenter();
        return;
      }
      map.panTo(lastValidCenter);
    });
  }
}
