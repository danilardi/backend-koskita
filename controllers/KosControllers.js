const { Kos, ImageKosan, KosanFacility, Facility } = require('../models');
const kosanfacility = require('../models/kosanfacility');

class KosControllers {

    /**
     * @swagger
     * components:
     *   schemas:
     *     Kos:
     *       type: object
     *       properties:
     *         id:
     *           type: integer
     *         name:
     *           type: string
     *         price:
     *           type: integer
     *         stockKamar:
     *           type: integer
     *         latitude:
     *           type: number
     *         longitude:
     *           type: number
     *         address:
     *           type: string
     *         createdAt:
     *           type: string
     *         updatedAt:
     *           type: string
     */

    /**
     * @swagger
     * /api/kos:
     *   post:
     *     summary: Add a new Kos
     *     tags:
     *       - Kos
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - name
     *               - price
     *               - stockKamar
     *               - latitude
     *               - longitude
     *               - address
     *             properties:
     *               name:
     *                 type: string
     *               price:
     *                 type: integer
     *               stockKamar:
     *                 type: integer
     *               latitude:
     *                 type: number
     *               longitude:
     *                 type: number
     *               address:
     *                 type: string
     *     responses:
     *       201:
     *         description: Kos added successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                 data:
     *                   $ref: '#/components/schemas/Kos'
     *       400:
     *         description: All fields are required
     *
     *   get:
     *     summary: Get all Kos
     *     tags:
     *       - Kos
     *     responses:
     *       200:
     *         description: List of all Kos
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                 data:
     *                   type: array
     *                   items:
     *                     $ref: '#/components/schemas/Kos'
     */

    static async addKos(req, res, next) {
        try {
            const { name, price, stockKamar, latitude, longitude, address, images, facility } = req.body || {};
            if (!name || !price || !stockKamar || !latitude || !longitude || !address) {
                throw {
                    status: 400,
                    message: 'All fields are required'
                };
            }

            if (facility && !Array.isArray(facility)) {
                throw {
                    status: 400,
                    message: 'Facility must be an array'
                };
            }

            const existingKos = await Kos.findOne({ where: { name } });
            if (existingKos) {
                throw {
                    status: 400,
                    message: 'Kos with this name already exists'
                };
            }
            const newKos = await Kos.create({ name, price, stockKamar, latitude, longitude, address });
            await KosanFacility.bulkCreate(
                facility.map((item) => ({
                    kosanId: newKos.id,
                    facilityId: item.id
                }))
            );

            const kosWithFacilities = await Kos.findByPk(newKos.id, {
                include: [
                    {
                        model: Facility,    
                        through: { attributes: [] } 
                    }
                ]
            });

            res.status(201).json({
                message: 'Kos added successfully',
                data: kosWithFacilities
            });
        } catch (error) {
            next(error);
        }
    }

    static async getAllKos(req, res, next) {
        try {
            // mengambil semua data kos, dan join dengan tabel Facility melalui table KosanFacility yang memiliki kosId sama dengan id kos
            const kos = await Kos.findAll({
                include: [
                    {
                        model: Facility,
                        through: {
                            attributes: []
                        },
                    }
                ]
            });

            // const kos = await Kos.findAll()
            res.status(200).json({
                message: 'success',
                data: kos
            });
        } catch (error) {
            next(error);
        }
    }

    static async getKosById(req, res, next) {
        try {
            const { id } = req.params;
            const kos = await Kos.findByPk(id, {
                include: [
                    {
                        model: Facility,
                        through: {
                            attributes: []
                        },
                    }
                ]
            });
            if (!kos) {
                throw {
                    status: 404,
                    message: 'Kos not found'
                };
            }
            res.status(200).json({
                message: 'successs',
                data: kos
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = KosControllers;