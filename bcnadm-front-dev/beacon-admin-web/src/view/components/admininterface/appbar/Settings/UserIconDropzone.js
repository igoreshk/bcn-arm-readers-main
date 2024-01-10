import React from 'react';
import PropTypes from 'prop-types';
import useImageDropzone from 'utils/useImageDropzone';

const UserIconDropzone = ({ input, imageLink, translate, maxSize }) => {
  const image = input.value;

  const onDropAcceptedCallback = (selectedFile) => {
    input.onChange(selectedFile);
  };

  const onDropRejectedCallback = () => {
    input.onChange(null);
  };

  const { file, getRootProps, getInputProps, isRejected, errorMessage } = useImageDropzone({
    image,
    maxSize,
    translate,
    onDropAcceptedCallback,
    onDropRejectedCallback
  });

  const userIcon = file || imageLink;

  return (
    <div {...getRootProps({ className: 'dropzone' })}>
      <input {...getInputProps()} />
      {userIcon && <img className="imageStyle" src={userIcon || image} role="presentation" />}
      {isRejected && <span className="error">{errorMessage}</span>}
    </div>
  );
};

UserIconDropzone.propTypes = {
  input: PropTypes.object,
  imageLink: PropTypes.string,
  translate: PropTypes.func.isRequired,
  maxSize: PropTypes.number.isRequired
};

export default UserIconDropzone;
