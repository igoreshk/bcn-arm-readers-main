import React from 'react';
import PropTypes from 'prop-types';
import useImageDropzone from 'utils/useImageDropzone';

const LevelImageDropZone = ({ input, changeLevelImage, maxSize, translate, entityId, image, imageLink }) => {
  const onDropAcceptedCallback = (selectedFile) => {
    input.onChange({
      ...input.value,
      entityId: input.value.entityId,
      image: selectedFile,
      number: input.value.number
    });
    changeLevelImage(selectedFile);
  };

  const onDropRejectedCallback = () => {
    input.onChange({
      ...input.value,
      entityId: input.value.entityId,
      image: null,
      number: input.value.number
    });
  };

  const { file, isRejected, errorMessage, getRootProps, getInputProps } = useImageDropzone({
    translate,
    image,
    maxSize,
    onDropAcceptedCallback,
    onDropRejectedCallback
  });

  const getImageLabel = () => {
    if (image) {
      return image.name;
    }
    if (entityId) {
      return entityId;
    }
    return '';
  };

  return (
    <div {...getRootProps({ className: 'dropzone' })}>
      <input {...getInputProps()} />
      {!image && !imageLink && <span className="dropzoneText">{translate('imageDropzone.upload')}</span>}
      {(image || imageLink || file) && (
        <div className="dropzoneContent">
          <span className="dropzoneText">{getImageLabel()}</span>
          <img className="preview" src={file || image || imageLink} role="presentation" />
        </div>
      )}
      {isRejected && <span className="error">{errorMessage}</span>}
    </div>
  );
};

LevelImageDropZone.propTypes = {
  changeLevelImage: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired,
  maxSize: PropTypes.number.isRequired,
  entityId: PropTypes.string,
  number: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  imageLink: PropTypes.string,
  image: PropTypes.object,
  input: PropTypes.object
};

export default LevelImageDropZone;
