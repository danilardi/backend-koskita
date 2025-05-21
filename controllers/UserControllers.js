const { User } = require('../models');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

class UserControllers {
    static async userRegister(req, res, next) {
        try {
            const { name, email, password, role, phonenumber } = req.body || {};
            if (!name || !email || !password || !role || !phonenumber) {
                throw {
                    status: 400,
                    message: 'All fields are required'
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
                accessToken: token,
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = UserControllers;