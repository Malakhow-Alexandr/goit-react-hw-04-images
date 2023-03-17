import { Component } from 'react';
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

export class App extends Component {
  state = {
    searchQuery: '',
    page: 1,
    images: [],
    totalHits: 0,
    outOfImg: false,
    isLoading: false,
    error: null,
    showModal: false,
    picUrl: '',
  };

  componentDidUpdate(prevProps, prevState) {
    const { searchQuery, page } = this.state;
    if (prevState.searchQuery !== searchQuery || prevState.page !== page) {
      this.getImages(page, searchQuery);
    }
  }

  handleSearchFormSubmit = searchQuery => {
    this.setState({
      searchQuery: searchQuery,
      isLoading: false,
      page: 1,
      error: null,
      images: [],
      totalHits: 0,
      outOfImg: false,
    });
  };

  getImages = async (page, query) => {
    if (!query) {
      return;
    }
    try {
      this.setState({ isLoading: true });
      const response = await FetchImagesFromApi(page, query);

      if (response.data.total === 0) {
        toast.warn(`Sorry, there are no images for ${query} request.`);
        this.setState({ outOfImg: true });
        return;
      }

      if (page === 1) {
        toast.success(`Good we found ${response.data.totalHits} images`);
      }

      this.setState(prevState => ({
        images: [...prevState.images, ...response.data.hits],
        totalHits: response.data.totalHits,
      }));
    } catch (error) {
      this.setState({ error });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  toogleModal = picUrl => {
    this.setState(({ showModal }) => ({
      showModal: !showModal,
      picUrl,
    }));
  };

  onButtonClick = () => {
    this.setState(prevState => ({ page: prevState.page + 1 }));
  };

  render() {
    const {
      showModal,
      picUrl,
      outOfImg,
      searchQuery,
      isLoading,
      error,
      images,
      totalHits,
    } = this.state;
    return (
      <Container className="App">
        <SearchBar onSubmit={this.handleSearchFormSubmit} />
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
          <ImageGallery images={images} onModal={this.toogleModal} />
        )}

        <ButtonWraper>
          {!isLoading &&
            images.length > 0 &&
            images.length < totalHits &&
            !outOfImg && <Button onClick={this.onButtonClick}></Button>}

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
        {showModal && <Modal onClose={this.toogleModal} picUrl={picUrl} />}
      </Container>
    );
  }
}
