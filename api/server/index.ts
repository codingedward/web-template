import 'reflect-metadata';
import dotenv from 'dotenv';

dotenv.config();
dotenv.config({ path: `${process.cwd()}/api/.env` });

require('./server');
