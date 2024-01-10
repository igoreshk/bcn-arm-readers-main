import { Builder } from './Builder';

class LogoutUrlBuilder extends Builder {
  constructor(parentBuilder, parentId) {
    super();
    this.parent = parentBuilder;
    this.id = parentId;
    this.endpoint = 'logout';
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

export { LogoutUrlBuilder };
