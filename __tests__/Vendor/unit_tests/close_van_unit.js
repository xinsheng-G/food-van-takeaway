const vendor_controller = require("../../../controller/vendor/vendor_controller");

const mongoose = require('../../../model/mongoDB');

const van_model = require('../../../model/van')

/**
 * Run:
 * npm test -- ./Vendor/unit_tests/close_van_unit.js
 */

describe("Unit testing close_snackvan from vendor_controller.js", () => {
    const req = {
        params: { van_name: 'demo_van' }
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
            "is_open": false,
            "picture_path": "https://source.unsplash.com/Fkwj-xk6yck",
            "description": null,
            "location": {
                "x_pos": null,
                "y_pos": null
            },
            "stars": 3.75,
            "text_address": null
        })

        // run func
        vendor_controller.close_snackvan(req, res);
    })

    test("Test case 1: testing close_snackvan for demo_van", () => {
        expect(res.redirect).toHaveBeenCalledTimes(0);
        expect(res.send).toHaveBeenCalledTimes(1);
        expect(res.send).toHaveBeenCalledWith(`Closed for Business: demo_van`);
    })

    afterAll(async() => {
        await mongoose.disconnect();
    }, 10000);
})