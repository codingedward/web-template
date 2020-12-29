import { Request } from 'express';
import {
  Arg,
  Authorized,
  Ctx,
  Field,
  ID,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from 'type-graphql';

import User from '../../models/User';
import Authentication from '../../modules/authentication';

@InputType()
class UserInput implements Partial<User> {
  @Field()
  email!: string;

  @Field()
  password!: string;

  @Field()
  firstName!: string;

  @Field()
  lastName!: string;
}

@InputType()
class LoginInput implements Partial<User> {
  @Field()
  email!: string;

  @Field()
  password!: string;
}

@ObjectType('JwtLogin')
export class JwtLoginType {
  @Field()
  user!: User;

  @Field()
  token!: string;
}

@Resolver(User)
class UserResolver {
  @Mutation(() => User, { nullable: true })
  async registerUser(@Arg('input') input: UserInput): Promise<User> {
    return User.create({
      ...input,
      password: await Authentication.hashPassword(input.password),
    }).save();
  }

  @Mutation(() => User, { nullable: true })
  async login(
    @Arg('input') input: LoginInput,
    @Ctx() request: Request
  ): Promise<User | null> {
    return Authentication.authenticateSessionUser(
      {
        email: input.email,
        password: input.password,
      },
      request
    );
  }

  @Mutation(() => JwtLoginType, { nullable: true })
  async jwtLogin(
    @Arg('input') input: LoginInput,
    @Ctx() request: Request
  ): Promise<JwtLoginType | null> {
    return Authentication.authenticateJwtUser(
      {
        email: input.email,
        password: input.password,
      },
      request
    );
  }

  @Authorized()
  @Query(() => User, { nullable: true })
  async user(@Arg('id', type => ID) id: number): Promise<User | null> {
    return User.findOne(id);
  }
}

export default UserResolver;
