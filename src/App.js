import { useCallback, useEffect, useRef, useState } from 'react';
import StarRating from './StarRating.js';
import { useMovies } from './useMovies.js';
import { useLocalStorageState } from './useLocalSortageState.js';
import { useKey } from './useKey.js';
const KEY = '2c3d6c49';
const average = (arr) =>
	arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
// appp component would be classed as a structural component
export default function App() {
	const [query, setQuery] = useState('');
	// const [watched, setWatched] = useState(function () {
	// 	const storedValue = localStorage.getItem('watched');
	// 	return storedValue ? JSON.parse(storedValue) : [];
	// });
	const handleCloseMovie = useCallback(function () {
		setSelectedId(null);
	}, []);

	const [watched, setWatched] = useLocalStorageState([], 'watched');

	const [selectedId, setSelectedId] = useState(null);

	const [movies, isLoading, error] = useMovies(query, handleCloseMovie);
	// creating a function for getting the id of the movie you select
	function handleSelectMovie(id) {
		selectedId === id ? handleCloseMovie() : setSelectedId(id);
	}

	function handleAddWatched(movie) {
		setWatched((watched) => [...watched, movie]);
		// local storage

		// localStorage.setItem('watchedList', JSON.stringify([...watched, movie]));
	}

	function handleDeleteWatchedMovie(movie) {
		setWatched((watched) =>
			watched.filter((movies) => movies.imdbID !== movie.imdbID)
		);
	}
	// use effect means it executes after the component has been rendered, it takes se second argument which says when it is executes, the empty array here means its only executed when it first mounts to the dom

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
	const inputEl = useRef(null);
	const [psuedoQuery, setpsuedoQuery] = useState('');
	function sendRequest() {
		setQuery(psuedoQuery);
	}
	useKey('Enter', function () {
		if (document.activeElement === inputEl.current) return;
		inputEl.current.focus();
		setQuery('');
	});

	// calling focus function on the input element as defined by useREF below its making a new state of the input element basically instead opf mutating the original dom element itself
	// useEffect(() => {
	// 	function callback(e) {
	// 		if (document.activeElement === inputEl.current) return;
	// 		if (e.code === 'Enter') {
	// 			inputEl.current.focus();
	// 			setQuery('');
	// 		}
	// 	}

	// 	document.addEventListener('keypress', callback);
	// 	return () => document.removeEventListener('keydown', callback);
	// }, [setQuery]);
	// useEffect(function () {
	// 	const el = document.querySelector('.search');
	// 	el.focus();
	// }, []);
	// using a ref instead of an effect

	return (
		<>
			<input
				className='search'
				type='text'
				placeholder='Search movies...'
				value={psuedoQuery}
				onChange={(e) => setpsuedoQuery(e.target.value)}
				ref={inputEl}
			/>
			<button className='btn-search' onClick={sendRequest}>
				Search
			</button>
		</>
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

	const countRef = useRef(0);

	useEffect(
		function () {
			if (userStarRating) countRef.current++;
		},
		[userStarRating]
	);

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

	// const [avgRating, setAvgRating] = useState(0);

	function handleAdd() {
		const newWatchedMovie = {
			imdbID: selectedId,
			title,
			year,
			poster,
			imdbRating: +imdbRating,
			runtime: +runtime.split(' ').at(0),
			userRating: userStarRating,
			countRatingDecisions: countRef.current,
		};
		onAddWatched(newWatchedMovie);
		onCloseMovieDetails();
		// setAvgRating(+imdbRating);
		// setAvgRating((avgRating) => (avgRating + userStarRating) / 2);
	}
	useKey('Escape', onCloseMovieDetails);
	// adding an effect to listen to the esc key press to close modal on body
	// useEffect(
	// 	function () {
	// 		function callback(e) {
	// 			e.code === 'Escape' && onCloseMovieDetails();
	// 		}
	// 		document.addEventListener('keydown', callback);
	// 		return function () {
	// 			document.removeEventListener('keydown', callback);
	// 		};
	// 	},
	// 	[onCloseMovieDetails]
	// );

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
						{/* <p>{avgRating}</p> */}
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
