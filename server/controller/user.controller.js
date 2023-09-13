/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
import Expert from '../mongodb/models/Expert.js';
import User from '../mongodb/models/user.js';
import Chat from '../mongodb/models/Chat.js';
import bcrypt from "bcrypt";
import { io } from '../index.js';
import Appointment from '../mongodb/models/Appointment.js';

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

    // Create a new Chat document with data for both expert and user
    const chat = new Chat({
      participants: [
        {
          expertId,
          expertFullName: expert.fullName,
          expertPhoto: expert.photo,
        },
        {
          userId,
          userPhoto: "https://media.sciencephoto.com/f0/28/50/59/f0285059-800px-wm.jpg",
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
          userPhoto: "https://media.sciencephoto.com/f0/28/50/59/f0285059-800px-wm.jpg",
        },
      ],
      lastMessage: null,
      lastMessageDate: new Date(),
    };

    user.chats.push(userChatObject);
    expert.chats.push(expertChatObject);

    // Save the updated user and expert objects
    await user.save();
    await expert.save();

    return res.status(200).json({ status: "Success", message: 'Chat created successfully.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: `Internal Server Error,\n${error}` });
  }
};

const createAppointment = async (req, res) => {
  try {
    const { expertId, userId, appointmentDate } = req.body;

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

    // Create a new Chat document with data for both expert and user
    const appointment = new Appointment({
      participants: [
        {
          expertId,
          expertFullName: expert.fullName,
        },
        {
          userId,
        },
      ],
      appointmentCreationDate: new Date(),
      appointmentDate
    });

    // Save the chat document to MongoDB
    await appointment.save();

    // Update user's and expert's chats arrays
    const userAppointmentObject = {
      appointmentId: appointment._id,
      participants: [
        {
          expertId,
          expertFullName: expert.fullName,
        },
      ],
      appointmentDate: appointment.appointmentDate,
      appointmentCreationDate: appointment.appointmentCreationDate,
    };

    const expertAppointmentObject = {
      appointmentId: appointment._id,
      participants: [
        {
          userId,
        },
      ],
      appointmentDate: appointment.appointmentDate,
      appointmentCreationDate: appointment.appointmentCreationDate,
    };

    user.appointments.push(userAppointmentObject);
    expert.appointments.push(expertAppointmentObject);

    // Save the updated user and expert objects
    await user.save();
    await expert.save();

    return res.status(200).json({ status: "Success", message: 'Appointment created successfully.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: `Internal Server Error,\n${error}` });
  }
};

const getUserChats = async (req, res) => {
  try {
    const { userId, userType } = req.params;

    // Check if the provided userType is 'User' or 'Expert'
    if (userType !== 'User' && userType !== 'Expert') {
      return res.status(400).json({ message: 'Invalid userType.' });
    }

    // Find the user by userId
    let user;
    if (userType === 'User') {
      user = await User.findById(userId);
    } else {
      user = await Expert.findById(userId);
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Get the chats based on the userType
    const chats = user.chats;

    return res.status(200).json({ status: "Success", chats });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error.' });
  }
};

const getUserAppointments = async (req, res) => {
  try {
    const { userId, userType } = req.params;

    // Check if the provided userType is 'User' or 'Expert'
    if (userType !== 'User' && userType !== 'Expert') {
      return res.status(400).json({ message: 'Invalid userType.' });
    }

    // Find the user by userId
    let user;
    if (userType === 'User') {
      user = await User.findById(userId);
    } else {
      user = await Expert.findById(userId);
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Get the chats based on the userType
    const appointments = user.appointments;

    return res.status(200).json({ status: "Success", appointments });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error.' });
  }
};

const getChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params;

    // Find the chat by chatId
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found.' });
    }

    // Return the messages of the chat
    const messages = chat.messages;

    return res.status(200).json({ status: 'Success', messages });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error.' });
  }
};

const confirmAppointmentLink = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    // Find the chat by chatId
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ status: 'Failed', message: 'Appointment not found.' });
    }

    return res.status(200).json({ status: 'Success', message: 'Appointment Found' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 'Failed', message: 'Internal Server Error.' });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { chatId, senderId, senderType, text } = req.body;

    // Find the chat by chatId
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found.' });
    }

    // Create a new message object
    const message = {
      senderId,
      senderType,
      text,
    };

    // Add the message to the chat's messages array
    chat.messages.push(message);

    // Save the updated chat
    await chat.save();

    // Emit the new message to all connected clients in the chat room
    io.to(chatId).emit('newMessage', message);

    return res.status(200).json({ status: 'Success', message: 'Message sent successfully.', messageData: message });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error.' });
  }
};

const signInExpert = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: 'Failed',
      message: 'Email and password are required',
    });
  }

  // Check if the user with the provided email exists
  Expert.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          status: 'Failed',
          message: 'The Expert was not found',
        });
      }

      // Compare the provided password with the hashed password in the database
      bcrypt.compare(password, user.password)
        .then((isMatch) => {
          if (isMatch) {
            // Passwords match, create a token for authentication (you can use a JWT library here)

            return res.status(200).json({
              status: 'Success',
              message: 'Login successful',
              data: {
                user,
              },
            });
          } else {
            return res.status(401).json({
              status: 'Failed',
              message: 'Incorrect password',
            });
          }
        })
        .catch((err) => {
          return res.status(500).json({
            status: 'Failed',
            message: 'Internal server error',
          });
        });
    })
    .catch((err) => {
      return res.status(500).json({
        status: 'Failed',
        message: 'Internal server error',
      });
    });
};


export {
  getAllUsers,
  createUser,
  getUserInfoByID,
  getExpertInfoByID,
  createExpert,
  getAllExperts,
  createChat,
  createAppointment,
  getUserChats,
  getUserAppointments,
  confirmAppointmentLink,
  getChatMessages,
  sendMessage,
  signInExpert
};
