import React, { useState } from "react";

import "./App.css";

const LIMIT = 30;

function App() {
  const [isLoading, setLoading] = useState(false);
  const [isShowMore, setShowMore] = useState(false);
  const [gifs, setGifs] = useState([]);
  const [offset, setOffset] = useState(0);
  const [query, setQuery] = useState("");

  const getGifs = async query => {
    if (!query) return;
    setQuery(query);
    setLoading(true);
    const { data: giphy } = await getGiphy(query);
    const { results: tenor } = await getTenor(query);
    //G pagination: {count: 25, offset: 0, total_count: 11741}
    //T next: 19
    setGifs([...giphy, ...tenor]);
    setOffset(offset + LIMIT);
    setShowMore(true);
    setLoading(false);
  };

  const getGiphy = async query => {
    try {
      const result = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=${process.env.REACT_APP_GIPHY_KEY}&q=${query}&limit=${LIMIT}&offset=${offset}`
      );
      return await result.json();
    } catch (error) {
      throw new Error(error);
    }
  };

  const getTenor = async query => {
    try {
      const result = await fetch(
        `https://api.tenor.com/v1/search?key=${process.env.REACT_APP_TENOR_KEY}&q=${query}&limit=${LIMIT}&pos=${offset}`
      );
      return await result.json();
    } catch (error) {
      throw new Error(error);
    }
  };

  return (
    <div className="App">
      <header>
        <div className="logo">GIF.</div>
        <div className="search">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" fill="currentcolor">
            <path d="M 56.599609 21.599609 C 34.099609 21.599609 15.800781 40.100781 15.800781 62.800781 C 15.800781 85.600781 34.099609 104 56.599609 104 C 66.899609 104 76.3 100.09922 83.5 93.699219 L 85.800781 96 L 83.699219 98.199219 C 82.499219 99.399219 82.499219 101.3 83.699219 102.5 L 101.69922 120.69922 C 102.29922 121.29922 103.00078 121.59961 103.80078 121.59961 C 104.60078 121.59961 105.40039 121.29922 105.90039 120.69922 L 113.90039 112.59961 C 115.00039 111.39961 115.00078 109.50039 113.80078 108.40039 L 95.800781 90.199219 C 95.200781 89.599219 94.499219 89.300781 93.699219 89.300781 C 92.899219 89.300781 92.099609 89.599219 91.599609 90.199219 L 89.5 92.400391 L 87.199219 90 C 93.499219 82.7 97.400391 73.200781 97.400391 62.800781 C 97.400391 40.100781 79.099609 21.599609 56.599609 21.599609 z M 56.599609 27.699219 C 75.799609 27.699219 91.400391 43.500391 91.400391 62.900391 C 91.400391 82.300391 75.799609 98 56.599609 98 C 37.399609 98 21.800781 82.300391 21.800781 62.900391 C 21.800781 43.500391 37.399609 27.699219 56.599609 27.699219 z M 56.699219 40.199219 C 47.199219 40.199219 38.7 46.300781 35.5 55.300781 C 35 56.600781 35.699609 58.199609 37.099609 58.599609 C 37.399609 58.699609 37.7 58.800781 38 58.800781 C 39.1 58.800781 40.1 58.1 40.5 57 C 42.9 50.1 49.499219 45.400391 56.699219 45.400391 C 58.099219 45.400391 59.300781 44.200781 59.300781 42.800781 C 59.300781 41.400781 58.099219 40.199219 56.699219 40.199219 z M 37.699219 64.900391 C 36.299219 64.900391 35.099609 66 35.099609 67.5 L 35.099609 67.900391 C 35.199609 69.300391 36.300781 70.5 37.800781 70.5 C 39.200781 70.5 40.400391 69.300391 40.400391 67.900391 L 40.400391 67.599609 C 40.400391 66.099609 39.300781 64.900391 37.800781 64.900391 L 37.699219 64.900391 z M 93.800781 96.599609 L 107.59961 110.59961 L 103.80078 114.40039 L 90 100.40039 L 93.800781 96.599609 z"/>
          </svg>
          <input
            name="search"
            placeholder="hey stupid, search gifs by typing here.."
            defaultValue={query}
            onKeyDown={event => {
              if (event.key === "Enter") {
                getGifs(event.currentTarget.value);
              }
            }}
          />
        </div>
      </header>
      {isLoading && (
        <div className="loader">Getting your gifs now stupid!!!</div>
      )}
      <main>
        <div className="grid">
        {gifs.map(gif => {
          const gifUrl =
            gif.type === "gif" ? gif.images.original.url : gif.media[0].gif.url;
          return (
            <img key={gif.id} src={gifUrl} className="gallery__img" alt="" />
          );
        })}
        </div>
        {isShowMore && (
          <button className="button" type="button" onClick={() => getGifs(query)}>
            Flere
          </button>
        )}
      </main>
    </div>
  );
}

export default App;
