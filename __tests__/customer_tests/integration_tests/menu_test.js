const request = require('supertest')

const app = require('../../../app');

/*
* Menu Integration test - show menu page
* */
describe('Integration test: show menu of a van', () => {

    test('Test 1: Show a van\'s menu', () => {
        return request(app)
            .get('/menu/demo_van')
            .then((response) => {
                expect(response.statusCode).toBe(200);
                expect(response.type).toBe('text/html')
                expect(response.text).toContain('<div class="nav_title_conter">Demo van</div>')
            })
    })
})