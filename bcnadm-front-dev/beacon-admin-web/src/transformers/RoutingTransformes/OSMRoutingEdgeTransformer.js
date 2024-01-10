/* @flow */
import osmMarkerHandler from 'src/view/map/MarkerHandler/OSMMarkerHandler';

class OSMRoutingEdgeTransformer {
  dtosToPolyline = (
    startVertex: { entityId: String },
    endVertex: { entityId: String },
    mapProvider: {},
    map: {},
    edge: { entityId: String }
  ) => {
    const { L } = mapProvider;
    const coordinates = [
      [startVertex.latitude, startVertex.longitude],
      [endVertex.latitude, endVertex.longitude]
    ];

    const polyline = osmMarkerHandler.createPolyline(L, map, coordinates);

    return Object.assign(polyline, {
      startVertexId: startVertex.entityId,
      endVertexId: endVertex.entityId,
      entityId: edge.entityId
    });
  };
}

const osmRoutingEdgeTransformer = new OSMRoutingEdgeTransformer();

export default Object.freeze(osmRoutingEdgeTransformer);
