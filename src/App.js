import axios from "axios";
import { Form } from "react-bootstrap";
import { Button } from "react-bootstrap";
import "./index.css";
import { useEffect, useRef, useState } from "react";

const API_URL = "https://api.unsplash.com/search/photos";
// const API_KEY = 'wU12y_TG8aBoICRnAxM6ch82wMKHG8nMHnyCq9s_ZiM'
const IMAGES_PER_PAGE = 20;

function App() {
  // console.log(process.env.REACT_APP_API_KEY);
  const searchInput = useRef(null);

  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchImages = async () => {
    try {
      if (searchInput.current.value) {
        setErrorMsg('')
        const { data } = await axios.get(
          `${API_URL}?query=${searchInput.current.value}&page=${page}&per_page=${IMAGES_PER_PAGE}&client_id=${process.env.REACT_APP_API_KEY}`
        );
        // console.log("result", result.data);
        setImages(data.results);
        setTotalPages(data.total_pages);
      }
    } catch (error) {
      setErrorMsg("Error fetching images. Try again later")
      console.log(error);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [page]);

  const resetSearch = () => {
    setPage(1);
    fetchImages();
  };

  const handleSearch = (event) => {
    event.preventDefault();
    console.log(searchInput.current.value);
    resetSearch();
  };

  const handleSelection = (selection) => {
    searchInput.current.value = selection;
    resetSearch();
  };

  // console.log('page',page);

  return (
    <div className="container">
      <h1 className="title">Image Search</h1>
      {errorMsg && <p className="error-msg">{errorMsg}</p>}
      <div className="search-section">
        <Form onSubmit={handleSearch}>
          <Form.Control
            type="text"
            placeholder="Type something to search..."
            className="search-input"
            ref={searchInput}
          />
        </Form>
      </div>
      <div className="filters">
        <div onClick={() => handleSelection("nature")}>Nature</div>
        <div onClick={() => handleSelection("cats")}>Cats</div>
        <div onClick={() => handleSelection("shoes")}>Shoes</div>
        <div onClick={() => handleSelection("birds")}>Birds</div>
      </div>

      <div className="images">
        {images.map((image) => (
          <img
            key={image.id}
            src={image.urls.small}
            alt={image.alt_description}
            className="image"
          />
        ))}
      </div>

      <div className="buttons">
        {page > 1 && (
          <Button onClick={() => setPage(page - 1)}>Previous</Button>
        )}
        {page < totalPages && (
          <Button onClick={() => setPage(page + 1)}>Next</Button>
        )}
      </div>
    </div>
  );
}

export default App;
