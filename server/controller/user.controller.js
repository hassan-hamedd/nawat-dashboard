/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
import Expert from '../mongodb/models/Expert.js';
import User from '../mongodb/models/user.js';
import bcrypt from "bcrypt";

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).limit(req.query._end);
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Fetching users failed, please try again later' });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, avatar } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(200).json(userExists);

    const newUser = await User.create({
      name,
      email,
      avatar,
    });

    res.status(200).json(newUser);
  } catch (err) {
    res.status(500).json({ message: 'Something happened, failed to create user' });
  }
};

const getUserInfoByID = async (req, res) => {
  try {
    const { id } = req.params;
    const userProperties = await User.findOne({ _id: id }).populate('allProperties');

    if (userProperties) res.status(200).json(userProperties);
    else res.status(404).send('User not found');
  } catch (err) {
    res.status(500).json({ message: 'Failed to get user properties, please try again later' });
  }
};

const getAllExperts = async (req, res) => {
  try {
    const users = await Expert.find({}).limit(req.query._end);
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Fetching users failed, please try again later' });
  }
};

const createExpert = async (req, res) => {
  console.log(req.body)
  let {
          email,
          password,
          fullName,
          title,
          location,
          description,
          photo,
          offeredServices,
          gender,
          age,
      } = req.body;

  let createdAt = new Date();

  if(email === '' || password === '' || fullName === '' || title === '' || location === '' || description === '' || photo === '' || gender === '') {
      return res.status(400).json({
          status: 'Failed',
          message: 'All fields are required'
      });
  } else if(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email) === false) {
      return res.status(400).json({
          status: 'Failed',
          message: 'Invalid email'
      });
  } else if(password.length < 8) {
      return res.status(400).json({
          status: 'Failed',
          message: 'Password must be at least 8 characters long'
      });
  } else {
      // Check if email already exists
      Expert.find({ email })
          .then(user => {
              if(user.length > 0) {
                  return res.status(400).json({
                      status: 'Failed',
                      message: 'Email already exists'
                  });
              } else {
                  // Create new user

                  // Hash password
                  const saltRounds = 10;
                  bcrypt.hash(password, saltRounds)
                      .then(hashedPassword => {
                          const newExpert = new Expert({
                              email,
                              password: hashedPassword,
                              createdAt,
                              lastLogin: createdAt,
                              fullName,
                              photo,
                              offeredServices,
                              gender,
                              age,
                          });

                          newExpert.save()
                              .then(user => {
                                  return res.status(200).json({
                                      status: 'Success',
                                      message: 'Registration successful',
                                      data: {
                                          user
                                      }
                                  });
                              })
                              .catch(err => {
                                  return res.status(400).json({
                                      status: 'Failed',
                                      message: err
                                  });
                              });
                      })
                      .catch(err => {
                          return res.status(400).json({
                              status: 'Failed',
                              message: err
                          });
                      });
              }
          })
          .catch(err => {
              return res.status(400).json({
                  status: 'Failed',
                  message: err
              });
          });
  }
};

export {
  getAllUsers,
  createUser,
  getUserInfoByID,
  createExpert,
  getAllExperts
};
