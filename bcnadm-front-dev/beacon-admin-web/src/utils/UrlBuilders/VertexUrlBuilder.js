import { Builder } from './Builder';

class VertexUrlBuilder extends Builder {
  constructor(parentBuilder, vertexId) {
    super();
    this.parent = parentBuilder;
    this.id = vertexId;
    this.endpoint = 'vertices';
  }

  and() {
    return this.parent;
  }

  byEdge(edgeId) {
    this.endpoint = 'vertices/byEdge';
    this.id = edgeId;
    return this;
  }

  byLevel(levelId) {
    this.endpoint = 'vertices/byLevel';
    this.id = levelId;
    return this;
  }

  clear() {
    this.endpoint = 'vertices/clear';
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

export { VertexUrlBuilder };
