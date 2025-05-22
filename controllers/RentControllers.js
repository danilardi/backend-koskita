const { Kos, Kamar, User } = require('../models');

class RentControllers {
    static async rentKamar(req, res, next) {
        try {
            const { kosanId } = req.body;
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

            await Kamar.update(
                { status: 'booked', userId },
                { where: { id: kamarId } }
            );

            const updatedKamar = await Kamar.findByPk(kamarId, {
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

            res.status(200).json({
                message: 'Kamar booked successfully',
                data: updatedKamar
            });
        } catch (error) {
            next(error);
        }
    }
    static async getAllRent(req, res, next) {
        try {
            const rent = await Kamar.findAll({
                attributes: ['id', 'noKamar', 'status', 'createdAt', 'updatedAt'],
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
    static async getOwnRent(req, res, next) {
        try {
            const { id } = req.user;
            const rent = await Kamar.findAll({
                where: {
                    userId: id
                }
            });
            res.status(200).json({
                message: 'success',
                data: rent
            });
        } catch (error) {
            next(error);
        }
    }
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