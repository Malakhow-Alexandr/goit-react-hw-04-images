import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SearchBar } from './SearchBar/SearhBar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Modal } from './Modal/Modal';
import { Container } from 'Container.styled';
import { FetchImagesFromApi } from './services/Fetch-Api';
import { toast } from 'react-toastify';
import { Button } from 'components/Button/Button';
import { ThreeCircles } from 'react-loader-spinner';
import { Description } from 'components/Description/Description';
import { ButtonWraper } from 'components/Button/Button.styled';

export const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [images, setImages] = useState([]);
  const [totalHits, setTotalHits] = useState(0);
  const [outOfImg, setOutOfImg] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [picUrl, setPicUrl] = useState('');

  const handleSearchFormSubmit = searchQuery => {
    setSearchQuery(searchQuery);
    setIsLoading(false);
    setPage(1);
    setError(null);
    setImages([]);
    setTotalHits(0);
    setOutOfImg(false);
  };

  const getImages = async (page, query) => {
    if (!query) {
      return;
    }
    try {
      setIsLoading(true);
      const response = await FetchImagesFromApi(page, query);

      if (response.data.total === 0) {
        toast.warn(`Sorry, there are no images for ${query} request.`);
        setOutOfImg(true);
        return;
      }

      if (page === 1) {
        toast.success(`Good we found ${response.data.totalHits} images`);
      }

      setImages(prevState => [...prevState, ...response.data.hits]);
      setTotalHits(response.data.totalHits);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getImages(page, searchQuery);
  }, [page, searchQuery]);

  const toogleModal = picUrl => {
    setShowModal(state => !state);
    setPicUrl(picUrl);
  };

  const onButtonClick = () => {
    setPage(prevState => prevState + 1);
  };

  return (
    <Container className="App">
      <SearchBar onSubmit={handleSearchFormSubmit} />
      <ToastContainer position="top-right" autoClose={2000} theme="dark" />

      {images.length === 0 && !outOfImg && (
        <Description text={'Add your Search Query to input.'} />
      )}
      {outOfImg && (
        <Description
          text={`Sorry. There are no ${searchQuery} images ... 😭 Try to search again!`}
        />
      )}

      {error && (
        <Description
          text={`Sorry. Error ${error.message} 😭 Try to search again!`}
        />
      )}
      {images.length > 0 && (
        <ImageGallery images={images} onModal={toogleModal} />
      )}

      <ButtonWraper>
        {!isLoading &&
          images.length > 0 &&
          images.length < totalHits &&
          !outOfImg && <Button onClick={onButtonClick}></Button>}

        {isLoading && (
          <ThreeCircles
            height="80"
            width="80"
            wrapperClass="spinner-wrapper"
            ariaLabel="three-circles-rotating"
            outerCircleColor="#0a598d"
            innerCircleColor="#260a8d"
            middleCircleColor="#6a0474"
          />
        )}
      </ButtonWraper>
      {showModal && <Modal onClose={toogleModal} picUrl={picUrl} />}
    </Container>
  );
};
