import { BeaconService } from 'src/service/BeaconService';
import AbstractDataProvider from '../AbstractDataProvider';

class BeaconsDataProvider extends AbstractDataProvider {
  constructor() {
    super();
    this.getDto = this.getDto.bind(this);
    this.getDtos = this.getDtos.bind(this);
    this.removeAll = this.removeAll.bind(this);
    this.removeDto = this.removeDto.bind(this);
    this.saveDto = this.saveDto.bind(this);
  }

  getDto(markerId) {
    return new Promise((resolve) => {
      BeaconService.findOne(markerId)
        .then((dto) => resolve(dto))
        .catch((err) => {
          throw err;
        });
    });
  }

  saveDto(dto) {
    return new Promise((resolve) => {
      BeaconService.saveBeacon(dto)
        .then(resolve())
        .catch((err) => {
          throw err;
        });
    });
  }

  getDtos(levelId) {
    return new Promise((resolve) => resolve(BeaconService.findByLevel(levelId)));
  }

  removeDto(dto) {
    return new Promise((resolve) => {
      BeaconService.deleteBeacon(dto)
        .then(resolve())
        .catch((err) => {
          throw err;
        });
    });
  }

  removeAll(levelId) {
    return new Promise((resolve) => {
      BeaconService.clearBeacons(levelId)
        .then(resolve)
        .catch((err) => {
          throw err;
        });
    });
  }
}

const beaconsDataProvider = new BeaconsDataProvider();

export default Object.freeze(beaconsDataProvider);
