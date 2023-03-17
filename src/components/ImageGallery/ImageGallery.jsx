import PropTypes from 'prop-types';

import { ImageGalleryItem } from 'components/ImageGalleryItem/ImageGalleryItem';

import { ImageGalleryStyled } from './ImageGallery.styled';

export const ImageGallery = ({ images, onModal }) => {
  return (
    <>
      <ImageGalleryStyled>
        <ImageGalleryItem images={images} onModal={onModal} />
      </ImageGalleryStyled>
    </>
  );
};

ImageGallery.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      webformatURL: PropTypes.string.isRequired,
      largeImageURL: PropTypes.string.isRequired,
    }).isRequired
  ).isRequired,
  onModal: PropTypes.func.isRequired,
};
