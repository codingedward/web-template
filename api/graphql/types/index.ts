import UserFields from './user';
import { NonEmptyArray } from 'type-graphql';

// eslint-disable-next-line  @typescript-eslint/ban-types
const resolvers: NonEmptyArray<Function> = [UserFields];

export default resolvers;
