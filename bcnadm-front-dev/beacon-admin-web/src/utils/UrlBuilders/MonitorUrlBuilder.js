import { Builder } from './Builder';

class MonitorUrlBuilder extends Builder {
  constructor(parentBuilder, value) {
    super();
    this.parent = parentBuilder;
    this.id = value || '';
    this.endpoint = 'monitor/history';
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

export { MonitorUrlBuilder };
