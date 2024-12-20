import { useState, useEffect } from 'react';

export function useMovies(query, callback) {
	const KEY = process.env.REACT_APP_KEY;
	const DATABASE = process.env.REACT_APP_DATABASE;
	// OMBD key = 2c3d6c49
	// OMBD data request = http://www.omdbapi.com/?apikey=[yourkey]&
	// OMBD IMAGES = http://img.omdbapi.com/?apikey=[yourkey]&
	const [movies, setMovies] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	useEffect(() => {
		const controller = new AbortController();
		async function fetchMovies() {
			try {
				setIsLoading(true);
				setError('');
				const res = await fetch(`${DATABASE}/?apikey=${KEY}&s=${query}`, {
					signal: controller.signal,
				});
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
		callback?.();
		fetchMovies();

		return function () {
			controller.abort();
		};
	}, [query, callback, DATABASE, KEY]);
	return [movies, isLoading, error];
}
