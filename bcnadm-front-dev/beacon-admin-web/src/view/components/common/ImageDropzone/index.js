import React from 'react';
import PropTypes from 'prop-types';
import useImageDropzone from 'utils/useImageDropzone';

const ImageDropzone = ({ translate, input, imageLink, maxSize }) => {
  const image = input.value;
  const onDropRejectedCallback = () => {
    input.onChange(null);
  };
  const onDropAcceptedCallback = (selectedFile) => {
    input.onChange(selectedFile);
  };

  const { file, isRejected, errorMessage, getRootProps, getInputProps } = useImageDropzone({
    translate,
    image,
    maxSize,
    onDropRejectedCallback,
    onDropAcceptedCallback
  });

  return (
    <div {...getRootProps({ className: 'dropzone' })}>
      <input {...getInputProps()} />
      {!image && !imageLink && <span>{translate('imageDropzone.upload')}</span>}
      {(imageLink || image || file) && <img className="preview" src={file || image || imageLink} />}
      {isRejected && <span className="error">{errorMessage}</span>}
    </div>
  );
};

ImageDropzone.propTypes = {
  input: PropTypes.object,
  imageLink: PropTypes.string,
  translate: PropTypes.func.isRequired,
  maxSize: PropTypes.number.isRequired
};

export default ImageDropzone;
