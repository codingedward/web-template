import { Algorithm as JwtAlgorithm } from 'jsonwebtoken';

type AppConfig = Readonly<{
  name: string;
  env: string;
  isTest: boolean;
  isProduction: boolean;
  isDevelopment: boolean;
  graphql: Readonly<{
    path: string;
    enableTracing: boolean;
    enableIntrospection: boolean;
  }>;
  server: Readonly<{
    port: number;
    url: string;
  }>;
  session: Readonly<{
    secret: string;
  }>;
  authentication: Readonly<{
    bcryptSaltLength: number;
    jwt: Readonly<{
      algorithm: JwtAlgorithm;
      secret: string;
      expiry: string;
    }>;
  }>;
}>;

// eslint-disable-next-line no-magic-numbers
const apiPort = parseInt(process.env.API_PORT, 10) || 4000;

const appConfig: AppConfig = {
  name: process.env.APP_NAME || 'App',
  env: process.env.NODE_ENV || 'production',
  isTest: process.env.NODE_ENV === 'test',
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
  server: {
    port: apiPort,
    url: `https://localhost:${apiPort}`,
  },
  graphql: {
    path: process.env.GRAPHQL_PATH || '/graphql',
    enableTracing: process.env.GRAPHQL_ENABLE_TRACING
      ? process.env.GRAPHQL_ENABLE_TRACING === 'true'
      : true,
    enableIntrospection: process.env.GRAPHQL_ENABLE_INTROCPECTION
      ? process.env.GRAPHQL_ENABLE_INTROCPECTION === 'true'
      : true,
  },
  session: {
    secret: process.env.SESSION_SECRET,
  },
  authentication: {
    // eslint-disable-next-line no-magic-numbers
    bcryptSaltLength: parseInt(process.env.AUTH_BCRYPT_SALT_LENGTH, 10) || 14,
    jwt: {
      algorithm: process.env.AUTH_JWT_ALGO as JwtAlgorithm,
      secret: process.env.AUTH_JWT_SECRET,
      expiry: process.env.AUTH_JWT_EXPIRY,
    },
  },
};

export default appConfig;
