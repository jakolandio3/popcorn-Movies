import { useEffect } from 'react';
export function useKey(key, action) {
	// adding an effect to listen to the esc key press to close modal on body
	useEffect(
		function () {
			function callback(e) {
				e.code.toLowerCase() === key.toLowerCase() && action();
			}
			document.addEventListener('keydown', callback);
			return function () {
				document.removeEventListener('keydown', callback);
			};
		},
		[action, key]
	);
}
