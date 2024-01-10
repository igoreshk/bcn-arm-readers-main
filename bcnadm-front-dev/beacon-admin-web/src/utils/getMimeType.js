export function getMimeType(encoded) {
  let result = null;

  if (!encoded) {
    return '';
  }

  const mime = encoded.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);

  if (mime && mime.length) {
    result = mime[1];
  }
  return result;
}
