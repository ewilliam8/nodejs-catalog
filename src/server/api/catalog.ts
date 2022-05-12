import { Op } from 'sequelize';
import { error, output } from '../utils';
import { direction } from '../models/direction';
import { profile } from '../models/profile';
import { direction_user } from '../models/direction_user';
import { profile_user as user_profiles } from '../models/profile_user';
import { users } from '../models/users';

export const directions = async (r) => {
    try {

      const dataArray = await direction.findAll()

      if(!dataArray) {
        console.log('There is no any line')
        return output({});
      }

      return output({ data: dataArray })
    } catch (e) {
        console.log(e);
        return error(500000, 'Failed to get all lines', null);
    } 
}
export const profiles = async (r) => {
  try {

    const dataArray = await profile.findAll()

    if(!dataArray) {
      console.log('There is no any line')
      return output({});
    }

    return output({ data: dataArray })
  } catch (e) {
      console.log(e);
      return error(500000, 'Failed to get all lines', null);
  } 
}
export const getprofiles = async (r) => {
    try {
      const data = await profile.findAll({
        where: {
          direction_id: {
            [Op.eq]: r.params.id,
          }
        }
      })

      if(!data) {
        console.log('There is no any line')
        return output({});
      }

      return output({ data: data })
    } catch (e) {
        console.log(e);
        return error(500000, 'Failed to get all lines', null);
    } 
}

export const userInfo = async (r) => {
  try {
    const data = await users.findOne({
      where: {
        name: {
          [Op.eq]: r.params.username,
        }
      }
    })

    if(!data) {
      console.log('There is no any line')
      return output({});
    }

    const user_directions = await direction_user.findAll({
      where: {
        user_id: {
          [Op.eq]: data["id"],
        }
      }
    })

    const user_profile = await user_profiles.findAll({
      where: {
        user_id: {
          [Op.eq]: data["id"],
        }
      }
    })

    return output({ user_directions: user_directions, profile_user: user_profile})
  } catch (e) {
      console.log(e);
      return error(500000, 'Failed to get all lines', null);
  } 
}

export const saveInfo = async (r) => {
  try {

    const res = JSON.parse(r.payload)

    const {
      user_directions,
      profile_user,
      username,
    } = res

    const data = await users.findOne({
      where: {
        name: {
          [Op.eq]: username,
        }
      }
    })

    let user
    if (data == null) {
      user = await users.create({
        "id": Math.floor(Math.random() * 1000000),
        "name": username
      })
    }

    // user_directions
    res.user_directions.forEach(async (elem) => {
      direction_user.create({
        "id": Math.floor(Math.random() * 1000000),
        "user_id": user.dataValues.id,
        "direction_id": elem.direction_id,
        "priority": elem.priority,
        "createdAt": elem.createdAt,
        "updatedAt": elem.updatedAt
      })
    })

    // profile_user
    res.profile_user.forEach(async (elem) => {
      user_profiles.create({
        "id": Math.floor(Math.random() * 1000000),
        "user_id": user.dataValues.id,
        "profile_id": elem.profile_id,
        "direction_id": elem.direction_id,
        "priority": elem.priority,
        "createdAt": elem.createdAt,
        "updatedAt": elem.updatedAt
      })
    })

    console.log('A line was created')
    return output({ data: "ok" });

  } catch (e) {
      console.log(e);
      return error(500000, 'Failed to create a line', null);
  } 
}

export const clear = async (r) => {

}
