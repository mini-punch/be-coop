
const express = require('express');
const {getCoops,getCoop,createCoop, updateCoop, deleteCoop} = require('../controllers/coop');
const reservationRouter = require('./reservation');

const router = express.Router();

const {protect, authorize} = require('../middleware/auth');
router.use('/:coopId/reservations', reservationRouter);

router.route('/').get(getCoops).post(protect,authorize('admin'), createCoop);
router.route('/:id').get(getCoop).put(protect,authorize('admin'), updateCoop).delete(protect,authorize('admin'), deleteCoop);


module.exports = router;



/**
 * @swagger
 * components:
 *   schemas:
 *     Coop:
 *       type: object
 *       required:
 *         - name
 *         - address
 *         - tel
 *         - openTime
 *         - closeTime
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The auto-generated id of the coworking space
 *           example: d290f1ee-6c54-4b01-90e6-d701748f0851
 *         name:
 *           type: string
 *           description: Coworking space name
 *         address:
 *           type: string
 *           description: Address of the coworking space
 *         tel:
 *           type: string
 *           description: Telephone number
 *         openTime:
 *           type: string
 *           description: Opening time
 *         closeTime:
 *           type: string
 *           description: Closing time
 *       example:
 *         id: 609bda561452242d88d36e37
 *         name: "Happy Coworking Space"
 *         address: "123 Phayathai Road, Bangkok"
 *         tel: "02-1234567"
 *         openTime: "08:00"
 *         closeTime: "20:00"
 */

/**
 * @swagger
 * tags:
 *   - name: Coops
 *     description: The coworking spaces managing API
 */

/**
 * @swagger
 * /coops:
 *   get:
 *     summary: Returns the list of all the coworking spaces
 *     tags: [Coops]
 *     responses:
 *       200:
 *         description: The list of the coworking spaces
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Coop'
 */

/**
 * @swagger
 * /coops/{id}:
 *   get:
 *     summary: Get the coworking space by id
 *     tags: [Coops]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The coworking space id
 *     responses:
 *       200:
 *         description: The coworking space description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Coop'
 *       404:
 *         description: The coworking space was not found
 */

/**
 * @swagger
 * /coops:
 *   post:
 *     summary: Create a new coworking space
 *     tags: [Coops]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Coop'
 *     responses:
 *       201:
 *         description: The coworking space was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Coop'
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /coops/{id}:
 *   put:
 *     summary: Update the coworking space by the id
 *     tags: [Coops]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The coworking space id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Coop'
 *     responses:
 *       200:
 *         description: The coworking space was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Coop'
 *       404:
 *         description: The coworking space was not found
 *       500:
 *         description: Some error happened
 */

/**
 * @swagger
 * /coops/{id}:
 *   delete:
 *     summary: Remove the coworking space by id
 *     tags: [Coops]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The coworking space id
 *     responses:
 *       200:
 *         description: The coworking space was deleted
 *       404:
 *         description: The coworking space was not found
 */

router.use('/:coopId/reservations', reservationRouter);

router.route('/')
    .get(getCoops)
    .post(protect, authorize('admin'), createCoop);

router.route('/:id')
    .get(getCoop)
    .put(protect, authorize('admin'), updateCoop)
    .delete(protect, authorize('admin'), deleteCoop);

router.route('/').get(getCoops).post(protect,authorize('admin'), createCoop);
router.route('/:id').get(getCoop).put(protect,authorize('admin'), updateCoop).delete(protect,authorize('admin'), deleteCoop);

module.exports = router;

