import { Builder } from './Builder';

class AreaUrlBuilder extends Builder {
  constructor(parentBuilder, areaId) {
    super();
    this.parent = parentBuilder;
    this.id = areaId;
    this.endpoint = 'areas';
  }

  and() {
    return this.parent;
  }

  byLevel(levelId) {
    this.endpoint = 'areas/byLevelId';
    this.id = `${levelId}`;
    return this;
  }

  build() {
    let result = '';
    if (this.endpoint) {
      result += this.endpoint;
    }
    if (this.id) {
      result += `/${this.id}`;
    }
    return result;
  }
}

export { AreaUrlBuilder };
