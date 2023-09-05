import express from 'express';

import {
  createExpert,
  createUser, getAllExperts, getAllUsers, getUserInfoByID,
} from '../controller/user.controller.js';

const router = express.Router();

router
  .route('/')
  .get(getAllUsers);

router
  .route('/experts')
  .get(getAllExperts)

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
