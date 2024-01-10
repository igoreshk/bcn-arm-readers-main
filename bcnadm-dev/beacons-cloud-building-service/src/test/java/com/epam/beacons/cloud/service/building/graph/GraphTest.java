package com.epam.beacons.cloud.service.building.graph;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.Arrays;
import java.util.List;
import org.junit.Before;
import org.junit.Test;

public class GraphTest {

    private Graph<Object, Object> graph;

    private Object unconnectedVertex;
    private Object vertex1;
    private Object vertex2;
    private Object vertex3;

    private Object edge1;
    private Object edge2;
    private Object edge3;

    @Before
    public void setUp() {
        graph = new Graph<>();

        vertex1 = new Object();
        vertex2 = new Object();
        vertex3 = new Object();
        unconnectedVertex = new Object();

        edge1 = new Object();
        edge2 = new Object();
        edge3 = new Object();

        graph.addVertex(unconnectedVertex);

        Object vertex6 = new Object();
        graph.addEdge(new Object(), vertex1, vertex6, 1);

        Object vertex7 = new Object();
        graph.addEdge(edge2, vertex1, vertex7, 1);

        Object vertex4 = new Object();
        graph.addEdge(new Object(), vertex6, vertex4, 1);

        graph.addEdge(new Object(), vertex6, vertex2, 2);
        graph.addEdge(edge3, vertex7, vertex4, 1);
        graph.addEdge(new Object(), vertex2, vertex3, 2);
        Object vertex8 = new Object();
        graph.addEdge(new Object(), vertex8, vertex2, 1);

        Object vertex5 = new Object();
        graph.addEdge(new Object(), vertex5, vertex2, 1);

        graph.addEdge(new Object(), vertex8, vertex5, 1);
        graph.addEdge(new Object(), vertex2, vertex4, 2);
        graph.addEdge(edge1, vertex4, vertex3, 1);
    }

    @Test
    public void testShortestPath() {
        List<Object> expectedPass = Arrays.asList(edge1, edge3, edge2);
        List<Object> actualPath = graph.findShortestPath(vertex3, vertex1);
        assertEquals(expectedPass, actualPath);
    }

    @Test
    public void testSameVertexRoute() {
        List<Object> path = graph.findShortestPath(vertex2, vertex2);
        assertEquals(0, path.size());
    }

    @Test
    public void testUnreachableVertex() {
        List<Object> path = graph.findShortestPath(vertex2, unconnectedVertex);
        assertEquals(0, path.size());
    }

    @Test(expected = GraphConsistencyException.class)
    public void testVertexConsistency() {
        Graph<Object, Object> graph = new Graph<>();
        Object vertex = new Object();
        graph.addVertex(vertex);
        graph.addVertex(vertex);
    }

    @Test(expected = GraphConsistencyException.class)
    public void testEdgeConsistency() {
        Graph<Object, Object> graph = new Graph<>();
        Object edge = new Object();
        graph.addEdge(edge, new Object(), new Object(), 1);
        graph.addEdge(edge, new Object(), new Object(), 1);
    }

    @Test(expected = IllegalArgumentException.class)
    public void testNullPathArguments() {
        Graph<Object, Object> graph = new Graph<>();
        graph.findShortestPath(null, null);
    }

    @Test(expected = IllegalArgumentException.class)
    public void testNullVertex() {
        Graph<Object, Object> graph = new Graph<>();
        graph.addVertex(null);
    }

    @Test(expected = IllegalArgumentException.class)
    public void testNullEdge() {
        Graph<Object, Object> graph = new Graph<>();
        graph.addEdge(null, null, null, 0);
    }

    @Test(expected = GraphConsistencyException.class)
    public void testPathConsistency() {
        Graph<Object, Object> graph = new Graph<>();
        graph.findShortestPath(new Object(), new Object());
    }
}
