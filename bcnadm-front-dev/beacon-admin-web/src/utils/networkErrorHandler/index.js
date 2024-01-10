/**
 * Function for handling errors
 * @function networkErrorHandler
 * @param error caught error to be handled
 */
export default (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error(`${error.message}: ${error.response.statusText}`);
    return;
  }
  if (error.request) {
    console.error(`${error.message}: The request was made but no response was received`);
    return;
  }
  console.error(`${error.message}: Something happened in setting up the request that triggered an Error`);
};
