const request = require('supertest')

const app = require('../../../app');

const mongoose = require('../../../model/mongoDB');

/**
 * Run:
 * npm test -- ./customer_tests/integration_tests/menu_test.js --forceExit
 */
/*
* Menu Integration test - show menu page
* */
describe('Integration test: show menu of a van', () => {

    test('#Http Test: Show a van\'s menu', () => {
        return request(app)
            .get('/menu/demo_van')
            .then((response) => {
                expect(response.statusCode).toBe(200);
                expect(response.type).toBe('text/html')
                expect(response.text).toContain('<div class="nav_title_conter">Demo van</div>')
            })
    })

    afterAll(async () => {
        await mongoose.disconnect();
    });
})