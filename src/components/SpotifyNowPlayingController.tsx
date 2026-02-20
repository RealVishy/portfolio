import { useEffect } from 'preact/hooks';

type SpotifyNowPlayingPayload = {
	isPlaying: boolean;
	trackName: string;
	artists: string;
	albumName?: string;
	albumImageUrl?: string;
	trackUrl?: string;
	lastUpdated?: string;
};

const DEFAULT_TRACK_URL = 'https://open.spotify.com';
const POLL_INTERVAL_MS = 15_000;
const ENDPOINT = '/api/spotify-now-playing';
const PLACEHOLDER_ART = `data:image/svg+xml,${encodeURIComponent(
	"<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#131b26'/><stop offset='1' stop-color='#0c121a'/></linearGradient></defs><rect width='64' height='64' fill='url(#g)'/><circle cx='32' cy='32' r='15' fill='none' stroke='#2f3a4b' stroke-width='2'/><circle cx='32' cy='32' r='2.8' fill='#2f3a4b'/></svg>"
)}`;

export default function SpotifyNowPlayingController() {
	useEffect(() => {
		const tileNode = document.querySelector<HTMLElement>('#spotify-tile');
		const stateNode = document.querySelector<HTMLElement>('#spotify-state');
		const titleNode = document.querySelector<HTMLElement>('#spotify-track-title');
		const artistsNode = document.querySelector<HTMLElement>('#spotify-artists');
		const artNode = document.querySelector<HTMLImageElement>('#spotify-art');
		const linkNodes = Array.from(
			document.querySelectorAll<HTMLAnchorElement>('[data-spotify-link]')
		);

		if (!tileNode || !stateNode || !titleNode || !artistsNode || !artNode || !linkNodes.length) {
			return;
		}

		const applyLink = (url: string) => {
			for (const node of linkNodes) {
				node.href = url;
			}
		};

		const setCommon = (trackTitle: string, trackArtists: string, imageUrl?: string, trackUrl?: string) => {
			titleNode.textContent = trackTitle;
			artistsNode.textContent = trackArtists;
			artNode.src = imageUrl || PLACEHOLDER_ART;
			applyLink(trackUrl || DEFAULT_TRACK_URL);
		};

		const setLoading = () => {
			tileNode.dataset.spotifyState = 'loading';
			stateNode.textContent = 'Loading';
			setCommon('Checking Spotify...', 'Fetching your listening status.');
		};

		const setError = () => {
			tileNode.dataset.spotifyState = 'error';
			stateNode.textContent = 'Unavailable';
			setCommon('Spotify unavailable', 'Unable to load listening status right now.');
		};

		const setNowPlaying = (payload: SpotifyNowPlayingPayload) => {
			const artistsAndAlbum = payload.albumName
				? `${payload.artists} • ${payload.albumName}`
				: payload.artists;
			tileNode.dataset.spotifyState = payload.isPlaying ? 'playing' : 'idle';
			stateNode.textContent = payload.isPlaying ? 'Live' : 'Last played';
			setCommon(
				payload.trackName || 'Unknown track',
				artistsAndAlbum || 'Unknown artist',
				payload.albumImageUrl,
				payload.trackUrl
			);
		};

		let isRequestInFlight = false;
		let destroyed = false;

		const loadNowPlaying = async () => {
			if (isRequestInFlight || destroyed) return;
			isRequestInFlight = true;

			try {
				const response = await fetch(ENDPOINT, { headers: { Accept: 'application/json' } });
				if (!response.ok) throw new Error('spotify request failed');
				const payload = (await response.json()) as SpotifyNowPlayingPayload;
				if (!payload || !payload.trackName || !payload.artists) throw new Error('invalid payload');
				setNowPlaying(payload);
			} catch {
				setError();
			} finally {
				isRequestInFlight = false;
			}
		};

		setLoading();
		void loadNowPlaying();
		const intervalId = window.setInterval(() => {
			void loadNowPlaying();
		}, POLL_INTERVAL_MS);

		return () => {
			destroyed = true;
			window.clearInterval(intervalId);
		};
	}, []);

	return null;
}
