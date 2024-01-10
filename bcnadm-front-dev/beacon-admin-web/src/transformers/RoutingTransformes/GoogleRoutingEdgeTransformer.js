/* @flow*/
import googleMarkerHandler from 'src/view/map/MarkerHandler/GoogleMarkerHandler';

class GoogleRoutingEdgeTransformer {
  dtosToPolyline = (startVertex: { id: String }, endVertex: { id: String }, google: {}, map: {}, edge: {}) => {
    const coordinates = [
      {
        lat: startVertex.latitude,
        lng: startVertex.longitude
      },
      {
        lat: endVertex.latitude,
        lng: endVertex.longitude
      }
    ];
    const polyline = googleMarkerHandler.createPolyline(google, map, coordinates);

    const listenerMap = new Map([
      ['insert_at', null],
      ['set_at', null]
    ]);

    return Object.assign(polyline, {
      startVertexId: startVertex.entityId,
      endVertexId: endVertex.entityId,
      entityId: edge.entityId,
      listenerMap
    });
  };
}

const googleRoutingEdgeTransformer = new GoogleRoutingEdgeTransformer();

export default Object.freeze(googleRoutingEdgeTransformer);
