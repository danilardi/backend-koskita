const { Kos, ImageKosan, KosanFacility, Facility } = require('../models');
const kosanfacility = require('../models/kosanfacility');

class KosControllers {
    /**
     * @swagger
     * tags:
     *   - name: Kos
     *     description: Manajemen kos dan fasilitas terkait
     */

    /**
     * @swagger
     * /api/kos:
     *   post:
     *     summary: Tambah kos baru
     *     tags: [Kos]
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
     *                 type: number
     *               stockKamar:
     *                 type: integer
     *               latitude:
     *                 type: string
     *               longitude:
     *                 type: string
     *               address:
     *                 type: string
     *               facility:
     *                 type: array
     *                 items:
     *                   type: object
     *                   properties:
     *                     id:
     *                       type: integer
     *           example:
     *             name: Kos Mawar
     *             price: 700000
     *             stockKamar: 5
     *             latitude: "-6.200000"
     *             longitude: "106.816666"
     *             address: Jl. Melati No. 10
     *             facility:
     *               - id: 1
     *               - id: 2
     *     responses:
     *       201:
     *         description: Kos berhasil ditambahkan
     *         content:
     *           application/json:
     *             example:
     *               message: Kos added successfully
     *               data:
     *                 id: 1
     *                 name: Kos Mawar
     *                 price: 700000
     *                 stockKamar: 5
     *                 latitude: "-6.200000"
     *                 longitude: "106.816666"
     *                 address: Jl. Melati No. 10
     *                 createdAt: "2025-05-21T12:00:00.000Z"
     *                 updatedAt: "2025-05-21T12:00:00.000Z"
     *                 Facilities:
     *                   - id: 1
     *                     name: WiFi
     *                   - id: 2
     *                     name: AC
     *       400:
     *         description: Permintaan tidak valid (field kosong atau bukan array)
     *         content:
     *           application/json:
     *             example:
     *               message: Facility must be an array
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

    /**
     * @swagger
     * /api/kos:
     *   get:
     *     summary: Ambil semua data kos
     *     tags: [Kos]
     *     responses:
     *       200:
     *         description: Berhasil mengambil daftar kos
     *         content:
     *           application/json:
     *             example:
     *               message: success
     *               data:
     *                 - id: 1
     *                   name: Kos Mawar
     *                   price: 700000
     *                   stockKamar: 5
     *                   latitude: "-6.200000"
     *                   longitude: "106.816666"
     *                   address: Jl. Melati No. 10
     *                   Facilities:
     *                     - id: 1
     *                       name: WiFi
     *                     - id: 2
     *                       name: AC
     */
    static async getAllKos(req, res, next) {
        try {
            // mengambil semua data kos, dan join dengan tabel Facility melalui table KosanFacility yang memiliki kosId sama dengan id kos
            const kos = await Kos.findAll({
                include: [
                    {
                        model: Facility,
                        attributes: ['id', 'name'],
                        through: {
                            attributes: [],
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

    /**
     * @swagger
     * /api/kos/{id}:
     *   get:
     *     summary: Ambil detail kos berdasarkan ID
     *     tags: [Kos]
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         description: ID kos
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Data kos ditemukan
     *         content:
     *           application/json:
     *             example:
     *               message: success
     *               data:
     *                 id: 1
     *                 name: Kos Mawar
     *                 price: 700000
     *                 stockKamar: 5
     *                 latitude: "-6.200000"
     *                 longitude: "106.816666"
     *                 address: Jl. Melati No. 10
     *                 Facilities:
     *                   - id: 1
     *                     name: WiFi
     *                   - id: 2
     *                     name: AC
     *       404:
     *         description: Kos tidak ditemukan
     *         content:
     *           application/json:
     *             example:
     *               message: Kos not found
     */
    static async getKosById(req, res, next) {
        try {
            const { id } = req.params;
            const kos = await Kos.findByPk(id, {
                include: [
                    {
                        model: Facility,
                        attributes: ['id', 'name'],
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