package com.epam.beacons.cloud.service.building.graph;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.PriorityQueue;
import java.util.Queue;

public class Graph<V, E> {

    private class EdgeData {

        private final double weight;
        private final V startVertex;
        private final V endVertex;

        public EdgeData(double weight, V startVertex, V endVertex) {
            this.weight = weight;
            this.startVertex = startVertex;
            this.endVertex = endVertex;
        }

        public double getWeight() {
            return weight;
        }

        public V getOther(V vertex) {
            if (vertex == startVertex) {
                return endVertex;
            } else if (vertex == endVertex) {
                return startVertex;
            }
            throw new GraphConsistencyException("Provided vertex is not connected by this edge");
        }
    }

    private class VertexData implements Iterable<E> {

        private final List<E> vertexEdges = new ArrayList<>();

        private void addEdge(E edge) {
            vertexEdges.add(edge);
        }

        @Override
        public Iterator<E> iterator() {
            return vertexEdges.iterator();
        }
    }

    private final Map<V, VertexData> vertices = new HashMap<>();
    private final Map<E, EdgeData> edges = new HashMap<>();

    public void addVertex(V vertex) {
        if (vertex == null) {
            throw new IllegalArgumentException("Vertex cannot be null");
        }
        if (vertices.containsKey(vertex)) {
            throw new GraphConsistencyException("Unable to add existing vertex to the graph");
        }
        vertices.put(vertex, new VertexData());
    }

    public void addEdge(E edge, V start, V end, double weight) {
        if (edge == null || start == null || end == null) {
            throw new IllegalArgumentException("Edge and its vertices cannot be null");
        }
        if (edges.containsKey(edge)) {
            throw new GraphConsistencyException("Unable to add existing edge to the graph");
        }
        edges.put(edge, new EdgeData(weight, start, end));
        vertices.computeIfAbsent(start, k -> new VertexData()).addEdge(edge);
        vertices.computeIfAbsent(end, k -> new VertexData()).addEdge(edge);
    }

    public List<E> findShortestPath(V start, V end) {
        if (start == null || end == null) {
            throw new IllegalArgumentException("Start and end vertices should not be null");
        }
        if (!vertices.containsKey(start) || !vertices.containsKey(end)) {
            throw new GraphConsistencyException("One or both provided vertices are not part of this graph");
        }
        if (Objects.equals(start, end)) {
            return Collections.emptyList();
        }

        Map<V, List<E>> paths = new HashMap<>();
        Queue<V> priorityQueue = new PriorityQueue<>(Comparator.comparingDouble(v -> getPathLength(paths.get(v))));
        paths.put(start, new ArrayList<>());
        priorityQueue.add(start);

        V current;
        while ((current = priorityQueue.poll()) != null) {
            for (E edge : vertices.get(current)) {
                V other = edges.get(edge).getOther(current);
                if (getPathLength(paths.get(current)) + edges.get(edge).getWeight() < getPathLength(paths.get(other))) {
                    List<E> path = new ArrayList<>(paths.get(current));
                    path.add(edge);
                    paths.put(other, path);
                    priorityQueue.add(other);
                }
            }
        }

        List<E> path = paths.get(end);
        return path == null ? Collections.emptyList() : path;
    }

    private double getPathLength(List<E> path) {
        if (path == null) {
            return Double.MAX_VALUE;
        }
        double result = 0;
        for (E edge : path) {
            result += edges.get(edge).getWeight();
        }
        return result;
    }

}
