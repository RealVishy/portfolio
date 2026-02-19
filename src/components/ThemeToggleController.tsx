import { useEffect } from 'preact/hooks';

const STORAGE_KEY = 'theme-preference';
const PREFER_DARK_QUERY = '(prefers-color-scheme: dark)';

const resolveTheme = (preference: string, media: MediaQueryList) =>
	preference === 'system' ? (media.matches ? 'dark' : 'light') : preference;

const themeIndex = (preference: string) => {
	if (preference === 'dark') return 0;
	if (preference === 'light') return 2;
	return 1;
};

export default function ThemeToggleController() {
	useEffect(() => {
		const root = document.documentElement;
		const media = window.matchMedia(PREFER_DARK_QUERY);
		const toggle = document.querySelector<HTMLElement>('.theme-toggle');
		const buttons = Array.from(
			document.querySelectorAll<HTMLButtonElement>('[data-theme-choice]')
		);
		if (!buttons.length) return;

		const applyTheme = (preference: string, persist: boolean) => {
			root.dataset.themePreference = preference;
			root.dataset.theme = resolveTheme(preference, media);
			if (toggle) toggle.style.setProperty('--active-index', String(themeIndex(preference)));

			for (const button of buttons) {
				button.setAttribute('aria-pressed', String(button.dataset.themeChoice === preference));
			}

			if (persist) localStorage.setItem(STORAGE_KEY, preference);
		};

		const initialPreference = root.dataset.themePreference || 'system';
		applyTheme(initialPreference, false);

		const listeners = new Map<HTMLButtonElement, EventListener>();
		for (const button of buttons) {
			const handler = () => applyTheme(button.dataset.themeChoice || 'system', true);
			listeners.set(button, handler);
			button.addEventListener('click', handler);
		}

		const mediaHandler = () => {
			const preference = root.dataset.themePreference || 'system';
			if (preference === 'system') applyTheme('system', false);
		};
		media.addEventListener('change', mediaHandler);

		return () => {
			for (const [button, handler] of listeners) {
				button.removeEventListener('click', handler);
			}
			media.removeEventListener('change', mediaHandler);
		};
	}, []);

	return null;
}
