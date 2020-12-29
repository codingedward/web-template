import 'reflect-metadata';
import { createConnection } from 'typeorm';

class Database {
  static async initialize(): Promise<void> {
    await createConnection();
  }
}

export default Database;
