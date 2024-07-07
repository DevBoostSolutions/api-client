import { IInterceptor } from './type';

export abstract class BaseInterceptor<TInstance, TRequestConfig, TResponse>
  implements IInterceptor
{
  protected instance: TInstance;
  protected environment: string = 'development';

  constructor(instance: TInstance, environment: string) {
    this.instance = instance;
    this.environment = environment || 'development';
  }

  /**
   * Get the instance with interceptors set up.
   * @returns The instance.
   */
  public getInstance(): TInstance {
    return this.instance;
  }

  /**
   * Intercept request and modify the config if needed.
   * @param config The request configuration.
   * @returns The modified request configuration.
   */
  public abstract onRequest(config: TRequestConfig): TRequestConfig;

  /**
   * Intercept response and modify the data if needed.
   * @param response The response.
   * @returns The modified response.
   */
  public abstract onResponse(response: TResponse): TResponse;

  /**
   * Handle errors in the request.
   * @param error The error object.
   * @returns The error promise rejection.
   */
  public abstract onRequestError(
    error: any,
    errorHandler: (error: any) => any,
  ): any;

  /**
   * Handle errors in the response.
   * @param error The error object.
   * @returns The error promise rejection.
   */
  public abstract onResponseError(
    error: any,
    errorHandler: (error: any) => any,
  ): any;

  /**
   * Set up request and response interceptors.
   */
  public abstract setupInterceptors(): void;

  /**
   * Log messages to the console based on the environment and log level.
   * @param level
   * @param message
   */
  public logging(level: 'error' | 'warning' | 'info', message: any): void {
    message = typeof message === 'string' ? message : JSON.stringify(message);
    if (this.environment === 'development') {
      switch (level) {
        case 'error':
          console.error(message);
          break;
        case 'warning':
          console.warn(message);
          break;
        case 'info':
          console.info(message);
          break;
        default:
          console.log(message);
      }
    }
  }
}
