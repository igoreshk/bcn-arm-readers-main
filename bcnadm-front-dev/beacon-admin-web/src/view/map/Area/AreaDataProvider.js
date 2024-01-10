import { AreaService } from 'src/service/AreaService';
import AbstractDataProvider from '../AbstractDataProvider';

class AreaDataProvider extends AbstractDataProvider {
  getDtos(levelId: String): Promise {
    return new Promise((resolve) => {
      AreaService.findAll(levelId)
        .then((areas) => {
          resolve(areas);
        })
        .catch((err) => {
          throw err;
        });
    });
  }

  getDto(areaId: String): Promise {
    return new Promise((resolve) => {
      AreaService.findOne(areaId)
        .then((area) => {
          resolve(area);
        })
        .catch((err) => {
          throw err;
        });
    });
  }

  removeAll(levelId: String): Promise {
    return new Promise((resolve) => {
      AreaService.clearAreas(levelId)
        .then(resolve())
        .catch((err) => {
          throw err;
        });
    });
  }

  removeDto(area: { entityId: String }): Promise {
    return new Promise((resolve) => {
      AreaService.deleteArea(area)
        .then(resolve())
        .catch((err) => {
          throw err;
        });
    });
  }

  saveDto(area: {}): Promise {
    return new Promise((resolve) => {
      AreaService.saveArea(area)
        .then((savedArea) => {
          resolve(savedArea);
        })
        .catch((err) => {
          throw err;
        });
    });
  }
}

const areaDataProvider = new AreaDataProvider();

export default Object.freeze(areaDataProvider);
