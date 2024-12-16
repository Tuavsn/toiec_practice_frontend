import axiosClient from "axios";



/**
 * Creates an initial 'axios' instance with custom settings.
 */

const instance = axiosClient.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
});



// const handleRefreshToken = async (): Promise<string | null> => {
//     return await mutex.runExclusive(async () => {
//         const res = await instance.get<IBackendRes<AccessTokenResponse>>('/api/v1/auth/refresh');
//         if (res && res.data) return res.data.access_token;
//         else return null;
//     });
// };

instance.interceptors.request.use(function (config) {
    if (typeof window !== "undefined" && window && window.localStorage && window.localStorage.getItem('access_token')) {
        config.headers.Authorization = 'Bearer ' + window.localStorage.getItem('access_token');
    }
    if (!config.headers.Accept && config.headers["Content-Type"]) {
        config.headers.Accept = "application/json";
        config.headers["Content-Type"] = "application/json; charset=utf-8";
    }
    return config;
});

/**
 * Handle all responses. It is possible to add handlers
 * for requests, but it is omitted here for brevity.
 */
instance.interceptors.response.use(
    (res) => res,
    async (error) => {


        // if (error.config && error.response
        //     && +error.response.status === 401
        //     && !error.config.headers[NO_RETRY_HEADER]
        // ) {
        //     // const access_token = await handleRefreshToken();
        //     const access_token = "";
        //     error.config.headers[NO_RETRY_HEADER] = 'true'
        //     if (access_token) {
        //         error.config.headers['Authorization'] = `Bearer ${access_token}`;
        //         localStorage.setItem('access_token', access_token)
        //         return instance.request(error.config);
        //     }
        //     console.log("58", error);

        // }
        if (error.status === 401) {
            localStorage.clear();
            window.location.href = '/home?login=true'
            return;
        }
        throw error;
    }
);

/**
 * Replaces main `axios` instance with the custom-one.
 *
 * @param cfg - Axios configuration object.
 * @returns A promise object of a response of the HTTP request with the 'data' object already
 * destructured.
 */
// const axios = <T>(cfg: AxiosRequestConfig) => instance.request<any, T>(cfg);

// export default axios;

export default instance;