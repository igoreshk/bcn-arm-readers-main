import { Builder } from './Builder';

class ReadersUrlBuilder extends Builder {
  constructor(parentBuilder) {
    super();
    this.parent = parentBuilder;
    this.endpoint = 'readers';
  }

  and() {
    return this.parent;
  }

  build() {
    let result = '';
    if (this.endpoint) {
      result += this.endpoint;
    }
    return result;
  }
}

export { ReadersUrlBuilder };
