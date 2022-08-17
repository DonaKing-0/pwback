import { Router } from 'express';

import prodotti from './prodotti/index.js'
import altro from './altro/index.js'
import prenotaz from './prenotazioni/index.js'

import users from './users/index.js'
import alogin from './auth/indexadmin.js'
import login from './auth/index.js'

const router = new Router();

router.use('/prodotti', prodotti);
router.use('/altro', altro);
router.use('/prenotaz', prenotaz);

//router.use('/admin', admin);

router.use('/users', users);

router.use('/', login);
router.use('/al', alogin);


export default router;