const request = require('supertest')

const app = require('../../../app');

const mongoose = require('../../../model/mongoDB');
const van_name = "justice";
/**
 * Run:
 * npm test -- ./vendor/integration_tests/set_van_status_integration.js --forceExit
 */
/*
 * Menu Integration test - open buisness then close buisness
 * */
describe('Integration test: Open buisness then close buisness', () => {
    test('#Http Test: Open Buisness', () => {
        const open_params = new URLSearchParams();
        open_params.append('van_address', 'Melbourne, VIC');
        open_params.append('van_location_description', 'Outside Chapel Street');
        open_params.append('van_location', `{ "x_pos": 144.9588068315597, "y_pos": -37.79830229214481 }`);
        return request(app)
            .put(`/vendor/open_van/${van_name}`)
            .send(open_params)
            .then((response) => {
                expect(response.status).toBe(200);
                expect(response.data).toBe(`Open for Business: demo_van | OPEN: true at Outside Chapel Street `);
            })
    })
    test('#Http Test: Open van for buisness', () => {
        const open_params = new URLSearchParams();
        open_params.append('van_address', 'Melbourne, VIC');
        open_params.append('van_location_description', 'Outside Chapel Street');
        open_params.append('van_location', `{ "x_pos": 144.9588068315597, "y_pos": -37.79830229214481 }`);
        return request(app)
            .put(`/vendor/open_van/${van_name}`)
            .send(open_params)
            .then((response) => {
                expect(response.status).toBe(200);
                expect(response.data).toBe(`Open for Business: demo_van | OPEN: true at Outside Chapel Street `);
            })
    })

    test('#Http Test: Close van for buisness', () => {
        return request(app)
            .put(`/vendor/close_van/${van_name}`)
            .then((response) => {
                expect(response.status).toBe(200);
                expect(response.data).toBe(`Closed for Business: demo_van`);
            })
    })
    afterAll(async() => {
        await mongoose.disconnect();
    }, 10000);
})