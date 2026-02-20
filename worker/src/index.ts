export interface Env {
	SPOTIFY_CLIENT_ID: string;
	SPOTIFY_CLIENT_SECRET: string;
	SPOTIFY_REFRESH_TOKEN: string;
	ALLOWED_ORIGIN?: string;
}

type SpotifyTrack = {
	name?: string;
	artists?: Array<{ name?: string }>;
	album?: {
		name?: string;
		images?: Array<{ url?: string }>;
	};
	external_urls?: {
		spotify?: string;
	};
};

type SpotifyNowPlayingPayload = {
	isPlaying: boolean;
	trackName: string;
	artists: string;
	albumName: string;
	albumImageUrl: string;
	trackUrl: string;
	lastUpdated: string;
};

const SPOTIFY_ACCOUNTS_URL = 'https://accounts.spotify.com/api/token';
const SPOTIFY_CURRENTLY_PLAYING_URL = 'https://api.spotify.com/v1/me/player/currently-playing';
const SPOTIFY_RECENTLY_PLAYED_URL = 'https://api.spotify.com/v1/me/player/recently-played?limit=1';

const json = (body: unknown, status: number, origin: string) =>
	new Response(JSON.stringify(body), {
		status,
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
			'Cache-Control': 'public, max-age=10',
			'Access-Control-Allow-Origin': origin,
			'Access-Control-Allow-Methods': 'GET,OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type',
			Vary: 'Origin',
		},
	});

const parseAllowedOrigins = (value?: string) =>
	(value || '')
		.split(',')
		.map((origin) => origin.trim())
		.filter(Boolean);

const resolveOrigin = (request: Request, allowedOrigin?: string) => {
	const requestOrigin = request.headers.get('Origin');
	const allowedOrigins = parseAllowedOrigins(allowedOrigin);

	if (!allowedOrigins.length) return requestOrigin || '*';
	if (allowedOrigins.includes('*')) return '*';
	if (!requestOrigin) return allowedOrigins[0];
	if (allowedOrigins.includes(requestOrigin)) return requestOrigin;
	return allowedOrigins[0];
};

const toPayload = (track: SpotifyTrack, isPlaying: boolean): SpotifyNowPlayingPayload => {
	const artists = (track.artists || [])
		.map((artist) => artist.name)
		.filter((name): name is string => Boolean(name))
		.join(', ');

	const albumImageUrl = (track.album?.images || [])
		.map((image) => image.url)
		.find((url): url is string => Boolean(url));

	return {
		isPlaying,
		trackName: track.name || 'Unknown track',
		artists: artists || 'Unknown artist',
		albumName: track.album?.name || 'Unknown album',
		albumImageUrl: albumImageUrl || '',
		trackUrl: track.external_urls?.spotify || 'https://open.spotify.com',
		lastUpdated: new Date().toISOString(),
	};
};

const getAccessToken = async (env: Env) => {
	const basicAuth = btoa(`${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`);
	const body = new URLSearchParams({
		grant_type: 'refresh_token',
		refresh_token: env.SPOTIFY_REFRESH_TOKEN,
	});

	const response = await fetch(SPOTIFY_ACCOUNTS_URL, {
		method: 'POST',
		headers: {
			Authorization: `Basic ${basicAuth}`,
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body,
	});

	if (!response.ok) {
		throw new Error('spotify token exchange failed');
	}

	const data = (await response.json()) as { access_token?: string };
	if (!data.access_token) throw new Error('missing spotify access token');
	return data.access_token;
};

const getCurrentlyPlaying = async (accessToken: string) => {
	const response = await fetch(SPOTIFY_CURRENTLY_PLAYING_URL, {
		headers: { Authorization: `Bearer ${accessToken}` },
	});

	if (response.status === 204) return null;
	if (!response.ok) throw new Error('spotify currently-playing request failed');

	const data = (await response.json()) as {
		is_playing?: boolean;
		item?: SpotifyTrack;
	};

	if (!data.item) return null;
	return toPayload(data.item, Boolean(data.is_playing));
};

const getRecentlyPlayed = async (accessToken: string) => {
	const response = await fetch(SPOTIFY_RECENTLY_PLAYED_URL, {
		headers: { Authorization: `Bearer ${accessToken}` },
	});

	if (!response.ok) return null;

	const data = (await response.json()) as {
		items?: Array<{ track?: SpotifyTrack }>;
	};

	const track = data.items?.[0]?.track;
	if (!track) return null;
	return toPayload(track, false);
};

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const origin = resolveOrigin(request, env.ALLOWED_ORIGIN);

		if (request.method === 'OPTIONS') {
			return new Response(null, {
				status: 204,
				headers: {
					'Access-Control-Allow-Origin': origin,
					'Access-Control-Allow-Methods': 'GET,OPTIONS',
					'Access-Control-Allow-Headers': 'Content-Type',
					Vary: 'Origin',
				},
			});
		}

		if (request.method !== 'GET') {
			return json({ error: 'method_not_allowed' }, 405, origin);
		}

		try {
			const accessToken = await getAccessToken(env);
			const currentlyPlaying = await getCurrentlyPlaying(accessToken);
			if (currentlyPlaying?.isPlaying) {
				return json(currentlyPlaying, 200, origin);
			}

			if (currentlyPlaying) {
				return json({ ...currentlyPlaying, isPlaying: false }, 200, origin);
			}

			const recentlyPlayed = await getRecentlyPlayed(accessToken);
			if (recentlyPlayed) return json(recentlyPlayed, 200, origin);

			return json(
				{
					isPlaying: false,
					trackName: 'Nothing playing right now',
					artists: 'Start a Spotify track to update this tile.',
					albumName: '',
					albumImageUrl: '',
					trackUrl: 'https://open.spotify.com',
					lastUpdated: new Date().toISOString(),
				},
				200,
				origin
			);
		} catch {
			return json({ error: 'spotify_unavailable' }, 502, origin);
		}
	},
};
