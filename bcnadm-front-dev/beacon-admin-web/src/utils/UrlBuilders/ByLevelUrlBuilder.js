import { Builder } from './Builder';

class ByLevelUrlBuilder extends Builder {
  constructor(parentBuilder, levelId) {
    super();
    this.parent = parentBuilder;
    this.id = levelId;
    this.endpoint = 'byLevel';
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

export { ByLevelUrlBuilder };
