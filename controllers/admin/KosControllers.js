const { Kos, Kamar, KosanFacility, Facility } = require('../../models');

class KosControllers {
    /**
     * @swagger
     * tags:
     *   - name: Admin - Kos
     *     description: Manajemen kos dan fasilitas terkait
     */

    /**
     * @swagger
     * /api/admin/kos:
     *   post:
     *     summary: Tambah kos baru
     *     tags: [Admin - Kos]
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
                    message: 'name, price, stockKamar, latitude, longitude, and address are required'
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
            await Kamar.bulkCreate(
                Array.from({ length: stockKamar }, (_, index) => ({
                    noKamar: `K${index + 1}`,
                    kosanId: newKos.id
                }))
            );

            const kos = await Kos.findByPk(newKos.id, {
                include: [
                    {
                        model: Facility,
                        as: 'facilities',
                        through: { attributes: [] }
                    },
                    {
                        model: Kamar,
                        as: 'kamar',
                        attributes: ['id', 'noKamar', 'status'],
                    }
                ]
            });

            res.status(201).json({
                message: 'Kos added successfully',
                data: kos
            });
        } catch (error) {
            next(error);
        }
    }



    /**
     * @swagger
     * /api/admin/kos:
     *   get:
     *     summary: Dapatkan semua kos
     *     tags: [Admin - Kos]
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
     */
    static async getAllKos(req, res, next) {
        try {
            const kos = await Kos.findAll({
                include: [
                    {
                        model: Facility,
                        as: 'facilities',
                        through: { attributes: [] }
                    },
                    {
                        model: Kamar,
                        as: 'kamar',
                        attributes: ['id', 'noKamar', 'status'],
                    }
                ]
            });
            // tambahkan logik sisa kamar
            const kosWithAvailableRooms = await Promise.all(
                kos.map(async (item) => {
                    const availableRooms = await Kamar.count({
                        where: {
                            kosanId: item.id,
                            status: 'available'
                        }
                    });
                    return {
                        ...item.toJSON(),
                        availableRooms
                    };
                })
            );
            res.status(200).json({
                message: 'success',
                data: kosWithAvailableRooms
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * @swagger
     * /api/admin/kos/{id}:
     *   get:
     *     summary: Dapatkan detail kos berdasarkan ID
     *     tags: [Admin - Kos]
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         description: ID kos yang ingin diambil
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Berhasil mengambil detail kos
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
     *                 facilities:
     *                   - id: 1
     *                     name: WiFi
     *                   - id: 2
     *                     name: AC
     *                 kamar:
     *                   - id: 1
     *                     noKamar: K1
     *                     status: available
     *                   - id: 2
     *                     noKamar: K2
     *                     status: booked
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
                        as: 'facilities',
                        through: { attributes: [] }
                    },
                    {
                        model: Kamar,
                        as: 'kamar',
                        attributes: ['id', 'noKamar', 'status'],
                    }
                ]
            });
            if (!kos) {
                return res.status(404).json({ message: 'Kos not found' });
            }
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
     * /api/admin/kos/{id}:
     *   put:
     *     summary: Update kos berdasarkan ID
     *     tags: [Admin - Kos]
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         description: ID kos yang akan diupdate
     *         schema:
     *           type: integer
     *       - name: body
     *         in: body
     *         required: true
     *         description: Data kos yang akan diupdate
     *         schema:
     *           type: object
     *           properties:
     *             name:
     *               type: string
     *             price:
     *               type: number
     *             stockKamar:
     *               type: integer
     *             latitude:
     *               type: string
     *             longitude:
     *               type: string
     *             address:
     *               type: string
     */
    static async updateKos(req, res, next) {
        try {
            const { id } = req.params;
            const { name, price, stockKamar, latitude, longitude, address } = req.body || {};

            if (!name || !price || !stockKamar || !latitude || !longitude || !address) {
                throw {
                    status: 400,
                    message: 'name, price, stockKamar, latitude, longitude, and address are required'
                };
            }

            const kos = await Kos.findByPk(id);
            if (!kos) {
                return res.status(404).json({ message: 'Kos not found' });
            }

            kos.name = name;
            kos.price = price;
            kos.stockKamar = stockKamar;
            kos.latitude = latitude;
            kos.longitude = longitude;
            kos.address = address;

            await kos.save();

            res.status(200).json({
                message: 'Kos updated successfully',
                data: kos
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * @swagger
     * /api/admin/kos/{id}:
     *   delete:
     *     summary: Hapus kos berdasarkan ID
     *     tags: [Admin - Kos]
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         description: ID kos yang akan dihapus
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Kos berhasil dihapus
     *         content:
     *           application/json:
     *             example:
     *               message: Kos deleted successfully
     */
    static async deleteKos(req, res, next) {
        try {
            const { id } = req.params;
            const kos = await Kos.findByPk(id);
            if (!kos) {
                return res.status(404).json({ message: 'Kos not found' });
            }
            await Kos.destroy({ where: { id } });
            res.status(200).json({ message: 'Kos deleted successfully' });
        } catch (error) {
            next(error);
        }
    }

}

module.exports = KosControllers;