import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

import appConfig from '../../config';
import User from '../../models/User';
import { JwtLoginType } from '../../graphql/types/user';

interface AuthenticateUserData {
  email: string;
  password: string;
}

class Authentication {
  static initialize(app: express.Application): void {
    this.setupSessionSerialization();
    this.setupAuthenticationStrategies();
    this.attachPassportMiddlewares(app);
  }

  static async authenticateSessionUser(
    authInfo: AuthenticateUserData,
    request: express.Request
  ): Promise<User> {
    const user: User = await User.findOne({ where: { email: authInfo.email } });
    if (
      user &&
      (await this.checkUserPasswordIsCorrect({
        user,
        password: authInfo.password,
      }))
    ) {
      return new Promise((resolve, reject) => {
        request.login(user, error => {
          if (error) {
            return reject(error);
          }
          return resolve(user);
        });
      });
    }
    throw new Error('Invalid email or password');
  }

  static async authenticateJwtUser(
    authInfo: AuthenticateUserData,
    request: express.Request
  ): Promise<JwtLoginType> {
    const user: User = await User.findOne({ where: { email: authInfo.email } });
    if (
      user &&
      (await this.checkUserPasswordIsCorrect({
        user,
        password: authInfo.password,
      }))
    ) {
      return new Promise((resolve, reject) => {
        request.login(user, error => {
          if (error) {
            return reject(error);
          }
          return resolve({
            user,
            token: this.createUserJwtToken(user),
          });
        });
      });
    }
  }

  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, appConfig.authentication.bcryptSaltLength);
  }

  private static setupSessionSerialization(): void {
    passport.serializeUser<User, string>((user, callback) => {
      callback(
        null,
        JSON.stringify({
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          __version: 1,
        })
      );
    });
    passport.deserializeUser<User, string>((user, callback) => {
      callback(null, JSON.parse(user));
    });
  }

  private static setupAuthenticationStrategies(): void {
    passport.use(
      new JwtStrategy(
        {
          ignoreExpiration: false,
          issuer: appConfig.server.url,
          audience: appConfig.server.url,
          secretOrKey: appConfig.authentication.jwt.secret,
          algorithms: [appConfig.authentication.jwt.algorithm],
          jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        },
        async function (jwtPayload, done) {
          const user = await User.findOne({ where: { id: jwtPayload.id } });
          if (user) {
            return done(null, user);
          }
          return done(new Error('Invalid credentials'), false);
        }
      )
    );
  }

  private static attachPassportMiddlewares(app: express.Application): void {
    app.use(passport.initialize());
    app.use((req, res, next) => {
      if (req.headers.authorization) {
        return passport.authenticate('jwt')(req, res, next);
      }
      return next();
    });
    app.use(passport.session());
  }

  private static async checkUserPasswordIsCorrect({
    user,
    password,
  }: {
    user: User;
    password: string;
  }): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }

  private static createUserJwtToken(user: User): string {
    return jwt.sign(
      {
        id: user.id,
      },
      appConfig.authentication.jwt.secret,
      {
        jwtid: user.id.toString(),
        issuer: appConfig.server.url,
        audience: appConfig.server.url,
        algorithm: appConfig.authentication.jwt.algorithm,
        expiresIn: appConfig.authentication.jwt.expiry,
      }
    );
  }
}

export default Authentication;
