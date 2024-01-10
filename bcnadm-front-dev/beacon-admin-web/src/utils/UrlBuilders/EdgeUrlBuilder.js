import { Builder } from './Builder';

class EdgeUrlBuilder extends Builder {
  constructor(parentBuilder, edgeId) {
    super();
    this.parent = parentBuilder;
    this.id = edgeId;
    this.endpoint = 'edges';
  }

  and() {
    return this.parent;
  }

  byVertex(vertexId) {
    this.endpoint = 'edges/byVertex';
    this.id = vertexId;
    return this;
  }

  byVertices(firstId, secondId) {
    this.endpoint = 'edges/byVertices';
    this.id = `${firstId}/${secondId}`;
    return this;
  }

  byLevel(levelId) {
    this.endpoint = 'edges/byLevel';
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

export { EdgeUrlBuilder };
