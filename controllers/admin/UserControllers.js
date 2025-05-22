const { User } = require('../../models');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

class UserControllers {
    /**
     * @swagger
     * tags:
     *   - name: Admin - User
     *     description: Management of user accounts
     */

    /**
     * @swagger
     * /api/admin/user:
     *   get:
     *     summary: Ambil semua data user (Admin only)
     *     tags: [Admin - User]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Berhasil mengambil semua data user
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
     *                     properties:
     *                       id:
     *                         type: integer
     *                       name:
     *                         type: string
     *                       email:
     *                         type: string
     *                       phonenumber:
     *                         type: string
     *                       role:
     *                         type: string
     *             example:
     *               message: success
     *               data:
     *                 - id: 1
     *                   name: John Doe
     *                   email: john@example.com
     *                   phonenumber: "08123456789"
     *                   role: user
     *                 - id: 2
     *                   name: Admin
     *                   email: admin@example.com
     *                   phonenumber: "08987654321"
     *                   role: admin
     *       401:
     *         description: Unauthorized
     *       403:
     *         description: Forbidden
     */

    static async getAllUsers(req, res, next) {
        try {
            const users = await User.findAll({
                attributes: ['id', 'name', 'email', 'phonenumber', 'role'],
            });
            res.status(200).json({
                message: 'success',
                data: users
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * @swagger
     * /api/admin/user/:id:
     *   delete:
     *     summary: Hapus akun pengguna (Admin only)
     *     tags: [Admin - User]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Akun berhasil dihapus
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *             example:
     *               message: User deleted successfully
     *       404:
     *         description: User tidak ditemukan
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *             example:
     *               message: User not found
     */
    static async deleteUser(req, res, next) {
        try {
            const userId = req.params.id;
            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            await User.destroy({ where: { id: userId } });
            res.status(200).json({ message: 'User deleted successfully' });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = UserControllers;