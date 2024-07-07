import { describe, expect, it, beforeAll, jest } from '@jest/globals';
import axios, {
  AxiosInstance,
  AxiosHeaders,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
import { AxiosInterceptor } from '../src/AxiosInterceptor';
import { Result, UserToken } from './type';

describe('AxiosInterceptor', () => {
  let axiosInstance: AxiosInstance;
  let axiosInterceptor: AxiosInterceptor<Result>;

  const userToken: UserToken = {
    accessToken: 'access-token',
    refreshToken: 'refresh-token',
  };

  const newRefreshToken: string = 'new-refresh-token';

  const headers = new AxiosHeaders();
  headers.set('Authorization', `Bearer ${userToken.accessToken}`);
  headers.set('Content-Type', 'application/json;charset=utf-8');

  beforeAll(() => {
    axiosInstance = axios.create({
      baseURL: 'http://localhost:3000',
      timeout: 1000,
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    });

    const errorHandler = (error: AxiosError<Result>) => {
      if (error.response) {
        console.log(`ErrorHandler is called`);
      }
    };

    axiosInterceptor = new AxiosInterceptor<Result>(
      axiosInstance,
      errorHandler,
      'development',
    );
  });

  it('should be defined', () => {
    expect(axiosInterceptor).toBeDefined();
  });

  it('should have onRequest method', () => {
    expect(axiosInterceptor.onRequest).toBeDefined();
  });

  it('should have onResponse method', () => {
    expect(axiosInterceptor.onResponse).toBeDefined();
  });

  it('should have onRequestError method', () => {
    expect(axiosInterceptor.onRequestError).toBeDefined();
  });

  it('should have onResponseError method', () => {
    expect(axiosInterceptor.onResponseError).toBeDefined();
  });

  it('should intercept requests and modify the config', async () => {
    const onRequestSpy = jest.spyOn(axiosInterceptor as any, 'onRequest');

    const testConfig: InternalAxiosRequestConfig<Result> = {
      url: '/test',
      method: 'get',
      headers,
    };

    axiosInterceptor.setupInterceptors();
    await axiosInstance.request(testConfig);

    expect(onRequestSpy).toHaveBeenCalled();
  });

  it('should intercept responses and modify the response', async () => {
    const onResponseSpy = jest.spyOn(axiosInterceptor, 'onResponse');

    axiosInstance.interceptors.response.use((response) => {
      axiosInterceptor.onResponse(response);
      return response;
    });

    await axiosInstance.request({
      url: '/test',
      method: 'get',
    });

    expect(onResponseSpy).toHaveBeenCalled();
  });

  it('should handle request errors', async () => {
    const onRequestErrorSpy = jest.spyOn(axiosInterceptor, 'onRequestError');
    const onHandlerErrorSpy = jest.spyOn(
      axiosInterceptor as any,
      'errorHandler',
    );

    axios.interceptors.request.use(function () {
      throw new Error('deadly error');
    });

    try {
      await axiosInstance.request({ url: '/test', method: 'get' });
    } catch (error) {
      // Log message was called
      expect(onRequestErrorSpy).toHaveBeenCalled();
      expect(onHandlerErrorSpy).toHaveBeenCalled();
    }
  });

  it('should handle response errors', async () => {
    const onResponseErrorSpy = jest.spyOn(axiosInterceptor, 'onResponseError');
    const onHandlerErrorSpy = jest.spyOn(
      axiosInterceptor as any,
      'errorHandler',
    );

    const error = new Error('deadly error');
    axios.interceptors.response.use(function () {
      throw error;
    });

    try {
      await axiosInstance.request({ url: '/test', method: 'get' });
    } catch (error) {
      expect(onResponseErrorSpy).toHaveBeenCalled();
      expect(onHandlerErrorSpy).toHaveBeenCalled();
    }
  });
});
