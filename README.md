# API-CLIENT
> This is an axios extension that makes it easier for developers to call the API through the application

## Fetures
- Support standards request: `GET`, `POST`, `PATCH`, `DELETE`, `PUT`.
- Allow customize Axios Instance and Error Handling function.
- TypeScript Compatibility.
- Allow extend and modify API wrapper client by implement interfaces and extends base interceptor.

## Installation

Npm: 
```sh
npm install @devboostsolution/api-client
```

Yarn:

```sh
yarn install @devboostsolution/api-client
```

## Usage example

### Initilze API client
```typescript
/**
 * Step:
 * 1. Init axios instance
 * 2. Define errorHandle function
 * 3. Init axios interceptor
 * 4. Init axios api client
 */
const axiosInstance = axios.create({
  baseURL: process.env.BASE_URL,
  timeout: 1000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
});

onst errorHandler = (error: any) => {
  if (error.response) {
    console.log(`ErrorHandler is called`);
  }

  if (error.response.data) {
    return error.response.data;
  }

  return Promise.reject(error);
};

// Mode: development, production, test
const axiosInterceptor = new AxiosInterceptor(
  axiosInstance,
  errorHandler,
  'development', 
);

const apiClient = new AxiosApiClient(axiosInterceptor);

const response = await apiClient.get({ url: '/api/category' });
```

## Development setup

Clone the repository 

```sh
make install
npm test
```

## Meta

Distributed under the MOT license. See ``LICENSE`` for more information.

[https://github.com/DevBoostSolutions/api-client](https://github.com/Blue-Pheasant)

## Contributing

1. Fork it (<https://github.com/DevBoostSolutions/api-client/fork>)

2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request

<!-- Markdown link & img dfn's -->
[npm-image]: https://img.shields.io/npm/v/datadog-metrics.svg?style=flat-square
[npm-url]: https://npmjs.org/package/datadog-metrics
[npm-downloads]: https://img.shields.io/npm/dm/datadog-metrics.svg?style=flat-square
[travis-image]: https://img.shields.io/travis/dbader/node-datadog-metrics/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/dbader/node-datadog-metrics
[wiki]: https://github.com/yourname/yourproject/wiki
