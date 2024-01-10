import { Builder } from './Builder';

class UserUrlBuilder extends Builder {
  constructor(parentBuilder, userId) {
    super();
    this.parent = parentBuilder;
    this.id = userId;
    this.login = null;
    this.imagePart = null;
    this.loginToCheck = null;
    this.emailToCheck = null;
    this.newLogin = null;
    this.newEmail = null;
    this.endpoint = 'users';
  }

  byLogin(login) {
    this.endpoint = `${this.endpoint}/by-login`;
    this.login = login;
    return this;
  }

  current() {
    this.id = 'current';
    return this;
  }

  image() {
    this.imagePart = 'image';
    return this;
  }

  checkLogin(login) {
    this.endpoint = `${this.endpoint}/check-login`;
    this.loginToCheck = login;
    return this;
  }

  checkEmail(email) {
    this.endpoint = `${this.endpoint}/check-email`;
    this.loginToCheck = email;
    return this;
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
    if (this.login) {
      result += `/${this.login}`;
    }
    if (this.loginToCheck) {
      result += `/${this.loginToCheck}`;
    }
    if (this.emailToCheck) {
      result += `/${this.emailToCheck}`;
    }
    if (this.newLogin) {
      result += `/${this.newLogin}`;
    }
    if (this.newEmail) {
      result += `/${this.newEmail}`;
    }
    if (this.imagePart) {
      result += `/${this.imagePart}`;
    }
    return result;
  }
}

export { UserUrlBuilder };
