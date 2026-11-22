// Runtime configuration loader
// During production, API URLs are loaded from /config.json at runtime
// (set on window.__RUNTIME_CONFIG__ by the inline script in index.html).
// During development (npm start), falls back to process.env from .env file.
const runtimeConfig = (typeof window !== 'undefined' && window.__RUNTIME_CONFIG__) || {};

const config = {
    appURL: runtimeConfig.REACT_APP_API_BASE_BASE_URL || process.env.REACT_APP_API_BASE_BASE_URL,
    gatewayURL: runtimeConfig.REACT_APP_API_BASE_GATEWAY_URL || process.env.REACT_APP_API_BASE_GATEWAY_URL,
    version: runtimeConfig.VERSON || runtimeConfig.VERSION || process.env.REACT_APP_VERSION
};

export default config;
