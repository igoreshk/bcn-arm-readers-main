import { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';

const useImageDropzone = ({ translate, image, maxSize, onDropAcceptedCallback, onDropRejectedCallback }) => {
  const [file, setFile] = useState(null);
  const [isRejected, setIsRejected] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const expDivider = 1024;
  const maxSizeInMB = maxSize / expDivider / expDivider;

  const setPreviewImg = (img) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      setFile(reader.result);
    });
    reader.readAsDataURL(img);
  };

  useEffect(() => {
    if (image) {
      setPreviewImg(image);
    }
  }, []);

  const onDropRejected = ([selectedFile]) => {
    if (
      selectedFile.type !== 'image/jpeg' ||
      selectedFile.type !== 'image/png' ||
      selectedFile.type !== 'image/svg+xml'
    ) {
      setErrorMessage(() => translate('validation.invalidImageType'));
    }
    if (selectedFile.file.size >= maxSize) {
      setErrorMessage(() => translate('validation.invalidImageSize', { value: maxSizeInMB }));
    }
    onDropRejectedCallback();
    setIsRejected(true);
  };

  const onDropAccepted = ([selectedFile]) => {
    setIsRejected(false);
    setPreviewImg(selectedFile);
    setErrorMessage(() => '');
    onDropAcceptedCallback(selectedFile);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDropRejected,
    onDropAccepted,
    maxFiles: 1,
    accept: '.png, .jpeg, .jpg, .svg',
    maxSize
  });

  return { file, isRejected, errorMessage, getRootProps, getInputProps };
};

export default useImageDropzone;
