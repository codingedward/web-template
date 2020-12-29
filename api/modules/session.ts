import express from 'express';
import session from 'express-session';

import appConfig from '../config';

class Session {
  static initialize(app: express.Application): void {
    if (appConfig.isProduction) {
      app.set('trust proxy', true);
    }
    app.use(session(Session.getOptions()));
  }

  static getOptions(): session.SessionOptions {
    return {
      secret: appConfig.session.secret,
      resave: true,
      saveUninitialized: true,
      cookie: appConfig.isProduction ? { secure: true } : {},
    };
  }
}

export default Session;
