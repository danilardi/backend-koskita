const { Facility } = require('../models');

class FacilityControllers {
    /**
     * @swagger
     * tags:
     *   - name: Facility
     *     description: Manajemen fasilitas kos
     */

    /**
     * @swagger
     * /api/facility:
     *   post:
     *     summary: Tambahkan fasilitas baru
     *     tags: [Facility]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - name
     *             properties:
     *               name:
     *                 type: string
     *           example:
     *             name: WiFi
     *     responses:
     *       201:
     *         description: Fasilitas berhasil ditambahkan
     *         content:
     *           application/json:
     *             example:
     *               message: success
     *               data:
     *                 id: 1
     *                 name: WiFi
     *                 updatedAt: 2025-05-21T10:00:00.000Z
     *                 createdAt: 2025-05-21T10:00:00.000Z
     *       400:
     *         description: Permintaan tidak valid
     *         content:
     *           application/json:
     *             examples:
     *               missingName:
     *                 summary: Nama tidak diberikan
     *                 value:
     *                   message: Name is required
     *               duplicate:
     *                 summary: Nama fasilitas sudah ada
     *                 value:
     *                   message: Facility with this name already exists
     */
    static async addFacility(req, res, next) {
        try {
            const { name } = req.body;
            if (!name) {
                throw {
                    status: 400,
                    message: 'Name is required'
                };
            }
            const existingFacility = await Facility.findOne({ where: { name } });
            if (existingFacility) {
                throw {
                    status: 400,
                    message: 'Facility with this name already exists'
                };
            }
            const facility = await Facility.create({ name });
            res.status(201).json({
                message: 'success',
                data: facility
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * @swagger
     * /api/facility:
     *   get:
     *     summary: Dapatkan semua fasilitas
     *     tags: [Facility]
     *     responses:
     *       200:
     *         description: Berhasil mengambil daftar fasilitas
     *         content:
     *           application/json:
     *             example:
     *               message: success
     *               data:
     *                 - id: 1
     *                   name: WiFi
     *                   createdAt: 2025-05-21T10:00:00.000Z
     *                   updatedAt: 2025-05-21T10:00:00.000Z
     *                 - id: 2
     *                   name: AC
     *                   createdAt: 2025-05-21T10:01:00.000Z
     *                   updatedAt: 2025-05-21T10:01:00.000Z
     */
    static async getAllFacilities(req, res, next) {
        try {
            const facilities = await Facility.findAll();
            res.status(200).json({
                message: 'success',
                data: facilities
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = FacilityControllers;