/* @flow*/

import AbstractMarkerHandler from 'src/view/map/AbstractMarkerHandler';

class GoogleMarkerHandler extends AbstractMarkerHandler {
  createMarker = (google, icon, location) => {
    if (process.env.profile === 'autotest') {
      return new google.maps.Marker({
        position: location,
        zIndex: 100,
        icon,
        optimized: false,
        title: 'marker-on-map'
      });
    }
    return new google.maps.Marker({
      position: location,
      zIndex: 100,
      icon,
      optimized: false
    });
  };

  createPolyline = (google, map, coordinates) => {
    const lineSymbol = {
      path: 'M 0,-1 0,2',
      strokeOpacity: 1,
      scale: 2
    };
    return new google.maps.Polyline({
      path: coordinates,
      icons: [
        {
          icon: lineSymbol,
          offset: '0',
          repeat: '10px'
        }
      ],
      strokeColor: '#B22746',
      strokeOpacity: 0,
      strokeWeight: 5,
      editable: true,
      suppressUndo: true
    });
  };

  createScalingPolyline = (google, map, coordinates) => {
    return new google.maps.Polyline({
      path: coordinates,
      strokeColor: '#39C2D7',
      strokeOpacity: 1.0,
      strokeWeight: 5
    });
  };

  setVertexIcon = (google, marker, icon) => {
    marker.setIcon(icon);
  };

  setEdgeSeparateListener = (google, map, edge, onEdgeSeparate) => {
    google.maps.event.addListener(edge.getPath(), 'insert_at', () => {
      edge.setOptions({
        editable: true
      });
      const coordinates = edge.getPath().getArray();
      onEdgeSeparate(coordinates[1], edge);
    });
  };

  setScaleEdgeListener = (google, edge, showDialog) => {
    if (!edge.listenerMap.get('click')) {
      const listener = google.maps.event.addListener(edge, 'click', () => {
        showDialog(edge);
      });
      edge.listenerMap.set('click', listener);
    }
  };

  setEdgeMovingListener = (google, map, edge, onEdgeMoving) => {
    google.maps.event.addListener(edge.getPath(), 'set_at', () => {
      const coordinates = edge.getPath().getArray();
      onEdgeMoving(coordinates, edge);
    });
  };

  setMapListener = (google, map, setMarker) => {
    google.maps.event.clearListeners(map, 'click');
    google.maps.event.addListener(map, 'click', (event) => {
      setMarker(event.latLng, map, google);
    });
  };

  setMapRightClickListener = (google, map, stopVerticesChain) => {
    google.maps.event.addListener(map, 'rightclick', () => {
      stopVerticesChain();
    });
  };

  setVertexClickListener = (google, marker, connectMarkers, changeVertexIcon) => {
    if (!marker.listenerMap.get('click')) {
      const listener = google.maps.event.addListener(marker, 'click', () => {
        connectMarkers(marker);
        changeVertexIcon(marker);
      });
      marker.listenerMap.set('click', listener);
    }
  };

  setDragEndListener = (google, marker, save) => {
    if (!marker.listenerMap.get('dragend')) {
      const listener = google.maps.event.addListener(marker, 'dragend', () => {
        save(marker);
      });
      marker.listenerMap.set('dragend', listener);
    }
  };

  setDragStartListener = (google, map, marker, onMarkerDragStart) => {
    if (!marker.listenerMap.get('dragstart')) {
      const listener = google.maps.event.addListener(marker, 'dragstart', () => {
        onMarkerDragStart(marker);
      });
      marker.listenerMap.set('dragstart', listener);
    }
  };

  setRightClickListener = (google, marker, remove) => {
    if (!marker.listenerMap.get('rightclick')) {
      const listener = google.maps.event.addListener(marker, 'rightclick', () => {
        remove(marker);
      });
      marker.listenerMap.set('rightclick', listener);
    }
  };

  setClickListener = (google, marker, edit) => {
    if (!marker.listenerMap.get('click')) {
      const listener = google.maps.event.addListener(marker, 'click', () => {
        edit(marker);
      });
      marker.listenerMap.set('click', listener);
    }
  };

  removeScaleEdgeListener = (google, edge) => {
    if (edge.listenerMap.get('click')) {
      google.maps.event.removeListener(edge.listenerMap.get('click'));
      edge.listenerMap.set('click', null);
    }
  };

  removeEdgeSeparateListener = (google, edge) => {
    edge.setOptions({
      editable: false
    });
    if (edge.listenerMap.get('insert_at')) {
      google.maps.event.removeListener(edge.listenerMap.get('insert_at'));
      edge.listenerMap.set('insert_at', null);
    }
  };

  removeEdgeMovingListener = (google, edge) => {
    if (edge.listenerMap.get('set_at')) {
      google.maps.event.removeListener(edge.listenerMap.get('set_at'));
      edge.listenerMap.set('set_at', null);
    }
  };

  removeMapListener = (google, map) => {
    google.maps.event.clearListeners(map, 'click');
  };

  removeMapRightClickListener = (google, map) => {
    google.maps.event.clearListeners(map, 'rightclick');
  };

  removeDragEndListener = (google, marker) => {
    if (marker.listenerMap.get('dragend')) {
      google.maps.event.removeListener(marker.listenerMap.get('dragend'));
      marker.listenerMap.set('dragend', null);
    }
  };

  removeDragStartListener = (google, marker) => {
    if (marker.listenerMap.get('dragstart')) {
      google.maps.event.removeListener(marker.listenerMap.get('dragstart'));
      marker.listenerMap.set('dragstart', null);
    }
  };

  removeRightClickListener = (google, marker) => {
    if (marker.listenerMap.get('rightclick')) {
      google.maps.event.removeListener(marker.listenerMap.get('rightclick'));
      marker.listenerMap.set('rightclick', null);
    }
  };

  removeClickListener = (google, marker) => {
    if (marker.listenerMap.get('click')) {
      google.maps.event.removeListener(marker.listenerMap.get('click'));
      marker.listenerMap.set('click', null);
    }
  };

  removeVertexClickListener = (google, marker) => {
    if (marker.listenerMap.get('click')) {
      google.maps.event.removeListener(marker.listenerMap.get('click'));
      marker.listenerMap.set('click', null);
    }
  };

  setMarkerOnMap = (marker, map) => {
    marker.setMap(map);
  };

  setEdgeOnMap = (edge, map) => {
    edge.setMap(map);
  };

  removeMarkerFromMap = (marker) => {
    marker.setMap(null);
  };

  removeEdgeFromMap = (edge) => {
    edge.setMap(null);
  };

  setDraggable = (marker) => {
    marker.setDraggable(true);
  };

  setUndraggable = (marker) => {
    marker.setDraggable(false);
  };

  setInfoTooltip = (google, marker, map, info) => {
    if (!marker.listenerMap.get('mouseover')) {
      info(marker)
        .then((toolTip) => {
          const infowindow = new google.maps.InfoWindow({
            content: toolTip
          });
          const overListener = marker.addListener('mouseover', () => {
            infowindow.open(map, marker);
            if (marker.icon.fillColor) {
              marker.icon.fillColor = 'blue';
              marker.setIcon(marker.icon);
            }
          });
          const outListener = marker.addListener('mouseout', () => {
            infowindow.close(map, marker);
            if (marker.icon.fillColor) {
              marker.icon.fillColor = 'currentColor';
              marker.setIcon(marker.icon);
            }
          });
          marker.listenerMap.set('mouseover', overListener);
          marker.listenerMap.set('mouseout', outListener);
        })
        .catch((err) => {
          throw err;
        });
    }
  };

  setEdgeInfoTooltip = (google, edge, map, info) => {
    const SCALE_EDGE_MIN_STROKE_WEIGHT = 6;
    const SCALE_EDGE_MAX_STROKE_WEIGHT = 9;
    if (!edge.listenerMap.get('mouseover')) {
      info(edge)
        .then((toolTip) => {
          const infowindow = new google.maps.InfoWindow({
            content: toolTip
          });
          const overListener = edge.addListener('mouseover', (event) => {
            edge.setOptions({ strokeWeight: SCALE_EDGE_MAX_STROKE_WEIGHT });
            infowindow.setPosition(event.latLng);
            infowindow.open(map, edge);
          });
          const outListener = edge.addListener('mouseout', () => {
            edge.setOptions({ strokeWeight: SCALE_EDGE_MIN_STROKE_WEIGHT });
            infowindow.close(map, edge);
          });
          edge.listenerMap.set('mouseover', overListener);
          edge.listenerMap.set('mouseout', outListener);
        })
        .catch((err) => {
          throw err;
        });
    }
  };
}

const googleMarkerHandler = new GoogleMarkerHandler();

export default Object.freeze(googleMarkerHandler);
