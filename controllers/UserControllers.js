const { User } = require('../models');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

class UserControllers {
    /**
     * @swagger
     * tags:
     *   - name: User
     *     description: User management endpoints
     */

    /**
     * @swagger
     * /api/user/register:
     *   post:
     *     summary: Register user baru
     *     tags: [User]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - name
     *               - email
     *               - password
     *               - role
     *               - phonenumber
     *             properties:
     *               name:
     *                 type: string
     *               email:
     *                 type: string
     *               password:
     *                 type: string
     *               role:
     *                 type: string
     *               phonenumber:
     *                 type: string
     *           example:
     *             name: user
     *             email: user@gmail.com
     *             password: user123
     *             role: user
     *             phonenumber: "08123456789"
     *     responses:
     *       201:
     *         description: User created successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *             example:
     *               message: User created successfully
     *       400:
     *         description: Bad Request
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *             examples:
     *               missingFields:
     *                 summary: Missing required fields
     *                 value:
     *                   message: name, email, password, role, and phonenumber are required
     *               invalidRole:
     *                 summary: Invalid role
     *                 value:
     *                   message: Role must be either 'user' or 'admin'
     *               emailExists:
     *                 summary: Email already registered
     *                 value:
     *                   message: User with that email already exists
     */
    static async userRegister(req, res, next) {
        try {
            const { name, email, password, role, phonenumber } = req.body || {};
            if (!name || !email || !password || !role || !phonenumber) {
                throw {
                    status: 400,
                    message: 'name, email, password, role, and phonenumber are required'
                };
            }

            if (role !== 'user' && role !== 'admin') {
                throw {
                    status: 400,
                    message: "Role must be either 'user' or 'admin'"
                };
            }

            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                throw {
                    status: 400,
                    message: 'User with that email already exists'
                };
            }

            const saltRounds = parseInt(process.env.SALT_ROUNDS);
            const salt = bcrypt.genSaltSync(saltRounds)
            const hash = bcrypt.hashSync(password, salt)

            const user = await User.create({
                name,
                email,
                password: hash,
                role,
                phonenumber
            });

            res.status(201).json({ message: "User created successfully" });
        } catch (error) {
            next(error);
        }
    }

    /**
     * @swagger
     * /api/user/login:
     *   post:
     *     summary: Login user
     *     tags: [User]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - email
     *               - password
     *             properties:
     *               email:
     *                 type: string
     *               password:
     *                 type: string
     *           example:
     *             email: user@gmail.com
     *             password: user123
     *     responses:
     *       200:
     *         description: Login successful
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                 data:
     *                   type: object
     *                   properties:
     *                     accessToken:
     *                       type: string
     *                     role:
     *                       type: string
     *             example:
     *               message: Login successful
     *               data:
     *                 accessToken: <token>
     *                 role: user
     *       400:
     *         description: Missing fields
     *         content:
     *           application/json:
     *             example:
     *               message: Email and password are required
     *       401:
     *         description: Invalid credentials
     *         content:
     *           application/json:
     *             example:
     *               message: Invalid email or password
     */
    static async userLogin(req, res, next) {
        try {
            const { email, password } = req.body || {};
            if (!email || !password) {
                throw {
                    status: 400,
                    message: 'Email and password are required'
                };
            }

            const user = await User.findOne({ where: { email } });
            if (!user) {
                throw {
                    status: 401,
                    message: 'Invalid email or password'
                };
            }

            const isPasswordValid = bcrypt.compareSync(password, user.password);
            if (!isPasswordValid) {
                throw {
                    status: 401,
                    message: 'Invalid email or password'
                };
            }

            const token = jwt.sign(
                { id: user.id, email: user.email, role: user.role },
                process.env.JWT_SECRET,
            );

            res.status(200).json({
                message: "Login successful",
                data: {
                    accessToken: token,
                    role: user.role,
                }
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * @swagger
     * /api/user/profile:
     *   get:
     *     summary: Get user profile
     *     tags: [User]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: User profile retrieved successfully
     *         content:
     *           application/json:
     *             example:
     *               message: User profile retrieved successfully
     *               data:
     *                 name: user
     *                 email: user@gmail.com
     *                 role: user
     *                 phonenumber: "08123456789"
     *       401:
     *         description: Unauthorized
     *         content:
     *           application/json:
     *             example:
     *               message: access denied
     */
    static async getProfile(req, res, next) {
        try {
            const userId = req.user.id;
            const user = await User.findByPk(userId);
            if (!user) {
                throw {
                    status: 404,
                    message: 'User not found'
                };
            }
            res.status(200).json(
                {
                    message: 'User profile retrieved successfully',
                    data: {
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        phonenumber: user.phonenumber
                    }
                }
            );
        } catch (error) {
            next(error);
        }
    }

    /**
     * @swagger
     * /api/user/profile:
     *   patch:
     *     summary: Update profil pengguna (nama, password, nomor HP)
     *     tags: [User]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - name
     *               - password
     *               - phonenumber
     *             properties:
     *               name:
     *                 type: string
     *               password:
     *                 type: string
     *               phonenumber:
     *                 type: string
     *           example:
     *             name: John Doe Updated
     *             password: newsecurepass123
     *             phonenumber: "081212345678"
     *     responses:
     *       200:
     *         description: Profil berhasil diperbarui
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *             example:
     *               message: Profile updated successfully
     *       400:
     *         description: Field tidak lengkap
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *             example:
     *               message: name, password, and phonenumber are required
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
    static async updateProfile(req, res, next) {
        try {
            const userId = req.user.id;
            const { name, password, phonenumber } = req.body || {};
            if (!name || !password || !phonenumber) {
                throw {
                    status: 400,
                    message: 'name, password, and phonenumber are required'
                };
            }

            const user = await User.findByPk(userId);
            if (!user) {
                throw {
                    status: 404,
                    message: 'User not found'
                };
            }

            const saltRounds = parseInt(process.env.SALT_ROUNDS);
            const salt = bcrypt.genSaltSync(saltRounds)
            const hash = bcrypt.hashSync(password, salt)

            await User.update(
                { name, password: hash, phonenumber },
                { where: { id: userId } }
            );

            res.status(200).json({ message: 'Profile updated successfully' });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = UserControllers;