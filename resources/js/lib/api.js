import axios from 'axios';

const api = axios.create({
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        Accept: 'application/json',
    },
    withCredentials: true,
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',
});

let csrfReady = false;
const hasXsrfCookie = () => (typeof document !== 'undefined' ? document.cookie.includes('XSRF-TOKEN') : false);
const ensureCsrf = async () => {
    if (csrfReady && hasXsrfCookie()) return;
    await axios.get('/sanctum/csrf-cookie', { withCredentials: true });
    csrfReady = true;
};

api.interceptors.request.use(
    async (config) => {
        const method = (config.method || 'get').toLowerCase();
        const safe = ['get', 'head', 'options'].includes(method);
        if (!safe) {
            await ensureCsrf();
        }
        return config;
    },
    (error) => Promise.reject(error),
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 419) {
            window.location.reload();
        }
        return Promise.reject(error);
    },
);

export default api;
