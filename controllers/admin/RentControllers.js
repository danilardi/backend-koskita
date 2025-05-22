const { Kos, Kamar, User } = require('../../models');


class RentControllers {
    /**
     * @swagger
     * tags:
     *   - name: Admin - Rents
     *     description: Manajemen penyewaan kamar
     */

    /**
     * @swagger
     * /api/admin/rent:
     *   get:
     *     summary: Ambil semua data kamar (Admin only)
     *     tags: [Admin - Rents]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Daftar kamar yang disewa berhasil diambil
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
     *                 - id: 1
     *                   noKamar: "A1"
     *                   status: "booked"
     *                   createdAt: "2025-05-21T08:00:00.000Z"
     *                   updatedAt: "2025-05-21T08:30:00.000Z"
     *                   kosan:
     *                     name: Kos A
     *                     price: 1000000
     *                     address: Jl. Mangga No. 5
     *                   user:
     *                     id: 1
     *                     name: John Doe
     *                     email: john@example.com
     *                     phonenumber: "08123456789"
     */
    static async getAllRent(req, res, next) {
        try {
            const rent = await Kamar.findAll({
                include: [
                    {
                        model: Kos,
                        as: 'kosan',
                    },
                    {
                        model: User,
                        as: 'user',
                        attributes: ['id', 'name', 'email', 'phonenumber']
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
     * /api/admin/rent/{id}:
     *   get:
     *     summary: Ambil detail penyewaan kamar berdasarkan ID
     *     tags: [Admin - Rents]
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

            const rent = await Kamar.findByPk(id, {
                attributes: ['id', 'noKamar', 'status', 'createdAt', 'updatedAt'],
                include: [
                    {
                        model: Kos,
                        as: 'kosan',
                        attributes: ['id', 'name', 'price', 'address']
                    },
                    {
                        model: User,
                        as: 'user',
                        attributes: ['id', 'name', 'email']
                    }
                ]
            });


            if (!rent) {
                throw { status: 404, message: 'Rent not found' };
            }
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
     * /api/admin/rent/{id}:
     *   put:
     *     summary: Update status penyewaan kamar berdasarkan ID
     *     tags: [Admin - Rents]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         description: ID kamar yang ingin diupdate
     *         schema:
     *           type: integer
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               status:
     *                 type: string
     *                 enum: [available, booked]
     *           example:
     *             status: available
     *     responses:
     *       200:
     *         description: Status penyewaan kamar berhasil diupdate
     *         content:
     *           application/json:
     *             example:
     *               message: Rent updated successfully
     *               data:
     *                 id: 1
     *                 noKamar: "A1"
     *                 status: "available"
     *                 userId: null
     *       404:
     *         description: Rent tidak ditemukan
     *         content:
     *           application/json:
     *             example:
     *               message: Rent not found
     */
    static async updateRent(req, res, next) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            const rent = await Kamar.findByPk(id);

            if (!rent) {
                throw { status: 404, message: 'Rent not found' };
            }

            if (status === 'available') {
                await rent.update({ userId: null, status });
            } else {
                await rent.update({ status });
            }

            res.status(200).json({
                message: 'Rent updated successfully',
                data: rent
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = RentControllers;