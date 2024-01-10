/**
 * Contains set of constants for configuring map
 * @namespace mapConsts
 * @prop {object} mapOptions Constant, used in google.maps.Map() constructor when creating map
 * @prop {function} configureCoordMapType Configures overlay map type & map tiles
 * (See: {@link configureCoordMapType})
 * @prop {function} configureOverlay Configures overlay, particularly sets custom image as an overlay, size of an overlay etc
 * (See: {@link configureOverlay})
 *
 * @see [Custom overlays]{@link https://developers.google.com/maps/documentation/javascript/customoverlays?hl=en}
 * To read about configuring custom overlays
 */
export const INITIAL_ZOOM = 18;

const mapConsts = {
  mapOptions: {
    zoom: INITIAL_ZOOM,
    minZoom: 12,
    maxZoom: 28,
    center: { lat: 0, lng: 0 },
    mapTypeId: 'roadmap',
    zoomControl: true,
    mapTypeControl: false,
    scaleControl: true,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: false
  },
  /**
   * This function configures tiles of map
   * @function
   * @param coord {object} Coordinates on current tile
   * @param zoom {number} Zoom rate
   * @param ownerDocument {object} returns higher-level document object for current node
   * @returns {object} configured HTML element
   */
  divConfig(coord, zoom, ownerDocument) {
    const div = ownerDocument.createElement('div');
    div.innerHTML = coord;
    div.style.width = `${this.tileSize.width}px`;
    div.style.height = `${this.tileSize.height}px`;
    div.style.fontSize = '0';
    div.style.borderStyle = 'solid';
    div.style.borderWidth = '10000px';
    div.style.borderColor = '#e5e5e5';
    return div;
  },
  /**
   * This function is called when the map is ready for the overlay to be attached
   *@function
   */
  onAdd() {
    const div = document.createElement('div');
    div.style.border = 'none';
    div.style.borderWidth = '0px';
    div.style.position = 'absolute';

    const img = document.createElement('img');
    img.src = this.image;
    img.style.width = '100%';
    img.style.height = '100%';
    div.appendChild(img);

    this.div = div;
    const panes = this.getPanes();
    panes.overlayLayer.appendChild(div);
  },
  /**
   * This function  will be called when the object (custom overlay) is first displayed
   * @function
   */
  draw() {
    const overlayProjection = this.getProjection();
    const sw = overlayProjection.fromLatLngToDivPixel(this.bounds.getSouthWest());
    const ne = overlayProjection.fromLatLngToDivPixel(this.bounds.getNorthEast());
    const div = this.div;
    this.div.id = 'layer';
    div.style.left = `${sw.x}px`;
    div.style.top = `${ne.y}px`;
    div.style.width = `${ne.x - sw.x}px`;
    div.style.height = `${sw.y - ne.y}px`;
    div.style.transform = `rotate(${this.rotation}rad)`;
  },
  /**
   * This function is used to clean up any elements added within the overlay.
   * @function
   */
  onRemove() {
    this.div.parentNode.removeChild(this.div);
    this.div = null;
  }
};
export const TILE_SIZE = 1000;
export default mapConsts;
/**
 * Mode when user adds beacon markers
 * @constant
 * @type {string}
 */
const BEACON_MODE = 'beacons';
/**
 * Mode when user adds reader markers
 * @constant
 * @type {string}
 */
const READER_MODE = 'readers';
/**
 * Mode when user adds vertex markers
 * @constant
 * @type {string}
 */
const ROUTE_MODE = 'routing';
/**
 * Mode when user adds area markers
 * @constant
 * @type {string}
 */
const AREAS_MODE = 'areas';
/**
 * Mode when user monitore people on the map
 * @constant
 * @type {string}
 */
const MONITORING_MODE = 'monitoring';
/**
 * Mode when user is able to draw on the map tile
 * @constant
 * @type {string}
 */
const DRAWING_MODE = 'drawing';
/**
 * Represents state of a dialog, where beacon's info can be configures
 * @constant
 * @type {string}
 */
const BEACON_DIALOG_OPEN = 'BEACON_DIALOG_OPEN';
/**
 * Represents state of a dialog, where beacon's info can be configures
 * @constant
 * @type {string}
 */
const BEACON_DIALOG_CLOSE = 'BEACON_DIALOG_CLOSE';
/**
 * Represents state of a dialog, where area's info can be configures
 * @constant
 * @type {string}
 */
const AREAS_DIALOG_OPEN = 'AREAS_DIALOG_OPEN';

const READER_DIALOG_OPEN = 'READER_DIALOG_OPEN';

const READER_DIALOG_CLOSE = 'READER_DIALOG_CLOSE';

const DISTANCE_DIALOG_OPEN = 'DISTANCE_DIALOG_OPEN';

const DISTANCE_DIALOG_CLOSE = 'DISTANCE_DIALOG_CLOSE';

/**
 * Represents state of a dialog, where area's info can be configures
 * @constant
 * @type {string}
 */
const AREAS_DIALOG_CLOSE = 'AREAS_DIALOG_CLOSE';

/**
 * Describes different modes
 * @type {{BEACON_MODE: string, ROUTE_MODE: string, AREAS_MODE: string}}
 */
const SCALE_MODE = 'scaling';

const GOOGLE = 'Google';

const OSM = 'OSM';

export const modes = {
  READER_MODE,
  BEACON_MODE,
  ROUTE_MODE,
  AREAS_MODE,
  SCALE_MODE,
  MONITORING_MODE,
  DRAWING_MODE
};
/**
 * Set of area/beacon dialog states
 * @constant
 * @type {object}
 */
export const dialog = {
  BEACON_DIALOG_OPEN,
  BEACON_DIALOG_CLOSE,
  AREAS_DIALOG_OPEN,
  AREAS_DIALOG_CLOSE,
  DISTANCE_DIALOG_OPEN,
  DISTANCE_DIALOG_CLOSE,
  READER_DIALOG_OPEN,
  READER_DIALOG_CLOSE
};

export const mapProviders = {
  GOOGLE,
  OSM
};
