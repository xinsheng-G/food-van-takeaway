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
describe('Integration test: Open buisness then close buisness', () => {
    let agent = request.agent(app);
    let cookie = null;
    beforeAll(() => agent
        .post('/vendor/login')
        .send({
            van_name: 'justice',
            password: 'Admin123',
            remember_me: 'on'
        })
        .then((res) => {
            console.log(res.headers);
            cookie = res.headers['set-cookie'][0].split(',').map(item => item.split(';')[0]).join(';')
        })
    );


    test('#Http Test: Login Page', () => {
        return request(app)
            .get(`/vendor/login`)
            .then((response) => {
                expect(response.statusCode).toBe(200);
                expect(response.type).toBe('text/html');
                expect(response.text).toContain("<button class=\"btn\" type=\"submit\">SIGN IN</button>");
            })
    })
    test('#Http Test: Open for Business Page', () => {
            return request(app)
                .get(`/vendor/buisness`)
                .set('Cookie', cookie)
                .then((response) => {
                    expect(response.statusCode).toBe(200);
                    expect(response.type).toBe('text/html');
                })
        })
        /*test('#Http Test: Open van for buisness', () => {
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
        })*/
    afterAll(async() => {
        await mongoose.disconnect();
    }, 10000);
})