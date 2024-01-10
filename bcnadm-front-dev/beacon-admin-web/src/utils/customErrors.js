class ServerError extends Error {
  constructor(response, message) {
    super(message);
    this.response = response;
  }
}

export { ServerError };
