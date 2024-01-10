import { Builder } from './Builder';

class ScaleUrlBuilder extends Builder {
  constructor(parentBuilder, scaleId) {
    super();
    this.parent = parentBuilder;
    this.id = scaleId;
    this.endpoint = 'scale';
  }

  and() {
    return this.parent;
  }

  byVertex(vertexId) {
    this.endpoint = 'scale/byVertex';
    this.id = `${vertexId}`;
    return this;
  }

  byLevel(levelId) {
    this.endpoint = 'scale/byLevel';
    this.id = `${levelId}`;
    return this;
  }

  clear() {
    this.endpoint = 'scale/clear';
    this.id = undefined;
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

export { ScaleUrlBuilder };
