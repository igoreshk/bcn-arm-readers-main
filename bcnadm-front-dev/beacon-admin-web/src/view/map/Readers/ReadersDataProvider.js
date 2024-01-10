import { ReadersService } from 'src/service/ReaderService';
import AbstractDataProvider from '../AbstractDataProvider';

class ReadersDataProvider extends AbstractDataProvider {
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
      ReadersService.findOne(markerId)
        .then((dto) => resolve(dto))
        .catch((err) => {
          throw err;
        });
    });
  }

  saveDto(dto) {
    return new Promise((resolve) => {
      ReadersService.saveReader(dto)
        .then(resolve())
        .catch((err) => {
          throw err;
        });
    });
  }

  getDtos(levelId) {
    return new Promise((resolve) => resolve(ReadersService.findByLevel(levelId)));
  }

  removeDto(dto) {
    return new Promise((resolve) => {
      ReadersService.deleteReader(dto)
        .then(resolve())
        .catch((err) => {
          throw err;
        });
    });
  }

  removeAll(levelId) {
    return new Promise((resolve) => {
      ReadersService.clear(levelId)
        .then(resolve)
        .catch((err) => {
          throw err;
        });
    });
  }
}

const readersDataProvider = new ReadersDataProvider();

export default Object.freeze(readersDataProvider);
