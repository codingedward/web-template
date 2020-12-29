import express from 'express';

import appConfig from '../config';
import GraphQL from '../graphql';
import Database from '../database';
import Session from '../modules/session';
import Authentication from '../modules/authentication';

const port = appConfig.server.port;
const app: express.Application = express();

(async (): Promise<void> => {
  await Database.initialize();
  Session.initialize(app);
  Authentication.initialize(app);
  await GraphQL.initialize(app);

  app.listen(port, () => {
    console.log(
      `> Listening on http://localhost:${port}!\n> GraphQL server at http://localhost:${port}/graphql`
    );
  });
})();
