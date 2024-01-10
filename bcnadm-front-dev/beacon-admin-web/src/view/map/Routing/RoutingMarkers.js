import React from 'react';
import { connect } from 'react-redux';
import { withLocalize } from 'react-localize-redux';
import PropTypes from 'prop-types';

import googleRoutingEdgeTransformer from 'src/transformers/RoutingTransformes/GoogleRoutingEdgeTransformer';
import googleRoutingTransformer from 'src/transformers/RoutingTransformes/GoogleRoutingTransformer';
import googleMarkerHandler from 'src/view/map/MarkerHandler/GoogleMarkerHandler';
import osmRoutingEdgeTransformer from 'src/transformers/RoutingTransformes/OSMRoutingEdgeTransformer';
import osmRoutingTransformer from 'src/transformers/RoutingTransformes/OSMRoutingTransformer';
import osmMarkerHandler from 'src/view/map/MarkerHandler/OSMMarkerHandler';
import { setMapRenderedStatus } from 'src/reducers/mapSettingsReducer/mapSettingsSlice';
import { addPopupMessageText } from 'src/actions/popupMessage';
import { ERROR } from 'src/utils/popUpConsts';
import { LocationService } from 'src/utils/LocationService';
import { mapProviders } from 'src/view/map/MapConsts';
import images from 'src/view/images';
import EdgeMarkerHolder from '../EdgeMarkerHolder';
import routingDataProvider from './RoutingDataProvider';
import AbstractWithMarkers from '../AbstractWithMarkers';

class RoutingMarkers extends AbstractWithMarkers {
  constructor(props) {
    super(props);
    this.state = {
      vertices: {
        startVertexId: null,
        endVertexId: null
      },
      currentVertexId: null,
      update: false,
      markerDragged: null
    };

    this.routingTransformer = null;
    this.routingEdgeTransformer = null;
    this.markerHandler = null;
    this.chooseMapProvider();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.selectedMapProviderName !== this.props.selectedMapProviderName) {
      this.chooseMapProvider();
    }
  }

  componentWillUnmount() {
    this.props.setMapRenderedStatus({ isMapRendered: false });
  }

  chooseMapProvider = () => {
    if (this.props.selectedMapProviderName === mapProviders.OSM) {
      this.routingEdgeTransformer = osmRoutingEdgeTransformer;
      this.routingTransformer = osmRoutingTransformer;
      this.markerHandler = osmMarkerHandler;
    } else {
      this.routingEdgeTransformer = googleRoutingEdgeTransformer;
      this.routingTransformer = googleRoutingTransformer;
      this.markerHandler = googleMarkerHandler;
    }
  };

  loadMarkers = async () => {
    const { level: levelId } = this.props.match.params;
    const { selectedMap: map, selectedMapProvider: mapProvider } = this.props;

    const dtos = await routingDataProvider.getDtos(levelId);
    const vertices = dtos.map((dto) => this.routingTransformer.dtoToMarker(dto, mapProvider));
    this.changeVertexIcon(vertices, mapProvider);
    const edgeDtos = await routingDataProvider.findEdgesByLevelId(levelId);
    const verticesByEdgeDtos = await Promise.all(edgeDtos.map((edge) => routingDataProvider.getDtosByEdge(edge)));
    const edges = verticesByEdgeDtos.map((dto, index) =>
      this.routingEdgeTransformer.dtosToPolyline(dto.startVertex, dto.endVertex, mapProvider, map, edgeDtos[index])
    );
    return { vertices, edges };
  };

  setMapListener = () => {
    const { edit: editMode } = this.props.match.params;
    const { selectedMap: map, selectedMapProvider: mapProvider } = this.props;
    this.markerHandler.removeMapListener(mapProvider, map);
    this.markerHandler.removeMapRightClickListener(mapProvider, map);
    if (editMode) {
      this.markerHandler.setMapListener(mapProvider, map, this.onMarkerCreate);
      this.markerHandler.setMapRightClickListener(mapProvider, map, this.stopVerticesChain);
    }
  };

  setMarkerListeners = (markers, edges) => {
    const { edit: editMode } = this.props.match.params;
    const { selectedMap: map, selectedMapProvider: mapProvider } = this.props;
    if (editMode) {
      markers.forEach((marker) => {
        this.markerHandler.setRightClickListener(mapProvider, marker, this.onMarkerRemove);
        this.markerHandler.setDraggable(marker);
        this.markerHandler.setDragEndListener(mapProvider, marker, this.onMarkerDragEnd);
        this.markerHandler.setDragStartListener(mapProvider, map, marker, this.onMarkerDragStart);
        this.markerHandler.setVertexClickListener(mapProvider, marker, this.connectMarkers, this.setActiveVertexIcon);
      });
      edges.forEach((edge) => {
        this.markerHandler.setEdgeSeparateListener(mapProvider, map, edge, this.onEdgeSeparate);
        this.markerHandler.setEdgeMovingListener(mapProvider, map, edge, this.onEdgeMove);
      });
    } else {
      markers.forEach((marker) => {
        this.markerHandler.removeClickListener(mapProvider, marker);
        this.markerHandler.removeRightClickListener(mapProvider, marker);
        this.markerHandler.setUndraggable(marker);
        this.markerHandler.removeDragEndListener(mapProvider, marker);
        this.markerHandler.removeDragStartListener(mapProvider, marker);
        this.markerHandler.removeVertexClickListener(mapProvider, marker);
      });
      edges.forEach((edge) => {
        this.markerHandler.removeEdgeSeparateListener(mapProvider, edge);
        this.markerHandler.removeEdgeMovingListener(mapProvider, edge);
      });
    }
  };

  changeEditMode = () => {
    const { history } = this.props;
    const { building: buildingId, level: levelId, edit: editMode } = this.props.match.params;
    if (editMode) {
      history.push(LocationService.getRoutingLocation(buildingId, levelId, false));
    } else {
      history.push(LocationService.getRoutingLocation(buildingId, levelId, true));
    }
  };

  changeVertexIcon = (markers, selectedMapProvider) => {
    markers.forEach((marker) => {
      if (marker.entityId === this.state.currentVertexId) {
        this.markerHandler.setVertexIcon(selectedMapProvider, marker, images.selectedVertexIcon);
      } else {
        this.markerHandler.setVertexIcon(selectedMapProvider, marker, images.vertexIcon);
      }
    });
  };

  setActiveVertexIcon = (marker) => {
    const { selectedMapProvider } = this.props;
    this.markerHandler.setVertexIcon(selectedMapProvider, marker, images.selectedVertexIcon);
    this.setState({
      vertices: {
        startVertexId: marker.entityId,
        endVertexId: null
      },
      currentVertexId: marker.entityId
    });
  };

  onMarkerCreate = async (location) => {
    try {
      const { vertices } = this.state;
      const { level: levelId } = this.props.match.params;
      const { selectedMapProviderName } = this.props;
      const lat = selectedMapProviderName === mapProviders.GOOGLE ? location.lat() : location.lat;
      const lng = selectedMapProviderName === mapProviders.GOOGLE ? location.lng() : location.lng;

      const newVertex = {
        latitude: lat,
        longitude: lng,
        levelId,
        type: 'NONE'
      };
      const vertex = await routingDataProvider.saveDto(newVertex);

      if (vertices.startVertexId === null) {
        this.setState({
          vertices: {
            startVertexId: vertex.entityId,
            endVertexId: null
          },
          currentVertexId: vertex.entityId
        });
      } else if (vertices.startVertexId !== null && vertices.endVertexId === null) {
        this.setState({
          vertices: {
            startVertexId: vertices.startVertexId,
            endVertexId: vertex.entityId
          },
          currentVertexId: vertex.entityId
        });
        await routingDataProvider.saveEdge({
          startVertexId: vertices.startVertexId,
          endVertexId: vertex.entityId
        });
      } else if (vertices.startVertexId !== null && vertices.endVertexId !== null) {
        this.setState({
          vertices: {
            startVertexId: vertices.endVertexId,
            endVertexId: vertex.entityId
          },
          currentVertexId: vertex.entityId
        });
        await routingDataProvider.saveEdge({
          startVertexId: vertices.endVertexId,
          endVertexId: vertex.entityId
        });
      }
      this.setState((prevState) => ({
        update: !prevState.update
      }));
    } catch (err) {
      this.props.addPopupMessageText(this.props.translate('mapAlerts.saveError'), ERROR);
      throw err;
    }
  };

  stopVerticesChain = () => {
    this.setState((prevState) => ({
      vertices: {
        startVertexId: null,
        endVertexId: null
      },
      currentVertexId: null,
      update: !prevState.update
    }));
  };

  onMarkerDragStart = (marker) => {
    this.setState({ markerDragged: marker });
  };

  onMarkerDragEnd = async (marker) => {
    try {
      await routingDataProvider.saveDto(this.routingTransformer.markerToDto(marker));
      this.setState((prevState) => ({
        update: !prevState.update
      }));
    } catch (err) {
      this.props.addPopupMessageText(this.props.translate('mapAlerts.saveError'), ERROR);
      throw err;
    }
  };

  connectMarkers = async (marker) => {
    try {
      if (this.state.currentVertexId !== null && this.state.currentVertexId !== marker.entityId) {
        await routingDataProvider.saveEdge({
          startVertexId: this.state.currentVertexId,
          endVertexId: marker.entityId
        });
        this.setState((prevState) => ({
          vertices: {
            startVertexId: marker.entityId,
            endVertexId: null
          },
          currentVertexId: marker.entityId,
          update: !prevState.update
        }));
      }
      this.setState((prevState) => ({
        update: !prevState.update
      }));
    } catch (err) {
      this.props.addPopupMessageText(this.props.translate('mapAlerts.saveError'), ERROR);
      throw err;
    }
  };

  onEdgeSeparate = async (coordinate, edge) => {
    try {
      const { level: levelId } = this.props.match.params;
      const { selectedMapProviderName } = this.props;
      const lat = selectedMapProviderName === mapProviders.GOOGLE ? coordinate.lat() : coordinate.lat;
      const lng = selectedMapProviderName === mapProviders.GOOGLE ? coordinate.lng() : coordinate.lng;

      const newVertex = {
        latitude: lat,
        longitude: lng,
        levelId,
        type: 'NONE'
      };
      const vertices = await Promise.all([
        routingDataProvider.saveDto(newVertex),
        routingDataProvider.getDtosByEdge(edge)
      ]);
      const newEdge = await routingDataProvider.findEdgeByDtosId(
        vertices[1].startVertex.entityId,
        vertices[1].endVertex.entityId
      );
      const leftEdge = {
        startVertexId: newEdge.startVertexId,
        endVertexId: vertices[0].entityId
      };
      const rightEdge = {
        startVertexId: vertices[0].entityId,
        endVertexId: newEdge.endVertexId
      };
      await Promise.all([
        routingDataProvider.deleteEdgeById(edge.entityId),
        routingDataProvider.saveEdge(leftEdge),
        routingDataProvider.saveEdge(rightEdge)
      ]);
      this.setState((prevState) => ({
        update: !prevState.update
      }));
    } catch (err) {
      this.props.addPopupMessageText(this.props.translate('mapAlerts.saveError'), ERROR);
      throw err;
    }
  };

  onEdgeMove = async (coordinates, edge) => {
    try {
      const { selectedMapProviderName } = this.props;
      const vertices = await Promise.all([
        routingDataProvider.getDto(edge.startVertexId),
        routingDataProvider.getDto(edge.endVertexId)
      ]);

      const lat0 = selectedMapProviderName === mapProviders.GOOGLE ? coordinates[0].lat() : coordinates[0].lat;
      const lng0 = selectedMapProviderName === mapProviders.GOOGLE ? coordinates[0].lng() : coordinates[0].lng;
      const lat1 = selectedMapProviderName === mapProviders.GOOGLE ? coordinates[1].lat() : coordinates[1].lat;
      const lng1 = selectedMapProviderName === mapProviders.GOOGLE ? coordinates[1].lng() : coordinates[1].lng;

      if (vertices[0].longitude === lng0 && vertices[0].latitude === lat0) {
        await routingDataProvider.saveDto({
          ...vertices[1],
          longitude: lng1,
          latitude: lat1
        });
      }
      if (vertices[1].longitude === lng1 && vertices[1].latitude === lat1) {
        await routingDataProvider.saveDto({
          ...vertices[0],
          longitude: lng0,
          latitude: lat0
        });
      }
      this.setState((prevState) => ({
        update: !prevState.update
      }));
    } catch (err) {
      this.props.addPopupMessageText(this.props.translate('mapAlerts.saveError'), ERROR);
      throw err;
    }
  };

  onMarkerRemove = async (marker) => {
    try {
      await routingDataProvider.removeDto(this.routingTransformer.markerToDto(marker));
      this.stopVerticesChain();
    } catch (err) {
      this.props.addPopupMessageText(this.props.translate('mapAlerts.deleteError'), ERROR);
      throw err;
    }
  };

  onRemoveAllMarkers = async () => {
    try {
      const { level: levelId } = this.props.match.params;
      await routingDataProvider.removeAll(levelId);
      this.stopVerticesChain();
    } catch (err) {
      this.props.addPopupMessageText(this.props.translate('mapAlerts.deleteError'), ERROR);
      throw err;
    }
  };

  render() {
    return (
      <EdgeMarkerHolder
        loadMarkers={this.loadMarkers}
        loadEdges={this.loadEdges}
        update={this.state.update}
        markerDragged={this.state.markerDragged}
        setMapListener={this.setMapListener}
        setMarkerListeners={this.setMarkerListeners}
        markerHandler={this.markerHandler}
        onRemoveAllMarkers={this.onRemoveAllMarkers}
        changeEditMode={this.changeEditMode}
        changeVertexIcon={this.changeVertexIcon}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  selectedMap: state.mapSettings.selectedMap,
  selectedMapProvider: state.mapSettings.selectedMapProvider,
  selectedMapProviderName: state.mapSettings.selectedMapProviderName
});

const mapDispatchToProps = {
  setMapRenderedStatus,
  addPopupMessageText
};

RoutingMarkers.propTypes = {
  selectedMap: PropTypes.object.isRequired,
  selectedMapProvider: PropTypes.object.isRequired,
  selectedMapProviderName: PropTypes.string.isRequired,
  setMapRenderedStatus: PropTypes.func.isRequired,
  addPopupMessageText: PropTypes.func.isRequired
};

export default withLocalize(connect(mapStateToProps, mapDispatchToProps)(RoutingMarkers));
