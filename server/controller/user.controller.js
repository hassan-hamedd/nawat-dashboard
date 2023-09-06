/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
import Expert from '../mongodb/models/Expert.js';
import User from '../mongodb/models/user.js';
import Chat from '../mongodb/models/Chat.js';
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

const getExpertInfoByID = async (req, res) => {
  try {
    const { id } = req.params;
    const userProperties = await Expert.findOne({ _id: id });

    if (userProperties) res.status(200).json(userProperties);
    else res.status(404).send('User not found');
  } catch (err) {
    res.status(500).json({ message: 'Failed to get expert data, please try again later' });
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

const createChat = async (req, res) => {
  try {
    const { expertId, userId } = req.body;

    // Retrieve expert data from the database using expertId
    const expert = await Expert.findById(expertId);
    if (!expert) {
      return res.status(404).json({ message: 'Expert not found.' });
    }

    // Retrieve user data from the database using userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Create a new Chat document
    const chat = new Chat({
      participants: [
        {
          expertId,
          expertFullName: expert.fullName,
          expertPhoto: expert.photo,
        },
        {
          userId,
          userPhoto: "https://previews.123rf.com/images/yupiramos/yupiramos1609/yupiramos160912725/62358447-avatar-woman-smiling-cartoon-female-person-user-vector-illustration.jpg",
        },
      ],
      messages: [],
      chatCreationDate: new Date(),
      chatEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days in milliseconds
    });

    // Save the chat document to MongoDB
    await chat.save();

    // Update user's and expert's chats arrays
    const userChatObject = {
      chatId: chat._id,
      participants: [
        {
          expertId,
          expertFullName: expert.fullName,
          expertPhoto: expert.photo,
        },
      ],
      lastMessage: null,
      lastMessageDate: new Date(),
    };

    const expertChatObject = {
      chatId: chat._id,
      participants: [
        {
          userId,
          userPhoto: "https://previews.123rf.com/images/yupiramos/yupiramos1609/yupiramos160912725/62358447-avatar-woman-smiling-cartoon-female-person-user-vector-illustration.jpg",
        },
      ],
      lastMessage: null,
      lastMessageDate: new Date(),
    };

    user.chats.push(userChatObject);
    expert.chats.push(expertChatObject);

    await user.save();
    await expert.save();

    return res.status(200).json({ message: 'Chat created successfully.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export {
  getAllUsers,
  createUser,
  getUserInfoByID,
  getExpertInfoByID,
  createExpert,
  getAllExperts,
  createChat,
};
