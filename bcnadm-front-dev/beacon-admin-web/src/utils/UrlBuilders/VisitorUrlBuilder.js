import { Builder } from './Builder';

class VisitorUrlBuilder extends Builder {
  constructor(parentBuilder, parentId) {
    super();
    this.parent = parentBuilder;
    this.id = parentId;
    this.endpoint = 'visitors';
  }

  and() {
    return this.parent;
  }

  img(visitorId) {
    this.endpoint = `visitors/${visitorId}/image`;
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

export { VisitorUrlBuilder };
