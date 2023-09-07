import express from 'express';

import {
  createChat,
  createExpert,
  createUser, getAllExperts, getAllUsers, getChatMessages, getExpertInfoByID, getUserChats, getUserInfoByID, sendMessage, signInExpert,
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
  .route('/create-chat')
  .post(createChat)

router
  .route('/send-message')
  .post(sendMessage)

router
  .route('/expert-login')
  .post(signInExpert)

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
