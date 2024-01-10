/* eslint-disable no-unused-vars */
/* @flow*/

import AbstractMarkerHandler from 'src/view/map/AbstractMarkerHandler';
import { modes } from 'src/view/map/MapConsts';

class OSMMarkerHandler extends AbstractMarkerHandler {
  createMarker = (mapProvider, icon, location) => {
    return mapProvider.marker([location.latitude, location.longitude], { icon });
  };

  createPolyline = (mapProvider, map, coordinates) => {
    return mapProvider.polyline(coordinates, { color: '#B22746', dashArray: '10, 10' });
  };

  createScalingPolyline = (mapProvider, map, coordinates) => {
    return mapProvider.polyline(coordinates, { color: '#39C2D7', weight: 5 });
  };

  createIcon = (mapProvider, iconUrl, ICON_SIZE_IN_PIXELS, mode) => {
    const DIVIDER = 2;
    const iconSize = [ICON_SIZE_IN_PIXELS, ICON_SIZE_IN_PIXELS];
    const iconAnchor =
      mode === modes.SCALE_MODE || mode === modes.ROUTE_MODE
        ? [ICON_SIZE_IN_PIXELS / DIVIDER, ICON_SIZE_IN_PIXELS]
        : [ICON_SIZE_IN_PIXELS / DIVIDER, ICON_SIZE_IN_PIXELS / DIVIDER];

    return mapProvider.icon({
      iconUrl,
      iconSize,
      iconAnchor
    });
  };

  setVertexIcon = (mapProvider, marker, icon) => {
    const { L } = mapProvider;
    const ICON_SIZE_IN_PIXELS = 30;
    const newVertexIcon = this.createIcon(L, icon, ICON_SIZE_IN_PIXELS, modes.ROUTE_MODE);

    marker.setIcon(newVertexIcon);
  };

  // TODO: Find the way to implement setEdgeSeparateListener method for OSM (there is no "insert_at" event like in Google map)
  setEdgeSeparateListener = (mapProvider, map, edge, onEdgeSeparate) => {
    // Put leaflet code here
  };

  setScaleEdgeListener = (mapProvider, edge, showDialog) => {
    edge.on('click', () => {
      showDialog(edge);
    });
  };

  // TODO: Find the way to implement setEdgeMovingListener method for OSM (there is no "set_at" event like in Google map)
  setEdgeMovingListener = (mapProvider, map, edge, onEdgeMoving) => {
    // Put leaflet code here
  };

  setMapListener = (mapProvider, map, setMarker) => {
    map.on('click', (event) => {
      setMarker(event.latlng);
    });
  };

  setMapRightClickListener = (mapProvider, map, stopVerticesChain) => {
    map.on('click', () => {
      stopVerticesChain();
    });
  };

  setVertexClickListener = (mapProvider, marker, connectMarkers, changeVertexIcon) => {
    marker.on('click', () => {
      connectMarkers(marker);
      changeVertexIcon(marker);
    });
  };

  setDragEndListener = (mapProvider, marker, save) => {
    marker.on('dragend', () => {
      save(marker);
    });
  };

  setDragStartListener = (mapProvider, map, marker, onMarkerDragStart) => {
    marker.on('dragstart', () => {
      onMarkerDragStart(marker);
    });
  };

  setRightClickListener = (mapProvider, marker, remove) => {
    marker.on('contextmenu', () => {
      remove(marker);
    });
  };

  setClickListener = (mapProvider, marker, edit) => {
    marker.on('click', () => {
      edit(marker);
    });
  };

  removeScaleEdgeListener = (mapProvider, edge) => {
    edge.off('click');
  };

  removeEdgeSeparateListener = (mapProvider, edge) => {
    // Put leaflet code here
  };

  removeEdgeMovingListener = (mapProvider, edge) => {
    // Put leaflet code here
  };

  removeMapListener = (mapProvider, map) => {
    map.off('click');
  };

  removeMapRightClickListener = (mapProvider, map) => {
    map.off('click');
  };

  removeDragEndListener = (mapProvider, marker) => {
    marker.off('dragend');
  };

  removeDragStartListener = (mapProvider, marker) => {
    marker.off('dragstart');
  };

  removeRightClickListener = (mapProvider, marker) => {
    marker.off('contextmenu');
  };

  removeClickListener = (mapProvider, marker) => {
    marker.off('click');
  };

  removeVertexClickListener = (mapProvider, marker) => {
    marker.off('click');
  };

  setMarkerOnMap = (marker, map) => {
    map.eachLayer((layer) => {
      if (layer.id === 'editableLayer') {
        marker.addTo(layer);
      }
    });
  };

  setEdgeOnMap = (edge, map) => {
    map.eachLayer((layer) => {
      if (layer.id === 'editableLayer') {
        edge.addTo(layer);
      }
    });
  };

  removeMarkerFromMap = (marker, map) => {
    map.removeLayer(marker);
  };

  removeEdgeFromMap = (edge, map) => {
    map.removeLayer(edge);
  };

  setDraggable = (marker) => {
    if (marker.dragging) {
      marker.dragging.enable();
    }
  };

  setUndraggable = (marker) => {
    if (marker.dragging) {
      marker.dragging.disable();
    }
  };

  setInfoTooltip = (mapProvider, marker, map, info) => {
    info(marker)
      .then((tooltip) => {
        marker.bindPopup(tooltip);

        marker.on('mouseover', () => {
          marker.openPopup();
        });

        marker.on('mouseout', () => {
          marker.closePopup();
        });
      })
      .catch((err) => {
        throw err;
      });
  };

  setEdgeInfoTooltip = (mapProvider, edge, map, info) => {
    const SCALE_EDGE_MIN_STROKE_WEIGHT = 6;
    const SCALE_EDGE_MAX_STROKE_WEIGHT = 9;
    info(edge)
      .then((tooltip) => {
        edge.bindPopup(tooltip);

        edge.on('mouseover', () => {
          edge.setStyle({ weight: SCALE_EDGE_MAX_STROKE_WEIGHT });
          edge.openPopup();
        });

        edge.on('mouseout', () => {
          edge.setStyle({ weight: SCALE_EDGE_MIN_STROKE_WEIGHT });
          edge.closePopup();
        });
      })
      .catch((err) => {
        throw err;
      });
  };
}

const osmMarkerHandler = new OSMMarkerHandler();

export default Object.freeze(osmMarkerHandler);
