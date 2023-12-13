import express, { Router } from 'express';
import Controller from '../controllers/incomingLetter';
import authAPIKey from '../middlewares/authAPIKey';
import authToken from '../middlewares/authToken';
import multer from 'multer';

const router: Router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/incoming_letters/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '_' + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.get('/', authAPIKey, Controller.get);
router.get('/:id', authAPIKey, Controller.getById);
router.post('/', authToken, Controller.post);
router.get('/file/:id', Controller.getFile);
router.post('/file', [upload.single('incomingLetter')], Controller.postFile);
router.put('/', authToken, Controller.put);
router.delete('/', authToken, Controller.delete);

const incomingLetterRouter = router;

export default incomingLetterRouter;
