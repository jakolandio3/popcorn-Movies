import { useEffect, useState } from 'react';
import StarRating from './StarRating.js';

// const tempMovieData = [
// 	{
// 		imdbID: 'tt1375666',
// 		Title: 'Inception',
// 		Year: '2010',
// 		Poster:
// 			'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg',
// 	},
// 	{
// 		imdbID: 'tt0133093',
// 		Title: 'The Matrix',
// 		Year: '1999',
// 		Poster:
// 			'https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg',
// 	},
// 	{
// 		imdbID: 'tt6751668',
// 		Title: 'Parasite',
// 		Year: '2019',
// 		Poster:
// 			'https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg',
// 	},
// ];

// const tempWatchedData = [
// 	{
// 		imdbID: 'tt1375666',
// 		Title: 'Inception',
// 		Year: '2010',
// 		Poster:
// 			'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg',
// 		runtime: 148,
// 		imdbRating: 8.8,
// 		userRating: 10,
// 	},
// 	{
// 		imdbID: 'tt0088763',
// 		Title: 'Back to the Future',
// 		Year: '1985',
// 		Poster:
// 			'https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg',
// 		runtime: 116,
// 		imdbRating: 8.5,
// 		userRating: 9,
// 	},
// ];
const KEY = '2c3d6c49';
// OMBD key = 2c3d6c49
// OMBD data request = http://www.omdbapi.com/?apikey=[yourkey]&
// OMBD IMAGES = http://img.omdbapi.com/?apikey=[yourkey]&

const average = (arr) =>
	arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
// appp component would be classed as a structural component
export default function App() {
	const [movies, setMovies] = useState([]);
	const [query, setQuery] = useState('');
	const [watched, setWatched] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	const [selectedId, setSelectedId] = useState(null);

	// creating a function for getting the id of the movie you select
	function handleSelectMovie(id) {
		selectedId === id ? handleCloseMovie() : setSelectedId(id);
	}
	function handleCloseMovie() {
		setSelectedId(null);
	}

	function handleAddWatched(movie) {
		setWatched((watched) => [...watched, movie]);
	}

	function handleDeleteWatchedMovie(movie) {
		setWatched((watched) =>
			watched.filter((movies) => movies.imdbID !== movie.imdbID)
		);
	}
	// use effect means it executes after the component has been rendered, it takes se second argument which says when it is executes, the empty array here means its only executed when it first mounts to the dom

	useEffect(() => {
		const controller = new AbortController();
		async function fetchMovies() {
			try {
				setIsLoading(true);
				setError('');
				const res = await fetch(
					`http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
					{ signal: controller.signal }
				);
				if (!res.ok)
					throw new Error('something went wrong with fetching the data');

				const data = await res.json();

				if (data.Response === 'False') throw new Error('no movie found');

				setMovies(data.Search);
			} catch (error) {
				if (error.name !== 'AbortError') setError(error.message);
			} finally {
				setIsLoading(false);
			}
			if (!query.length) {
				setMovies([]);
				setError('');
				return;
			}
		}
		handleCloseMovie();
		fetchMovies();

		return function () {
			controller.abort();
		};
	}, [query]);

	return (
		<>
			<Navbar movies={movies}>
				<SearchBar query={query} setQuery={setQuery} />
				<NumResults movies={movies} />
			</Navbar>

			<Main>
				<Box movies={movies}>
					{/* {isLoading ? <Loader /> : <MovieList movies={movies} />} */}
					{isLoading && <Loader />}
					{!isLoading && !error && (
						<MovieList movies={movies} onSelectMovie={handleSelectMovie} />
					)}
					{error && <ErrorMessage message={error} />}
				</Box>

				<Box>
					{selectedId ? (
						<MovieDetails
							selectedId={selectedId}
							onCloseMovieDetails={handleCloseMovie}
							onAddWatched={handleAddWatched}
							watched={watched}
						/>
					) : (
						<>
							<Summary watched={watched} />
							<WatchedList
								watched={watched}
								onDelete={handleDeleteWatchedMovie}
							/>
						</>
					)}
				</Box>
			</Main>
		</>
	);
}
// logo would be a presentation component
// logo
function Logo() {
	return (
		<div className='logo'>
			<span role='img'>🍿</span>
			<h1>usePopcorn</h1>
		</div>
	);
}
// structural components
function Navbar({ children }) {
	return (
		<nav className='nav-bar'>
			<Logo />
			{children}
		</nav>
	);
}
// stateful component
// Search component
function SearchBar({ query, setQuery }) {
	return (
		<input
			className='search'
			type='text'
			placeholder='Search movies...'
			value={query}
			onChange={(e) => setQuery(e.target.value)}
		/>
	);
}
// presentational component
// search results bar
function NumResults({ movies }) {
	return (
		<p className='num-results'>
			Found <strong>{movies.length}</strong> results
		</p>
	);
}

// loader box
function Loader() {
	return <p className='loader'>...Loading please wait</p>;
}

// error component
function ErrorMessage({ message }) {
	return (
		<p className='error'>
			<span>🛑⛔</span>
			{message}
		</p>
	);
}
// structural component
// main component
function Main({ children }) {
	return <main className='main'>{children}</main>;
}
// left hand side box
function Box({ children }) {
	const [isOpen, setIsOpen] = useState(true);
	return (
		<div className='box'>
			<button className='btn-toggle' onClick={() => setIsOpen((open) => !open)}>
				{isOpen ? '–' : '+'}
			</button>
			{isOpen && children}
		</div>
	);
}
// // right hand side box
// function WatchedBox() {
// 	const [isOpen2, setIsOpen2] = useState(true);
// 	const [watched, setWatched] = useState(tempWatchedData);

// 	return (
// 		<div className='box'>
// 			<button
// 				className='btn-toggle'
// 				onClick={() => setIsOpen2((open) => !open)}
// 			>
// 				{isOpen2 ? '–' : '+'}
// 			</button>
// 			{isOpen2 && (
// 				<>
// 					<Summary watched={watched} />
// 					<WatchedList watched={watched} />
// 				</>
// 			)}
// 		</div>
// 	);
// }
// movie list
function MovieList({ movies, onSelectMovie }) {
	return (
		<ul className='list list-movies'>
			{movies?.map((movie) => (
				<Movie movie={movie} key={movie.imdbID} onSelectMovie={onSelectMovie} />
			))}
		</ul>
	);
}
// single Movie Object
function Movie({ movie, onSelectMovie }) {
	return (
		<li onClick={() => onSelectMovie(movie.imdbID)}>
			<img src={movie.Poster} alt={`${movie.Title} poster`} />
			<h3>{movie.Title}</h3>
			<div>
				<p>
					<span>🗓</span>
					<span>{movie.Year}</span>
				</p>
			</div>
		</li>
	);
}
// creating a selected movie element
function MovieDetails({
	selectedId,
	onCloseMovieDetails,
	onAddWatched,
	watched,
}) {
	const [movie, setMovie] = useState({});
	const [isLoading, setIsLoading] = useState(false);
	const [userStarRating, setUserStarRating] = useState('');

	const isWatched = watched.map((movies) => movies.imdbID).includes(selectedId);
	const watchedUserRating = watched.find(
		(movie) => movie.imdbID === selectedId
	)?.userRating;

	const {
		Title: title,
		Year: year,
		Poster: poster,
		Runtime: runtime,
		imdbRating,
		Plot: plot,
		Released: released,
		Actors: actors,
		Director: director,
		Genre: genre,
	} = movie;

	function handleAdd() {
		const newWatchedMovie = {
			imdbID: selectedId,
			title,
			year,
			poster,
			imdbRating: +imdbRating,
			runtime: +runtime.split(' ').at(0),
			userRating: userStarRating,
		};
		onAddWatched(newWatchedMovie);
		onCloseMovieDetails();
	}

	// adding an effect to listen to the esc key press to close modal on body
	useEffect(
		function () {
			function callback(e) {
				e.code === 'Escape' && onCloseMovieDetails();
			}
			document.addEventListener('keydown', callback);
			return function () {
				document.removeEventListener('keydown', callback);
			};
		},
		[onCloseMovieDetails]
	);

	useEffect(
		function () {
			async function getMovieDetails() {
				setIsLoading(true);
				const res = await fetch(
					`http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
				);
				const data = await res.json();
				setMovie(data);
				setIsLoading(false);
			}
			getMovieDetails();
		},
		[selectedId]
	);
	// creating an effect for the title change in tab upon selecting a movie
	useEffect(
		function () {
			if (!title) return;
			document.title = `Movie | ${title}`;
			return function () {
				document.title = 'usePopcorn';
			};
		},
		[title]
	);

	return (
		<div className='details'>
			{isLoading ? (
				<Loader />
			) : (
				<>
					<header>
						<button className='btn-back' onClick={onCloseMovieDetails}>
							&larr;
						</button>
						<img src={poster} alt={title} />
						<div className='details-overview'>
							<h2>{title}</h2>
							<p>
								{released} &bull; {runtime}
							</p>
							<p>{genre}</p>
							<p>
								<span>⭐</span>
								{imdbRating} IMDB Rating
							</p>
						</div>
					</header>
					<section>
						<div className='rating'>
							{!isWatched ? (
								<>
									<StarRating
										maxRating={10}
										size={24}
										onSetRating={setUserStarRating}
									/>
									{userStarRating > 0 && (
										<button className='btn-add' onClick={handleAdd}>
											+ Add To List
										</button>
									)}
								</>
							) : (
								<p>
									You Rated this movie {watchedUserRating} <span>⭐</span>{' '}
								</p>
							)}
						</div>
						<p>
							<em>{plot}</em>
						</p>
						<p>Starring {actors}</p>
						<p>Directed by {director}</p>
					</section>
				</>
			)}
		</div>
	);
}

function Summary({ watched }) {
	const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
	const avgUserRating = average(watched.map((movie) => movie.userRating));
	const avgRuntime = average(watched.map((movie) => movie.runtime));
	return (
		<div className='summary'>
			<h2>Movies you watched</h2>
			<div>
				<p>
					<span>#️⃣</span>
					<span>{watched.length} movies</span>
				</p>
				<p>
					<span>⭐️</span>
					<span>{avgImdbRating.toFixed(2)}</span>
				</p>
				<p>
					<span>🌟</span>
					<span>{avgUserRating.toFixed(2)}</span>
				</p>
				<p>
					<span>⏳</span>
					<span>{avgRuntime} min</span>
				</p>
			</div>
		</div>
	);
}

// watched list
function WatchedList({ watched, onDelete }) {
	return (
		<ul className='list'>
			{watched.map((movie) => (
				<WatchedMovie movie={movie} key={movie.imdbID} onDelete={onDelete} />
			))}
		</ul>
	);
}

// watched movie
function WatchedMovie({ movie, onDelete }) {
	return (
		<li>
			<img src={movie.poster} alt={`${movie.title} poster`} />
			<h3>{movie.title}</h3>
			<div>
				<p>
					<span>⭐️</span>
					<span>{movie.imdbRating}</span>
				</p>
				<p>
					<span>🌟</span>
					<span>{movie.userRating}</span>
				</p>
				<p>
					<span>⏳</span>
					<span>{movie.runtime} min</span>
				</p>
				<button className='btn-delete' onClick={() => onDelete(movie)}>
					X
				</button>
			</div>
		</li>
	);
}
