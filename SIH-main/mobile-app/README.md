# SIH Mobile App

Expo-based React Native client for the SIH rockfall detection platform. Mirrors the backend (`/backend`) and web dashboard (`/web-app`) modules while focusing on mobility, offline-first flows, and SOS/complaint capture in the field.

## Stack

- React Native + Expo 51 (Hermes, new architecture enabled)
- React Navigation (auth stack + tabbed app shell)
- Axios + socket.io-client for REST/WebSocket parity with the backend
- Expo SQLite/FileSystem/Notifications/Camera/ImagePicker/Location for offline and device APIs
- Placeholder ML panels that match the web-app messaging until FastAPI hooks are wired end-to-end

## Project structure

```
mobile-app/
├── App.js                  # Expo entry point -> src/App.js
├── app.json                # Expo config (scheme, env, assets)
├── package.json            # Dependencies + scripts
├── babel.config.js
├── src/
│   ├── App.js              # Navigation container + providers
│   ├── screens/            # Feature screens (home, map, complaints, SOS, alerts, login)
│   ├── components/         # Shared UI (MapView, AlertCard, UploadBox, ML placeholders)
│   ├── navigation/         # Auth navigator + protected app navigator
│   ├── services/           # API client, notifications, offline queue
│   ├── hooks/              # Network + offline queue hooks
│   ├── storage/            # SQLite helpers + offline.db placeholder
│   └── utils/              # Constants (API URLs, colors, etc.)
└── assets/
    └── icons/              # Keep branded icons here (git-kept)
```

## Scripts

- `npm install` — install dependencies
- `npm run start` — launch Expo dev server (Metro)
- `npm run android` / `npm run ios` / `npm run web`
- `npm run lint` — lint `src/` with `eslint-config-expo`

## Environment

- Configure API/socket roots via `expo.extra.apiUrl` + `expo.extra.socketUrl` in `app.json`.
- Leverages the backend running on `http://localhost:4000` by default (same as the web-app). Update for device testing (e.g., use your LAN IP).
- ML endpoints mirror the placeholders already present in `/web-app/app/ml/*`.

## Next steps

- Replace placeholder splash/adaptive icons under `assets/`.
- Implement secure auth/token refresh flows (currently mocked via state in `src/App.js`).
- Wire ML screens/services once the FastAPI service is reachable from mobile clients.
- Extend offline queue processing to cover complaints/uploads end-to-end.

