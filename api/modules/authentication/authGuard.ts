import { Request } from 'express';
import { AuthChecker } from 'type-graphql';

const customAuthChecker: AuthChecker<Request> = ({ context }) => {
  return context.isAuthenticated();
};

export default customAuthChecker;
