import axios, {
  AxiosInstance,
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { IInterceptor } from './type';
import { BaseInterceptor } from './BaseInterceptor';

/**
 * An implementation of the interceptor using Axios.
 * @extends BaseInterceptor
 * @implements IInterceptor
 */
export class AxiosInterceptor
  extends BaseInterceptor<
    AxiosInstance,
    InternalAxiosRequestConfig,
    AxiosResponse
  >
  implements IInterceptor
{
  private errorHandler: (error: AxiosError) => any;

  constructor(
    instance: AxiosInstance,
    errorHandler: (error: AxiosError) => any,
    environment: string,
  ) {
    super(instance, environment);
    this.errorHandler = errorHandler;
    this.setupInterceptors();
  }

  /**
   * Intercept request and modify the config if needed.
   * @param config The request configuration.
   * @returns The modified request configuration.
   */
  public onRequest(
    config: InternalAxiosRequestConfig<any>,
  ): InternalAxiosRequestConfig<any> {
    return config;
  }

  /**
   * Intercept response and modify the data if needed.
   * @param response The response.
   * @returns The modified response.
   */
  public onResponse(response: AxiosResponse): AxiosResponse {
    return response;
  }

  /**
   * Handle errors in the request.
   * @param error The error object.
   * @returns The error promise rejection.
   */
  public onRequestError(error: AxiosError): any {
    this.logging('error', error);
    return Promise.reject(error);
  }

  /**
   * Handle errors in the response.
   * @param error The error object.
   * @returns The error promise rejection.
   */
  public onResponseError(error: any): any {
    try {
      this.logging('error', error);
      return this.errorHandler(error);
    } catch (error) {
      this.logging('error', error);
    }

    return Promise.reject(error);
  }

  /**
   * Set up request and response interceptors.
   */
  public setupInterceptors(): void {
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => this.onRequest(config),
      (error: any) => this.onRequestError(error),
    );

    this.instance.interceptors.response.use(
      (response: AxiosResponse) => this.onResponse(response),
      (error: any) => this.onResponseError(error),
    );
  }
}
