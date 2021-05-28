const vendor_controller = require("../../../controller/vendor/vendor_controller");

const mongoose = require('../../../model/mongoDB');
const { deleteOne } = require("../../../model/van");

const van_model = require('../../../model/van')

/**
 * Run:
 * npm test -- ./Vendor/unit_tests/set_van_status_unit.js
 */

describe("Unit testing set_location from vendor_controller.js", () => {
    const req = {
        params: { van_name: 'demo_van' },
        body: {
            van_address: 'Melbourne, VIC',
            van_location_description: 'Outside Chapel Street',
            van_location: `{ "x_pos": 144.9588068315597, "y_pos": -37.79830229214481 }`
        }
    }
    const res = {
        send: jest.fn(),
        redirect: jest.fn()
    }
    beforeAll(() => {
        // clear the render method
        res.send.mockClear();

        // fake `van_model.findOneAndUpdate` query function return value
        van_model.findOneAndUpdate = jest.fn().mockResolvedValue({
            "van_name": "demo_van",
            "password": "21232f297a57a5a743894a0e4a801fc3",
            "is_open": true,
            "picture_path": "https://source.unsplash.com/Fkwj-xk6yck",
            "description": 'Outside Chapel Street',
            "location": {
                "x_pos": 144.9588068315597,
                "y_pos": -37.79830229214481
            },
            "stars": 3.75,
            "text_address": 'Melbourne, VIC'
        })

        // run func
        vendor_controller.set_location(req, res);
    })

    test("Test case 1: testing set_location for demo_van", () => {
        expect(res.redirect).toHaveBeenCalledTimes(0);
        expect(res.send).toHaveBeenCalledTimes(1);
        expect(res.send).toHaveBeenCalledWith(`Open for Business: demo_van | OPEN: true at Outside Chapel Street `);
    })

    afterAll(async() => {

        await mongoose.disconnect();
    }, 10000);
})