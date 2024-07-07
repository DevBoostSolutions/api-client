export interface TResponse<T> {
  data: T;
}

/**
 * Implementations need to implement this interface to be able to use the API client.
 * @author LongVQ
 * @date 2024/07/05
 * @memberof API
 */
export interface IApiClient {
  /**
   * Sends a GET request to the specified URL.
   * @param url - The URL to send the request to.
   * @returns A Promise that resolves to the response data.
   */
  get(config: any): Promise<any>;

  /**
   * Sends a POST request to the specified URL with the provided data.
   * @param url - The URL to send the request to.
   * @param data - The data to send with the request.
   * @returns A Promise that resolves to the response data.
   */
  post(config: any): Promise<any>;

  /**
   * Sends a PUT request to the specified URL with the provided data.
   * @param url - The URL to send the request to.
   * @param data - The data to send with the request.
   * @returns A Promise that resolves to the response data.
   */
  put(config: any): Promise<any>;

  /**
   * Sends a DELETE request to the specified URL.
   * @param url - The URL to send the request to.
   * @returns A Promise that resolves to the response data.
   */
  delete(config: any): Promise<any>;

  /**
   * Sends a PATCH request to the specified URL with the provided data.
   * @param url - The URL to send the request to.
   * @param data - The data to send with the request.
   * @returns A Promise that resolves to the response data.
   */
  patch(config: any): Promise<any>;

  /**
   * Sends a request to the specified URL with the provided data.
   * @param url - The URL to send the request to.
   * @param data - The data to send with the request.
   * @returns A Promise that resolves to the response data.
   */
  request(config: any): Promise<any>;
}

/**
 * Implementations need to implement this interface to be able to use the interceptor.
 * @memberof IInterceptor
 */
export interface IInterceptor {
  /**
   * Get the Axios instance with interceptors set up.
   * @returns The Axios instance.
   */
  getInstance(): any;

  /**
   * Set up request and response interceptors.
   */
  setupInterceptors(): void;

  /**
   * Modify the request config before sending.
   * @param config - The request config.
   * @returns The modified request config.
   */
  onRequest(config: any): any;

  /**
   * Handle request error.
   * @param error - The request error.
   * @returns The rejected promise.
   */
  onRequestError(error: any, errorHandler: (error: any) => any): any;

  /**
   * Handle successful response.
   * @param response - The successful response.
   * @returns The response.
   */
  onResponse(response: any): any;

  /**
   * Handle response error.
   * @param error - The response error.
   * @returns The rejected promise.
   */
  onResponseError(error: any, errorHandler: (error: any) => any): any;

  /**
   * Logging
   * @param error - The error.
   * @returns The rejected promise.
   */
  logging(level: 'error' | 'warning' | 'info', message: any): void;
}
