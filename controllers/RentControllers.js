const { Kos, Kamar, User } = require('../models');


class RentControllers {
    /**
     * @swagger
     * tags:
     *   - name: Rents
     *     description: Manajemen penyewaan kamar
     */
    /**
     * @swagger
     * /api/rent:
     *   post:
     *     summary: Book a kamar (sewa kamar)
     *     tags: [Rents]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - kosanId
     *             properties:
     *               kosanId:
     *                 type: integer
     *           example:
     *             kosanId: 1
     *             duration: 2
     *             startDate: "2025-05-21T09:00:00.000Z"
     *     responses:
     *       200:
     *         description: Kamar berhasil dibooking
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                 data:
     *                   type: object
     *             example:
     *               message: Kamar booked successfully
     *               data:
     *                 id: 3
     *                 noKamar: "A3"
     *                 status: "booked"
     *                 createdAt: "2025-05-21T09:00:00.000Z"
     *                 updatedAt: "2025-05-21T09:00:00.000Z"
     *                 kosan:
     *                   name: Kos Harapan Indah
     *                   price: 1200000
     *                   address: Jl. Merdeka No. 10
     *                 user:
     *                   name: John Doe
     *                   email: john@example.com
     *       404:
     *         description: Kos tidak ditemukan atau kamar tidak tersedia
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *             examples:
     *               kosNotFound:
     *                 summary: Kos tidak ditemukan
     *                 value:
     *                   message: Kos not found
     *               noAvailable:
     *                 summary: Tidak ada kamar tersedia
     *                 value:
     *                   message: No available kamar
     */
    static async rentKamar(req, res, next) {
        try {
            const { kosanId, duration, startDate } = req.body;
            if (!kosanId || !duration || !startDate) {
                throw { status: 400, message: 'kosanId, duration, and startDate are required' };
            }
            const userId = req.user.id;

            const kos = await Kos.findByPk(kosanId);
            if (!kos) {
                throw { status: 404, message: 'Kos not found' };
            }
            const availableKamar = await Kamar.findOne({
                where: {
                    status: 'available',
                    kosanId: kosanId
                }
            });
            if (!availableKamar) {
                throw { status: 404, message: 'No available kamar' };
            }
            const kamarId = availableKamar.id;

            const endDate = new Date(startDate);
            endDate.setMonth(endDate.getMonth() + duration);

            const data = {
                userId,
                status: 'booked',
                duration,
                startDate,
                endDate
            }

            await Kamar.update(
                { ...data },
                { where: { id: kamarId } }
            );

            const updatedKamar = await Kamar.findByPk(kamarId, {
                attributes: ['id', 'noKamar', 'status', 'duration', 'startDate', 'endDate', 'createdAt', 'updatedAt'],
                include: [
                    {
                        model: Kos,
                        as: 'kosan',
                        attributes: ['name', 'price', 'address']
                    },
                    {
                        model: User,
                        as: 'user',
                        attributes: ['name', 'email']
                    }
                ]
            });

            res.status(200).json({
                message: 'Kamar booked successfully',
                data: updatedKamar
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * @swagger
     * /api/rent/self:
     *   get:
     *     summary: Ambil kamar yang disewa oleh user saat ini
     *     tags: [Rents]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Data kamar yang disewa oleh user berhasil diambil
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
     *                     type: object
     *             example:
     *               message: success
     *               data:
     *                 - id: 2
     *                   noKamar: "B2"
     *                   status: "booked"
     *                   kosan:
     *                     name: Kos B
     *                     price: 900000
     *                     address: Jl. Melati No. 7
     *                   user:
     *                     name: John Doe
     *                     email: john@example.com
     *                     phonenumber: "08123456789"
     */
    static async getOwnRent(req, res, next) {
        try {
            const { id } = req.user;
            const rent = await Kamar.findAll({
                where: {
                    userId: id
                },
                include: [
                    {
                        model: Kos,
                        as: 'kosan',
                        attributes: ['name', 'price', 'address']
                    },
                    {
                        model: User,
                        as: 'user',
                        attributes: ['name', 'email', 'phonenumber']
                    }
                ]
            });
            res.status(200).json({
                message: 'success',
                data: rent
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * @swagger
     * /api/rent/{id}:
     *   get:
     *     summary: Ambil detail penyewaan kamar berdasarkan ID
     *     tags: [Rents]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         description: ID kamar yang disewa
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Detail penyewaan kamar berhasil diambil
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                 data:
     *                   type: object
     *             example:
     *               message: success
     *               data:
     *                 id: 3
     *                 noKamar: "C3"
     *                 status: "booked"
     *                 kosan:
     *                   name: Kos C
     *                   price: 950000
     *                   address: Jl. Kenanga No. 10
     *                 user:
     *                   name: John Doe
     *                   email: john@example.com
     *       404:
     *         description: Data tidak ditemukan atau tidak memiliki akses
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *             example:
     *               message: Rent not found/no access to rent
     */
    static async getRentById(req, res, next) {
        try {
            const { id } = req.params;
            const { id: userId, role } = req.user;
            const whereCondition = { id };

            if (role === 'user') {
                whereCondition.userId = userId;
            }

            const rent = await Kamar.findOne({
                where: whereCondition,
                attributes: ['id', 'noKamar', 'status', 'createdAt', 'updatedAt'],
                include: [
                    {
                        model: Kos,
                        as: 'kosan',
                        attributes: ['name', 'price', 'address']
                    },
                    {
                        model: User,
                        as: 'user',
                        attributes: ['name', 'email']
                    }
                ]
            });


            if (!rent) {
                throw { status: 404, message: 'Rent not found/no access to rent' };
            }
            res.status(200).json({
                message: 'success',
                data: rent
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = RentControllers;