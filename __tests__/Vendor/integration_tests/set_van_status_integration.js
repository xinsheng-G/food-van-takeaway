const request = require('supertest')

const app = require('../../../app');

const mongoose = require('../../../model/mongoDB');

/**
 * Run:
 * npm test -- ./vendor/integration_tests/set_van_status_integration.js --forceExit
 */
/*
 * Menu Integration test - open buisness then close buisness
 * */

const van_name = 'justice'

describe('Integration test: Open buisness then close buisness', () => {
    jest.setTimeout(30000)
    let agent = request.agent(app);
    let cookie = null;
    beforeAll(() => agent
        .post('/vendor/login')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send({
            'van_name': van_name,
            'password': 'Admin123',
            'remember_me': 'on'
        })
        .then((res) => {
            cookie = res.headers['set-cookie'][0].split(',').map(item => item.split(';')[0]).join(';')
        })
    );


    test('#Http Test: Login Page', () => {
        return request(app)
            .get(`/vendor/login`)
            .then((response) => {
                expect(response.statusCode).toBe(200);
                expect(response.type).toBe('text/html');
                expect(response.text).toContain("SIGN IN");
            })
    })

    test('#Http Test: Open for Business Page', () => {
        return request(app)
            .get(`/vendor/buisness`)
            .set('Cookie', cookie)
            .then((response) => {
                /* can be 302 if the van has already been open, see controller */
                // expect(response.status).toBe(200);
                console.log(response)
                expect(response.type).toBe('text/html');
            })
    })
    test('#Http Test: Open van for buisness', () => {
        const open_params = new URLSearchParams();
        open_params.append('van_address', 'Melbourne, VIC');
        open_params.append('van_location_description', 'Outside Chapel Street');
        open_params.append('van_location', `{ "x_pos": 144.9588068315597, "y_pos": -37.79830229214481 }`);
        return request(app)
            .put(`/vendor/open_van/` + van_name)
            .send(open_params)
            .set('Cookie', cookie)
            .then((response) => {
                /* can be 302 if the van has already been open, see controller */
                expect(response.status).toBe(302);
                expect(response.type).toBe('text/plain');
            })
    })

    test('#Http Test: Close van for buisness', () => {
        return request(app)
            .put(`/vendor/close_van/` + van_name)
            .then((response) => {
                expect(response.status).toBe(302);
                expect(response.type).toBe('text/plain');
            })
    })
    afterAll(async() => {
        await mongoose.disconnect();
    }, 10000);
})