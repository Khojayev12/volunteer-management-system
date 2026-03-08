# Volunteer Management System

React project structure prepared for scalable feature development.

## Folder Architecture

```text
src/
  app/                # app shell, providers, routes, app bootstrap
  assets/
    icons/            # SVG/icon files
    images/           # images and illustrations
    styles/           # global styles and theme tokens
  components/
    common/           # reusable UI components (Button, Input, Modal...)
    layout/           # layout pieces (Navbar, Sidebar, Footer...)
  constants/          # shared constants and enums
  features/           # feature-first modules (auth, volunteers, events...)
  hooks/              # shared custom hooks
  pages/              # route-level pages/screens
  services/
    api/              # API clients and request logic
    storage/          # local/session storage helpers
  store/              # state management setup
  tests/              # test utilities and integration specs
  types/              # shared TypeScript-style type contracts (or JS docs)
  utils/              # pure helper functions
  index.js            # React entry point
  reportWebVitals.js  # performance reporting
  setupTests.js       # testing setup
```

## Scripts

1. `npm start` - run development server.
2. `npm test` - run tests.
3. `npm run build` - create production build.

## Notes

1. Current app entry component is at `src/app/App.js`.
2. Global stylesheet is at `src/assets/styles/index.css`.
3. Default logo moved to `src/assets/images/logo.svg`.
