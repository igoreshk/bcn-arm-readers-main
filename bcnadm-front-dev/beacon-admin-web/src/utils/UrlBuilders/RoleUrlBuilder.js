import { Builder } from './Builder';

export class RoleUrlBuilder extends Builder {
  constructor(parentBuilder) {
    super();
    this.parent = parentBuilder;
    this.endpoint = 'roles';
  }

  and() {
    return this.parent;
  }

  new() {
    this.endpoint = 'roles/new';
    return this;
  }

  build() {
    let result = '';
    if (this.endpoint) {
      result += this.endpoint;
    }
    return result;
  }
}
