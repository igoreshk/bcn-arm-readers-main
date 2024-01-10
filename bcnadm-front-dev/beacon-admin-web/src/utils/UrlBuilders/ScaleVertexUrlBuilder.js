import { Builder } from './Builder';

class ScaleVertexUrlBuilder extends Builder {
  constructor(parentBuilder, scaleVertexId) {
    super();
    this.parent = parentBuilder;
    this.id = scaleVertexId;
    this.endpoint = 'scale-vertex';
  }

  and() {
    return this.parent;
  }

  byEdge(edgeId) {
    this.endpoint = 'scale-vertex/byEdge';
    this.id = edgeId;
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

export { ScaleVertexUrlBuilder };
