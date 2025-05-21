const { Facility } = require('../models');

class FacilityControllers {
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