const userRoutes = require('./users_routes');
const authRoutes = require('./authentication_routes');

const { Router } = require('express');

const router = Router();

router.use('/users/', userRoutes);
router.use('/auth/', authRoutes);

module.exports = router;
