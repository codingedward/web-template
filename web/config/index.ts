type WebAppConfig = Readonly<{
  name: string;
  isTest: boolean;
  isProduction: boolean;
  isDevelopment: boolean;
  server: Readonly<{
    port: number;
  }>;
  graphql: Readonly<{
    uri: string;
    credentials: string;
  }>;
}>;

// eslint-disable-next-line no-magic-numbers
const webPort = parseInt(process.env.WEB_PORT, 10) || 3000;

const appConfig: WebAppConfig = {
  name: process.env.APP_NAME || 'App',
  isTest: process.env.NODE_ENV === 'test',
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
  server: {
    port: webPort,
  },
  graphql: {
    uri: 'http://localhost:4000/graphql',
    credentials: process.env.GRAPHQL_CREDENTIALS || 'same-origin',
  },
};

export default appConfig;
