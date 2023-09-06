import express from 'express';

import {
  createChat,
  createExpert,
  createUser, getAllExperts, getAllUsers, getExpertInfoByID, getUserInfoByID,
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
  .route('/')
  .post(createUser);

router
  .route('/:id')
  .get(getUserInfoByID);

router
  .route("/create-expert")
  .post(createExpert)

export default router;
