import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import model from '../database/models';
import { sendVerificationEmail } from '../middlewares/sendEmail';
import { template } from '../utils/emailVerificationtemplate';

dotenv.config();

export const signup = (req, res) => {
  model.User.findOne({
    where: {
      email: req.body.email
    }
  })
    .then((user) => {
      if (user) {
        return res.status(409).json({
          message: res.__('Email already registered'),
        });
      }
      model.User.create({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        telephone: req.body.telephone || '',
        email: req.body.email,
        password: req.body.password,
        gender: req.body.gender || '',
        origin: req.body.origin || '',
        profession: req.body.profession || '',
        age: req.body.age || 0,
        identification_type: req.body.identification_type || 'ID',
        identification_number: req.body.identification_number || '',
        user_image: req.file ? req.file.filename : ''
      })
        .then((user1) => {
          const token = jwt.sign(JSON.parse(JSON.stringify(user1)), process.env.JWT_KEY, { expiresIn: '1h' });
          jwt.verify(token, process.env.JWT_KEY, () => {});
          res.status(201).json({
            message: res.__('User registered'),
            user_details: user1,
            token: `JWT ${token}`
          });
          sendVerificationEmail(user.firstname, user.email, token);
          sendVerificationEmail(user1.firstname, user1.email, token);
        });
    })
    .catch((error) => res.status(400).json(error.message));
};
let token;

export const signin = (req, res) => {
  model.User.findOne({
    where: {
      email: req.body.email
    }
  })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          message: res.__('Authentication failed. User not found.'),
        });
      }
      user.comparePassword(req.body.password, (err, isMatch) => {
        if (isMatch && !err) {
          token = jwt.sign(JSON.parse(JSON.stringify(user)), process.env.JWT_KEY, { expiresIn: '24h' });
          jwt.verify(token, process.env.JWT_KEY, () => { });
          user.password = undefined;
          res.json({ success: true, token: `JWT ${token}`, user });
        } else {
          res.status(401).json({ success: false, message: res.__('Authentication failed. Wrong password.') });
        }
      });
    })
    .catch((error) => res.status(400).json(error.message));
};

export const getAllUsers = async (req, res) => {
  const user = await model.User.findAll();
  if (user) {
    return res.status(200).json({ user });
  }
};

export const getUserById = async (req, res) => {
  const { id } = req.params;
  const user = await model.User.findByPk(id);

  if (user) {
    return res.status(200).json({ user });
  }
  return res.status(404).json({ message: res.__('No User with the specified') });
};

export const updateUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    const { password } = update;
    if (password) update.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
    const target = await model.User.findByPk(id);
    if (!target) return res.status(400).json({ message: res.__(`Cannot update User with id=${id}. User not found`) });
    const [updated] = await model.User.update(update, { where: { id } });
    if (updated) {
      res.status(200).json({ message: res.__('User updated successfully') });
    } else {
      res.status(403).json({ message: res.__('You cannot change the email') });
    }
  } catch (error) {
    return res.status(500).json({ message: res.__('Error') });
  }
};

export const deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await model.User.destroy({ where: { id } });
    if (user) {
      return res.status(200).json({ message: res._('User deleted successfully!') });
    }
    return res.send({ message: res._(`Cannot delete User with id=${id}. Maybe User was not found!`) });
  } catch (error) {
    return res.status(500).json({ message: res._('Error') });
  }
};

export const logout = (req, res) => {
  token = undefined;
  process.env.JWT_KEY = token;
  res.status(200).json({ message: res._('You are logged out now!') });
};

export const verifyUser = async (req, res) => {
  try {
    jwt.verify(req.params.token, process.env.JWT_KEY);

    const user = jwt.decode(req.params.token);
    const userEmail = await model.User.findOne({ where: { email: user.email } });

    if (userEmail.isVerified === true) {
      res.status(400).send(template(user.firstname, null, 'This email is already verified, please click here to login', 'Go to Login'));
    }
    await model.User.update({ isVerified: true }, { where: { email: user.email } });
    res.status(200).redirect('https://space-barefootnomad.netlify.app');
  } catch (error) {
    res.status(400).send(template('User', null, 'Invalid Token, Please signup again', 'Go to Signup'));
  }
};
