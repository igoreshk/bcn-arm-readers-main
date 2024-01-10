import { LevelService } from 'src/service/LevelService';
import AbstractDataProvider from '../AbstractDataProvider';

class ScalingDataProvider extends AbstractDataProvider {
  constructor() {
    super();
    this.getDtos = this.getDtos.bind(this);
    this.getDto = this.getDto.bind(this);
    this.saveDto = this.saveDto.bind(this);
    this.saveEdge = this.saveEdge.bind(this);
    this.removeAll = this.removeAll.bind(this);
    this.getDtosByEdge = this.getDtosByEdge.bind(this);
    this.findEdgesByLevelId = this.findEdgesByLevelId.bind(this);
  }

  async findEdgesByLevelId(levelId) {
    const level = await LevelService.getLevel(levelId);
    if (level.scaleDistance === 0) {
      return [];
    }

    return [
      {
        startVertex: {
          coordinate: {
            latitude: level.scaleStartLatitude,
            longitude: level.scaleStartLongitude
          }
        },
        endVertex: {
          coordinate: {
            latitude: level.scaleEndLatitude,
            longitude: level.scaleEndLongitude
          }
        },
        distance: level.scaleDistance
      }
    ];
  }

  getDtosByEdge(edge) {
    return edge;
  }

  async getDtos(levelId) {
    const level = await LevelService.getLevel(levelId);
    const dtos = [];
    if (level.scaleStartLatitude === 0 && level.scaleStartLongitude === 0) {
      return dtos;
    }
    dtos.push({
      coordinate: {
        latitude: level.scaleStartLatitude,
        longitude: level.scaleStartLongitude
      },
      isStartVertex: true
    });
    if (level.scaleEndLatitude === 0 && level.scaleEndLongitude === 0) {
      return dtos;
    }
    dtos.push({
      coordinate: {
        latitude: level.scaleEndLatitude,
        longitude: level.scaleEndLongitude
      },
      isStartVertex: false
    });
    return dtos;
  }

  async getDto(levelId, isStartVertex) {
    const level = await LevelService.getLevel(levelId);
    return isStartVertex
      ? {
          coordinate: {
            latitude: level.scaleStartLatitude,
            longitude: level.scaleStartLongitude
          },
          isStartVertex: true
        }
      : {
          coordinate: {
            latitude: level.scaleEndLatitude,
            longitude: level.scaleEndLongitude
          },
          isStartVertex: false
        };
  }

  async saveDto(dto, levelId) {
    const level = await LevelService.getLevel(levelId);
    const vertex = dto.isStartVertex
      ? {
          scaleStartLatitude: dto.coordinate.latitude,
          scaleStartLongitude: dto.coordinate.longitude
        }
      : {
          scaleEndLatitude: dto.coordinate.latitude,
          scaleEndLongitude: dto.coordinate.longitude
        };
    return await LevelService.saveLevel(null, null, {
      ...level,
      ...vertex
    });
  }

  async saveEdge(buildingId, levelId, edge) {
    const { startVertex, endVertex, distance } = edge;
    const level = await LevelService.getLevel(levelId);
    return await LevelService.saveLevel(buildingId, levelId, {
      ...level,
      scaleStartLatitude: startVertex.coordinate.latitude,
      scaleStartLongitude: startVertex.coordinate.longitude,
      scaleEndLatitude: endVertex.coordinate.latitude,
      scaleEndLongitude: endVertex.coordinate.longitude,
      scaleDistance: distance
    });
  }

  async getEdge(levelId) {
    const level = await LevelService.getLevel(levelId);
    return {
      startVertex: {
        coordinate: {
          latitude: level.scaleStartLatitude,
          longitude: level.scaleStartLongitude
        }
      },
      endVertex: {
        coordinate: {
          latitude: level.scaleEndLatitude,
          longitude: level.scaleEndLongitude
        }
      },
      distance: level.scaleDistance
    };
  }

  async removeAll(levelId) {
    const level = await LevelService.getLevel(levelId);
    return await LevelService.saveLevel({
      ...level,
      scaleStartLatitude: 0,
      scaleStartLongitude: 0,
      scaleEndLatitude: 0,
      scaleEndLongitude: 0,
      scaleDistance: 0
    });
  }
}

const scalingDataProvider = new ScalingDataProvider();

export default Object.freeze(scalingDataProvider);
