const { Kos, Kamar, KosanFacility, Facility } = require('../models');

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
                        as: 'facilities',
                        attributes: ['id', 'name'],
                        through: {
                            attributes: [],
                        },
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
     *                 facilities:
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
                        as: 'facilities',
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

            // tambahkan logik sisa kamar
            const availableRooms = await Kamar.count({
                where: {
                    kosanId: id,
                    status: 'available'
                }
            });
            const kosWithAvailableRooms = {
                ...kos.toJSON(),
                availableRooms
            };

            res.status(200).json({
                message: 'successs',
                data: kosWithAvailableRooms
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = KosControllers;