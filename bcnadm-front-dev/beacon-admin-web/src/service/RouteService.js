// @flow

import { linkBuilder } from 'src/utils/UrlBuilders/linkBuilder';
import axios from 'axios';

const RouteService = {};

/**
 * Request for getting vertices by level is performed
 * passing response's data forward as resolve function parameter
 * @return {Promise}
 */
RouteService.findVerticesByLevel = (levelId) =>
  axios.get(linkBuilder().vertex().byLevel(levelId).and().build()).then((response) => response.data);

/**
 * Request for getting edges by vertex id is performed
 * passing response's data forward as resolve function parameter
 * @return {Promise}
 */
RouteService.findEdgeByVertexId = (vertexId) =>
  axios.get(linkBuilder().edge().byVertex(vertexId).and().build()).then((response) => response.data);

/**
 * Request for getting vertex by edge is performed
 * passing response's data forward as resolve function parameter
 * @return {Promise}
 */
RouteService.findVerticesByEdge = (edge) =>
  axios.get(linkBuilder().vertex().byEdge(edge.entityId).and().build()).then((response) => ({
    startVertex: response.data[0],
    endVertex: response.data[1]
  }));

/**
 * Save vertex using post request
 * returning Promise that allows caller to wait
 * for request completion
 * @return {Promise}
 */
RouteService.saveVertex = (vertex) =>
  axios({
    headers: {
      'Accept': 'application/json'
    },
    method: 'post',
    url: linkBuilder().vertex().and().build(),
    data: vertex
  }).then((response) => response.data);

/**
 * Save edge using post request
 * returning Promise that allows caller to wait
 * for request completion
 * @return {Promise}
 */
RouteService.saveEdge = (edge) =>
  axios({
    headers: {
      'Accept': 'application/json'
    },
    method: 'post',
    url: linkBuilder().edge().and().build(),
    data: edge
  }).then((response) => response.data);

/**
 * Delete vertex using delete request
 * returning Promise that allows caller to wait
 * for request completion
 * @return {Promise}
 */
RouteService.deleteVertex = (vertex) =>
  axios.delete(linkBuilder().vertex(vertex.entityId).and().build()).then((response) => response.data);

/**
 * Request for getting edge by edgeId
 * @param buildingId
 * @param levelId
 * @param edgeId identifier of edge
 * @returns {Promise}
 */
RouteService.getEdge = (edgeId) =>
  axios.get(linkBuilder().edge(edgeId).and().build()).then((response) => response.data);

/**
 * Request for getting vertex by vertexId
 * @param buildingId
 * @param levelId
 * @param vertexId identifier of vertex
 * @returns {Promise}
 */
RouteService.getVertex = (vertexId) =>
  axios.get(linkBuilder().vertex(vertexId).and().build()).then((response) => response.data);

/**
 * Request for deleting edge by edgeId
 * @param buildingId
 * @param levelId
 * @param edgeId identifier of edge
 * @returns {Promise}
 */
RouteService.deleteEdgeById = (edgeId) =>
  axios.delete(linkBuilder().edge(edgeId).and().build()).then((response) => response.data);

/**
 * Request for getting all edges on level
 * @param buildingId identifier of building
 * @param levelId identifier of level
 * @returns {Promise}
 */
RouteService.findEdgesByLevelId = (levelId) =>
  axios.get(linkBuilder().edge().byLevel(levelId).and().build()).then((response) => response.data);

/**
 * Request for getting edge by vertices
 * @param buildingId
 * @param levelId
 * @param firstVertexId identifier of vertex
 * @param secondVertexId identifier of vertex
 * @returns {Promise}
 */
RouteService.findEdgeByVerticesId = (firstVertexId, secondVertexId) =>
  axios
    .get(linkBuilder().edge().byVertices(firstVertexId, secondVertexId).and().build())
    .then((response) => response.data);

/**
 * Delete vertices by specific level using delete request
 * returning Promise that allows caller to wait
 * for request completion
 * @return {Promise}
 */
RouteService.removeAllVerticesByLevelId = (levelId) =>
  axios.delete(linkBuilder().vertex().byLevel(levelId).and().build());

export { RouteService };
