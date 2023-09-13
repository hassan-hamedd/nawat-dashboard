import express from 'express';

import {
  confirmAppointmentLink,
  createAppointment,
  createChat,
  createExpert,
  createUser, getAllExperts, getAllUsers, getChatMessages, getExpertInfoByID, getUserAppointments, getUserChats, getUserInfoByID, sendMessage, signInExpert,
} from '../controller/user.controller.js';

const router = express.Router();

router
  .route('/')
  .get(getAllUsers);

router
  .route('/experts')
  .get(getAllExperts)

  router
  .route('/experts/:id')
  .get(getExpertInfoByID)

router
  .route('/get-appointments/:userId/:userType')
  .get(getUserAppointments)

router
  .route('/confirm-appointment/:appointmentId')
  .get(confirmAppointmentLink)

router
  .route('/create-chat')
  .post(createChat)

router
  .route('/send-message')
  .post(sendMessage)

router
  .route('/expert-login')
  .post(signInExpert)

router
  .route('/create-appointment')
  .post(createAppointment)

router
  .route('/get-chats/:userId/:userType')
  .get(getUserChats)

router
  .route('/get-chat-messages/:chatId')
  .get(getChatMessages)

router
  .route('/')
  .post(createUser);

router
  .route('/:id')
  .get(getUserInfoByID);

router
  .route("/create-expert")
  .post(createExpert)

export default router;
