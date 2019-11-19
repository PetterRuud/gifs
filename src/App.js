import React, { useState } from "react";

import "./App.css";

const LIMIT = 30;

function App() {
  const [isStart, setStart] = useState(true);
  const [isLoading, setLoading] = useState(false);
  const [isShowMore, setShowMore] = useState(false);
  const [gifs, setGifs] = useState([]);
  const [offset, setOffset] = useState(0);
  const [query, setQuery] = useState("");

  const getGifs = async query => {
    console.log(query);
    if (!query) return;
    setStart(false);
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
    <div className={`app ${!isStart ? "active" : ""}`}>
      <main className="content">
        <div className="search">
          <div className="logo">GIF.</div>
          <div className="search__input">
            <input
              name="search"
              autoFocus
              placeholder="search gifs.."
              defaultValue={query}
              onKeyDown={event => {
                if (event.key === "Enter") {
                  getGifs(event.currentTarget.value);
                }
              }}
            />
            <button
              className="search__button"
              type="button"
              onClick={event => getGifs(event.currentTarget.value)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
              </svg>
            </button>
          </div>
        </div>
        {isLoading && (
          <div className="loader">Getting your gifs now stupid!!!</div>
        )}
        <div className="grid">
          {gifs.map(gif => {
            const gifUrl =
              gif.type === "gif"
                ? gif.images.original.url
                : gif.media[0].gif.url;
            return (
              <img key={gif.id} src={gifUrl} className="gallery__img" alt="" />
            );
          })}
        </div>
        {isShowMore && (
          <button
            className="button"
            type="button"
            onClick={() => getGifs(query)}
          >
            Give me more gifs now!
          </button>
        )}
      </main>
    </div>
  );
}

export default App;
