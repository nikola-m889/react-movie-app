import React, { useState, useEffect } from "react";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { GlobalState } from "./Context/GlobalState";
import "./App.css";

const App = () => {
  const [movies, addMovies] = useState([]);
  const [favorites, addFavorites] = useState([]);
  const [searchMovie, setSearchMovie] = useState("");
  const [activated, setActivated] = useState(false);

  const findMovie = async (searchMovie) => {
    const url = `https://api.themoviedb.org/3/search/movie?api_key=731f3d186278f13415d6f4a26e0ff069&query=${searchMovie}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        addMovies(data.results);
      });
  };

  useEffect(() => {
    fetch(
      "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=731f3d186278f13415d6f4a26e0ff069&page=1"
    )
      .then((res) => res.json())
      .then((data) => {
        addMovies(data.results);
      });
  }, []);

  if (searchMovie) {
    findMovie(searchMovie);
  }

  useEffect(() => {
    const StorageData = JSON.parse(localStorage.getItem("movie-data"));
    if (StorageData) {
      addFavorites(StorageData);
    }
  }, []);

  const saveToStorage = (data) => {
    localStorage.setItem("movie-data", JSON.stringify(data));
  };

  const addingFavorites = (result) => {
    const FavoriteList = [...favorites, result];
    addFavorites(FavoriteList);
    saveToStorage(FavoriteList);
  };

  const deleteFavorites = (result) => {
    const FavoriteList = favorites.filter((fav) => fav.id !== result.id);
    addFavorites(FavoriteList);
    saveToStorage(FavoriteList);
  };

  return (
    <GlobalState.Provider
      value={{
        movies,
        addMovies,
        searchMovie,
        setSearchMovie,
        favorites,
        addFavorites,
        addingFavorites,
        deleteFavorites,
        activated,
        setActivated,
      }}
    >
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/favorites" component={Favorites} />
        </Switch>
      </Router>
    </GlobalState.Provider>
  );
};

export default App;
