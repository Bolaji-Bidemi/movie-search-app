const apiKey = "dfe023"; // Replace with your OMDb API key

const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const searchResults = document.getElementById("search-results");
const sort = document.getElementById("sort");
const modal = document.createElement("div");
const page = document.getElementById("page");
modal.classList.add("modal");

// Event listener for search button click
searchButton.addEventListener("click", searchMovies);

// Event listener for Enter key press in search input field
searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    searchMovies();
  }
});

//function to search movies
function searchMovies(num) {
  const searchTerm = searchInput.value.trim();

  if (searchTerm === "") {
    return displayErrorMessage("Please enter a valid search term.");
  }

  const url = `https://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(
    searchTerm
  )}`;
  

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (data.Response === "True") {
        displayMovies(data.Search);
      } else {
        displayErrorMessage("No results found.");
      }
    })
    .catch((error) => {
      displayErrorMessage("An error occurred. Please try again later.");
      console.error(error);
    });
}

//function to display movies with sort option
function displayMovies(movies) {
  searchResults.innerHTML = "";
  

  movies.forEach((movie) => {
    const movieCard = createMovieCard(movie);
    searchResults.appendChild(movieCard);
  });
}

function createMovieCard(movie) {
  movieCard.dataset.rating = movie.imdbRating;
  movieCard.dataset.year = movie.Year;
}

//function to display a modal with movie details
function createModalContent(movie) {
  const movieRating = document.createElement("p");
  movieRating.textContent = `Rating: ${movie.imdbRating}`;

  modalContent.appendChild(movieRating);
}

//function to create each movie card
function createMovieCard(movie) {
  const movieCard = document.createElement("div");
  movieCard.classList.add("movie-card");

  const movieTitle = document.createElement("h2");
  movieTitle.classList.add("movie-title");
  movieTitle.textContent = movie.Title;

  const moviePoster = document.createElement("img");
  moviePoster.classList.add("movie-poster");
  moviePoster.src = movie.Poster;
  moviePoster.alt = movie.Title;

  moviePoster.onerror = function () {
    this.src = "default.jpeg";
  };

  const movieYear = document.createElement("p");
  movieYear.classList.add("movie-year");
  movieYear.textContent = movie.Year;

  const detailsButton = document.createElement("button");
  detailsButton.classList.add("details-button");
  detailsButton.textContent = "View Details";
  detailsButton.addEventListener("click", () =>
    displayMovieDetails(movie.imdbID)
  );

  movieCard.appendChild(movieTitle);
  movieCard.appendChild(moviePoster);
  movieCard.appendChild(movieYear);
  movieCard.appendChild(detailsButton);

  return movieCard;
}

function displayMovieDetails(movieId) {
  const url = `https://www.omdbapi.com/?apikey=${apiKey}&i=${movieId}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const modalContent = createModalContent(data);
      modal.innerHTML = "";
      modal.appendChild(modalContent);
      document.body.appendChild(modal);
      modal.style.display = "flex";
    })
    .catch((error) => {
      displayErrorMessage("An error occurred. Please try again later.");
      console.error(error);
    });
}


//function to create modal content
function createModalContent(movie) {
  const modalContent = document.createElement("div");
  modalContent.classList.add("modal-content");

  const closeButton = document.createElement("button");
  closeButton.classList.add("close-button");
  closeButton.innerHTML = "&times;";
  closeButton.addEventListener("click", () => {
    modal.style.display = "none";
  });

  const movieTitle = document.createElement("h2");
  movieTitle.classList.add("movie-title");
  movieTitle.textContent = movie.Title;

  const moviePoster = document.createElement("img");
  moviePoster.classList.add("movie-poster");
  moviePoster.src = movie.Poster;
  moviePoster.alt = movie.Title;

  moviePoster.onerror = function () {
    this.src = "default.jpeg";
  };

  const moviePlot = document.createElement("p");
  moviePlot.textContent = movie.Plot;

  const movieGenre = document.createElement("p");
  movieGenre.textContent = `Genre: ${movie.Genre}`;

  const movieCast = document.createElement("p");
  movieCast.textContent = `Cast: ${movie.Actors}`;

  modalContent.appendChild(closeButton);
  modalContent.appendChild(movieTitle);
  modalContent.appendChild(moviePoster);
  modalContent.appendChild(moviePlot);
  modalContent.appendChild(movieGenre);
  modalContent.appendChild(movieCast);

  return modalContent;
}

//function to handle any error
function displayErrorMessage(message) {
  searchResults.innerHTML = `<p class="error-message">${message}</p>`;
}
