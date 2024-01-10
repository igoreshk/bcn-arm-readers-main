import { Builder } from './Builder';

class BuildingUrlBuilder extends Builder {
  constructor(parentBuilder, buildingId) {
    super();
    this.parent = parentBuilder;
    this.id = buildingId;
    this.endpoint = 'buildings';
    this.img = false;
  }

  and() {
    return this.parent;
  }

  image() {
    this.img = true;
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
    if (this.img) {
      result += '/image';
    }
    return result;
  }
}

export { BuildingUrlBuilder };
