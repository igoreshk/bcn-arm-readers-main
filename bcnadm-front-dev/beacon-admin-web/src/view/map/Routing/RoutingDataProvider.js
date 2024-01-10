/* @flow*/
import { RouteService } from 'src/service/RouteService';
import AbstractDataProvider from '../AbstractDataProvider';

class RoutingDataProvider extends AbstractDataProvider {
  constructor() {
    super();
    this.getDto = this.getDto.bind(this);
    this.getEdge = this.getEdge.bind(this);
    this.getDtos = this.getDtos.bind(this);
    this.saveDto = this.saveDto.bind(this);
    this.saveEdge = this.saveEdge.bind(this);
    this.removeDto = this.removeDto.bind(this);
    this.removeAll = this.removeAll.bind(this);
    this.getDtosByEdge = this.getDtosByEdge.bind(this);
    this.deleteEdgeById = this.deleteEdgeById.bind(this);
    this.findEdgesByLevelId = this.findEdgesByLevelId.bind(this);
    this.findEdgeByDtosId = this.findEdgeByDtosId.bind(this);
  }

  findEdgeByDtosId(firstVertexId: String, secondVertexId: String): Promise {
    return new Promise((resolve) => {
      RouteService.findEdgeByVerticesId(firstVertexId, secondVertexId)
        .then((edge) => {
          resolve(edge);
        })
        .catch((err) => {
          throw err;
        });
    });
  }

  findEdgesByLevelId(levelId: String): Promise {
    return new Promise((resolve) => {
      RouteService.findEdgesByLevelId(levelId)
        .then((edges) => {
          resolve(edges);
        })
        .catch((err) => {
          throw err;
        });
    });
  }

  deleteEdgeById(edgeId: String): Promise {
    return new Promise((resolve) => {
      RouteService.deleteEdgeById(edgeId)
        .then(resolve())
        .catch((err) => {
          throw err;
        });
    });
  }

  getDtosByEdge(edge: {}): Promise {
    return new Promise((resolve) => {
      RouteService.findVerticesByEdge(edge)
        .then((dto) => {
          resolve(dto);
        })
        .catch((err) => {
          throw err;
        });
    });
  }

  getEdgeByDtoId(entityId: String): Promise {
    return new Promise((resolve) => {
      RouteService.findEdgeByVertexId(entityId)
        .then((dto) => {
          resolve(dto);
        })
        .catch((err) => {
          throw err;
        });
    });
  }

  getDtos(levelId: String): Promise {
    return new Promise((resolve) => {
      RouteService.findVerticesByLevel(levelId)
        .then((dtos) => {
          resolve(dtos);
        })
        .catch((err) => {
          throw err;
        });
    });
  }

  getDto(vertexId: String): Promise {
    return new Promise((resolve) => {
      RouteService.getVertex(vertexId)
        .then((dto) => {
          resolve(dto);
        })
        .catch((err) => {
          throw err;
        });
    });
  }

  getEdge(edgeId: String): Promise {
    return new Promise((resolve) => {
      RouteService.getEdge(edgeId)
        .then((edge) => {
          resolve(edge);
        })
        .catch((err) => {
          throw err;
        });
    });
  }

  saveDto(dto: {}): Promise {
    return new Promise((resolve) => {
      RouteService.saveVertex(dto)
        .then((vertex) => {
          resolve(vertex);
        })
        .catch((err) => {
          throw err;
        });
    });
  }

  saveEdge(edge: {}): Promise {
    return new Promise((resolve) => {
      RouteService.saveEdge(edge)
        .then(resolve())
        .catch((err) => {
          throw err;
        });
    });
  }

  removeDto(dto: { id: String }): Promise {
    return new Promise((resolve) => {
      RouteService.deleteVertex(dto)
        .then(resolve())
        .catch((err) => {
          throw err;
        });
    });
  }

  removeAll(levelId: String): Promise {
    return new Promise((resolve) => {
      RouteService.removeAllVerticesByLevelId(levelId)
        .then(resolve())
        .catch((err) => {
          throw err;
        });
    });
  }
}

const routingDataProvider = new RoutingDataProvider();

export default Object.freeze(routingDataProvider);
