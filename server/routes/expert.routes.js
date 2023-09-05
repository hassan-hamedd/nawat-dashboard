import express from 'express';

import {
    createProperty, deleteProperty, getAllProperties, getPropertyDetail, updateProperty,
} from '../controller/property.controller.js';
  
const router = express.Router();

router
  .route('/')
  .get(getAllExperts)

export default router;