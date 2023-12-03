import express from 'express'
import { login, signup } from '../controllers/auth.js';
import { getAllUsers, updateProfile } from '../controllers/users.js';
import userTrack from '../middlewares/userTrack.js';


const router = express.Router();

router.post('/signup', signup, userTrack )
router.post('/login', login, userTrack )

router.get('/getAllUsers', getAllUsers )
router.patch('/update/:id', updateProfile )

export default router

