import { Builder } from './Builder';

class ReaderUrlBuilder extends Builder {
  constructor(parentBuilder, readerId) {
    super();
    this.parent = parentBuilder;
    this.id = readerId;
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
    if (this.id) {
      result += `/${this.id}`;
    }
    return result;
  }
}

export { ReaderUrlBuilder };
