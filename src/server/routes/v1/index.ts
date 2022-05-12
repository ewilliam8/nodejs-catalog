import * as Joi from 'joi';
import { directions, getprofiles, profiles, userInfo, saveInfo } from '../../api/catalog'; 

export default [
  {
    method: 'GET',
    path: '/directions',
    handler: directions,
    options: {
      id: 'directions',
      auth: false,
      description: 'This method returns global directions from a DataBase.',
      tags: ['api', 'Get', 'all']
    },
  },{
    method: 'GET',
    path: '/profiles',
    handler: profiles,
    options: {
      id: 'profiles',
      auth: false,
      description: 'This method returns global profiles from a DataBase.',
      tags: ['api', 'Get', 'all', "profiles"]
    },
  },{
    method: 'GET',
    path: '/profiles/{id}',
    handler: getprofiles,
    options: {
      id: 'getprofiles',
      auth: false,
      description: 'This method returns all profiles of a direction from a DataBase.',
      tags: ['api', 'Get', 'profiles'],
      validate: {
        params: Joi.object({
          id: Joi.number().positive().min(0).max(1000).required(),
        }),
        failAction: (req, h, err) =>
          err.isJoi ? h.response(err.details[0]).takeover().code(400) : h.response(err).takeover(),
      },
    },
  },{
    method: 'GET',
    path: '/info/{username}',
    handler: userInfo,
    options: {
      id: 'getuserdirections',
      auth: false,
      description: 'This method returns all profiles of a direction from a DataBase.',
      tags: ['api', 'Get', 'User', 'Directions'],
      validate: {
        params: Joi.object({
          username: Joi.string().min(0).max(50).required(),
        }),
        failAction: (req, h, err) =>
          err.isJoi ? h.response(err.details[0]).takeover().code(400) : h.response(err).takeover(),
      },
    },
  },{
    method: 'POST',
    path: '/save',
    handler: saveInfo,
    options: {
      id: 'saveInfo',
      auth: false,
      description: 'This method takes all profiles of a direction from a DataBase.',
      tags: ['api', 'post', 'User', 'save'],
      // validate: {
      //   payload: Joi.object({
      //     user_directions: Joi.array().required(),
      //     profile_user: Joi.array().required(),
      //     username: Joi.string().min(1).max(60).required(),
      //   }),
      //   failAction: (req, h, err) =>
      //     err.isJoi ? h.response(err.details[0]).takeover().code(400) : h.response(err).takeover(),
      // },
    },
  },
  
];
