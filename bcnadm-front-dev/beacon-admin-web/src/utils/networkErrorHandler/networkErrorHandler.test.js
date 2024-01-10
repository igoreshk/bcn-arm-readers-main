import networkErrorHandler from './index';

class CustomError extends Error {
  constructor(message, opt) {
    super(message);
    this.request = opt.request;
    if (opt.response) {
      this.response = opt.response;
    }
  }
}

describe('networkErrorHandler function:', () => {
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockClear();
  });

  it('should have one console output for one function call', () => {
    const anyError = new Error();
    networkErrorHandler(anyError);
    expect(console.error).toHaveBeenCalledTimes(1);
  });

  it('should output in console: Server error: some status text', () => {
    const serverResponseError = new CustomError('Server error', {
      response: { statusText: 'some status text' },
      request: {}
    });
    networkErrorHandler(serverResponseError);
    expect(console.error.mock.calls[0][0]).toBe('Server error: some status text');
  });

  it('should output in console: Request error: The request was made but no response was received', () => {
    const requestError = new CustomError('Request error', { request: {} });
    networkErrorHandler(requestError);
    expect(console.error.mock.calls[0][0]).toBe('Request error: The request was made but no response was received');
  });

  it('should output in console: Not axios error: Something happened in setting up the request that triggered an Error', () => {
    const notAxiosError = new Error('Not axios error');
    networkErrorHandler(notAxiosError);
    expect(console.error.mock.calls[0][0]).toBe(
      'Not axios error: Something happened in setting up the request that triggered an Error'
    );
  });
});
