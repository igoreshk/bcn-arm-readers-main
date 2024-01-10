import { Builder } from './Builder';

class FilesUrlBuilder extends Builder {
  constructor(parentBuilder, parentId) {
    super();
    this.parent = parentBuilder;
    this.id = parentId;
    this.endpoint = '/files';
  }

  and() {
    return this.parent;
  }

  upload() {
    this.endpoint = '/files/upload';
    return this;
  }

  img() {
    this.endpoint = '/files/img';
    return this;
  }

  build() {
    let result = process.env.API_PREFIX;
    if (this.endpoint) {
      result += this.endpoint;
    }
    if (this.id) {
      result += `/${this.id}`;
    }
    return result;
  }
}

export { FilesUrlBuilder };
