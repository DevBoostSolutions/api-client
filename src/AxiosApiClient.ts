import {
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  AxiosInstance,
} from 'axios';
import { IApiClient } from './type';
import { AxiosInterceptor } from './AxiosInterceptor';

/**
 * An implementation API client that sends requests using Axios.
 * @template T - The template of the response data.
 * @implements IApiClient
 */
export class AxiosApiClient implements IApiClient {
  private axiosInstance: AxiosInstance;

  /**
   * Creates an instance of the AxiosApiClient.
   * @param interceptor - The interceptor to use for the requests.
   */
  constructor(interceptor: AxiosInterceptor) {
    this.axiosInstance = interceptor.getInstance();
  }

  /**
   * Sends a GET request to the specified URL.
   * @typeparam T - The type of the response data.
   * @param url - The URL to send the request to.
   * @returns A Promise that resolves to the response data.
   */
  public async get<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.request({ ...config, method: 'GET' });
  }

  /**
   * Sends a POST request to the specified URL with the provided data.
   * @typeparam T - The type of the response data.
   * @param url - The URL to send the request to.
   * @param data - The data to send with the request.
   * @returns A Promise that resolves to the response data.
   */
  public async post<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.request({ ...config, method: 'POST' });
  }

  /**
   * Sends a PUT request to the specified URL with the provided data.
   * @typeparam T - The type of the response data.
   * @param url - The URL to send the request to.
   * @param data - The data to send with the request.
   * @returns A Promise that resolves to the response data.
   */
  public async put<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.request({ ...config, method: 'PUT' });
  }

  /**
   * Sends a DELETE request to the specified URL.
   * @typeparam T - The type of the response data.
   * @param url - The URL to send the request to.
   * @returns A Promise that resolves to the response data.
   */
  public async delete<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.request({ ...config, method: 'DELETE' });
  }

  /**
   * Sends a PATCH request to the specified URL with the provided data.
   * @typeparam T - The type of the response data.
   * @param url - The URL to send the request to.
   * @param data - The data to send with the request.
   * @returns A Promise that resolves to the response data.
   */
  public async patch<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.request({ ...config, method: 'PATCH' });
  }

  /**
   * Sends a request to the specified URL with the provided configuration.
   * @typeparam T - The type of the response data.
   * @param config - The configuration for the request.
   * @returns A Promise that resolves to the response data.
   */
  public async request<T = any>(config: AxiosRequestConfig): Promise<T> {
    return new Promise((resolve, reject) => {
      this.axiosInstance
        .request<any, AxiosResponse<T>>(config)
        .then((res: AxiosResponse<T>) => {
          if (res && res.data) {
            resolve(res.data);
          } else {
            resolve(res as any);
          }
        })
        .catch((e: AxiosError) => {
          reject(e);
        });
    });
  }
}
