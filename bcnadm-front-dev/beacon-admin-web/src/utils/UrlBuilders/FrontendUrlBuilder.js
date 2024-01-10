import { Builder } from './Builder';

class FrontendUrlBuilder extends Builder {
  constructor(parentBuilder, id) {
    super();
    this.parent = parentBuilder;
    this.endpoint = 'frontend';
    this.id = id;
  }

  and() {
    return this.parent;
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

export { FrontendUrlBuilder };
