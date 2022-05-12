import { Sequelize, } from 'sequelize-typescript';
import config from '../config/config';
import { direction } from './direction';
import { direction_user } from './direction_user';
import { profile } from './profile';
import { profile_user } from './profile_user';
import { users } from './users';

export const initDatabase = async () => {
  try {
    const sequelize = new Sequelize(config.dbLink, {
      dialect: 'postgres',
      models: [ direction,
                direction_user,
                profile,
                profile_user,
                users ],
      logging: false,
      dialectOptions: {}
    });

    await sequelize.sync();
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    return sequelize;
  }
  catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

export default initDatabase;
