import { AxiosApiClient } from '../src/AxiosApiClient';
import { AxiosInterceptor } from '../src/AxiosInterceptor';
import { Result, Category, Product, Order, User } from './type';
import axios, { AxiosInstance } from 'axios';
import { describe, it, expect, beforeAll } from '@jest/globals';
import nock from 'nock';

describe('AxiosApiClient', () => {
  let apiClient: AxiosApiClient<Result>;
  let axiosInstance: AxiosInstance;
  let axiosInterceptor: AxiosInterceptor<Result>;

  beforeAll(() => {
    // Initialize the AxiosApiClient instance
    axiosInstance = axios.create({
      baseURL: 'http://localhost:3000',
      timeout: 1000,
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    });

    const errorHandler = (error: any) => {
      if (error.response) {
        console.log(`ErrorHandler is called`);
      }

      if (error.response.data) {
        return error.response.data;
      }

      // Else reject the promise with the error
      return Promise.reject(error);
    };

    axiosInterceptor = new AxiosInterceptor(
      axiosInstance,
      errorHandler,
      'development',
    );

    apiClient = new AxiosApiClient<Result>(axiosInterceptor);
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('should make a GET request', async () => {
    // Mock the GET request
    nock('http://localhost:3000').get('/api/data').reply(200, {
      message: 'Success',
    });

    // Make a GET request using the AxiosApiClient instance
    const response = await apiClient.get({
      url: '/api/data',
    });

    // Spy on the onResponse method
    // const onResponseSpy = jest.spyOn(axiosInterceptor, 'onResponse');

    // // Assert that the response is successful
    // expect(response.status).toBe(200);
    // expect(response.data).toEqual({ message: 'Success' });
    // expect(onResponseSpy).toHaveBeenCalled();
  });

  it('should make a POST request', async () => {
    // Mock the POST request
    const mockData = {
      statusCode: 201,
      data: {
        message: 'Data created'
      },
      message: 'Success',
      error: undefined,
    }
    nock('http://localhost:3000').post('/api/data').reply(201, mockData);

    // Make a POST request using the AxiosApiClient instance
    const response = await apiClient.post({
      url: '/api/data',
      data: { name: 'John Doe' },
    });

    // Assert that the response is successful
    expect(response.statusCode).toBe(201);
    expect(response.data).toEqual({ message: 'Data created' });
  });

  // Handle response errors
  it('should handle response errors', async () => {
    // Mock the POST request
    nock('http://localhost:3000').post('/api/data').reply(500);

    // Jest spy on the onErrorResponse method
    const onErrorResponseSpy = jest.spyOn(axiosInterceptor, 'onResponseError');

    // Jest spy on the onError errorHandler method
    const onErrorSpy = jest.spyOn(axiosInterceptor as any, 'errorHandler');

    // Make a POST request using the AxiosApiClient instance
    try {
      await apiClient.post({
        url: '/api/data',
        data: { name: 'John Doe' },
      });
    } catch (error) {
      // Assert that the onErrorResponse method is called
      expect(onErrorResponseSpy).toHaveBeenCalled();

      // Assert that the onError method is called
      expect(onErrorSpy).toHaveBeenCalled();
    }
  });

  // Test with reponse simple data: Category
  it('should make a GET request and return a Category', async () => {
    const categoryResponse: Result<Category> = {
      statusCode: 200,
      data: { id: 1, name: 'Electronics' },
      message: 'Success',
      error: undefined,
    };

    // Mock the GET request
    nock('http://localhost:3000').get('/api/category').reply(200, categoryResponse);

    // Make a GET request using the AxiosApiClient instance
    const response = await apiClient.get<Category>({
      url: '/api/category',
    });

    // Assert that the response is successful
    expect(response.statusCode).toBe(200);
    expect(response.data).toEqual({ id: 1, name: 'Electronics' });
  });

  // Test with reponse simple nested data: Product
  it('should make a GET request and return a Product', async () => {
    const productResponse: Result<Product> = {
      statusCode: 200,
      data: { id: 1, name: 'Laptop', price: 1000, quantity: 1, category: { id: 1, name: 'Electronics' }},
      message: 'Success',
      error: undefined,
    };

    // Mock the GET request
    nock('http://localhost:3000').get('/api/product').reply(200, productResponse);

    // Make a GET request using the AxiosApiClient instance
    const response = await apiClient.get<Product>({
      url: '/api/product',
    });

    // Assert that the response is successful
    expect(response.statusCode).toBe(200);
    expect(response.data).toEqual({ id: 1, name: 'Laptop', price: 1000, quantity: 1, category: { id: 1, name: 'Electronics' }});
  });

  // Test with reponse complex nested data: Order
  it('should make a GET request and return a Order', async () => {
    const orderResponse: Result<Order> = {
      statusCode: 200,
      data: {
        id: 1,
        user: { id: 1, name: 'John Doe', email: '', age: 30 },
        products: [
          { id: 1, name: 'Laptop', price: 1000, quantity: 1, category: { id: 1, name: 'Electronics' }},
          { id: 2, name: 'Mouse', price: 20, quantity: 1, category: { id: 1, name: 'Electronics' }},
        ],
      },
      message: 'Success',
      error: undefined,
    };

    // Mock the GET request
    nock('http://localhost:3000').get('/api/order').reply(200, orderResponse);

    // Make a GET request using the AxiosApiClient instance
    const response = await apiClient.get<Order>({
      url: '/api/order',
    });

    // Assert that the response is successful
    expect(response.statusCode).toBe(200);

    // Assert that the response data is correct
    expect(response.data).toEqual({
      id: 1,
      user: { id: 1, name: 'John Doe', email: '', age: 30 },
      products: [
        { id: 1, name: 'Laptop', price: 1000, quantity: 1, category: { id: 1, name: 'Electronics' }},
        { id: 2, name: 'Mouse', price: 20, quantity: 1, category: { id: 1, name: 'Electronics' }},
      ],
    });
  });

  // Test use response data from errorHandle: token expired
  it('should make a GET request and handle token expired', async () => {
    // Mock the GET request
    const mockData = {
      statusCode: 401,
      data: null,
      error: {
        errorCode: 'TOKEN_EXPIRED',
        message: 'token expired',
        details: [],
      },
    };

    nock('http://localhost:3000').get('/api/data').reply(401, mockData);

    // Jest spy on the onErrorResponse method
    const onErrorResponseSpy = jest.spyOn(axiosInterceptor, 'onResponseError');

    // Jest spy on the onError errorHandler method
    const onErrorSpy = jest.spyOn(axiosInterceptor as any, 'errorHandler');

    // Make a GET request using the AxiosApiClient instance
    const result = await apiClient.get({
      url: '/api/data',
    });

    // Assert that the onErrorResponse method is called
    expect(onErrorResponseSpy).toHaveBeenCalled();

    // Assert that the onError method is called
    expect(result).toEqual(mockData);

    // Assert that the onError method is called
    expect(onErrorSpy).toHaveBeenCalled();
  });
});
