/*eslint-disable*/
import axios from 'axios';
import { GetauthorizationToken, GetauthorizationTokenUser } from '../actions/otherActions';
import { GENERAL_TYPE, REGISTERED_TYPE, } from '../constants/otherConstant';
const BASE_URL = "https://cp.aide.com.bd";
//const BASE_URL = process.env.MYURL


const authorizationInfoStorage = localStorage.getItem('Authorization') ? JSON.parse(localStorage.getItem('Authorization')) : null
const userAuthorizationInfoStorage = localStorage.getItem('UserAuthorization') ? JSON.parse(localStorage.getItem('UserAuthorization')) : null




const getToken = (type) => {

  if (type === GENERAL_TYPE) {
    return authorizationInfoStorage ? authorizationInfoStorage.access_token : GetauthorizationToken()
  } else if (type === REGISTERED_TYPE) {
    return userAuthorizationInfoStorage ? userAuthorizationInfoStorage.access_token : GetauthorizationTokenUser()
  } else {
    return type
  }
}

const axiosInstance = (type) => {


  const token = getToken(type)

  const instance = axios.create();

  instance.defaults.headers.post['Content-Type'] =
    'application/x-www-form-urlencoded; charset=utf-8';
  instance.defaults.headers['Accept'] =
    'application/json';
  instance.defaults.timeout = 15000;
  instance.defaults.baseURL = BASE_URL;
  if (type !== 'nothing') {
    instance.defaults.headers.common["Authorization"] = "bearer " + token;
  }
  instance.interceptors.request.use(
    function (config) {
      // Do something before request is sent
      if (type !== 'nothing') {
        config.headers['Authorization'] = 'bearer ' + token;
      }
      return config;
    },
    function (error) {
      return Promise.reject(error);
    },
  );

  // Add a response interceptor
  instance.interceptors.response.use(
    function (response) {
      // Any status code that lie within the range of 2xx cause this function to trigger
      // Do something with response data
      const responseObject = {
        // status: response.data.StatusCode? response.data.StatusCode: response.status,
        status: response.status,
        data: response.data,
      };
      //console.log(responseObject)
      return responseObject;
    },
    function (error) {
      // Any status codes that falls outside the range of 2xx cause this function to trigger
      // Do something with response error
      // const errorObject = {
      //   status: error.response === undefined ? 500 : error.response.status,
      //   data:
      //     error.response === undefined
      //       ? 'Network Error'
      //       : error.response.status,
      // };
      // console.log(JSON.stringify(error.response))
      return Promise.reject(error);
    },
  );
  return instance;
};
export default axiosInstance;
