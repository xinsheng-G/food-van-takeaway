const menu_controller = require("../../controller/menu_controller")

const van_model = require('../../model/van')
const snack_model = require('../../model/snack')

/*
* Menu unit test
* */
describe("Unit testing show_page from menu_controller.js", () => {
    const req = {
        params: {van_name: 'demo_van'}
    }

    const res = {
        render: jest.fn(),
        redirect: jest.fn()
    }

    beforeAll(() => {

        // clear the render method
        res.render.mockClear();

        // fake `snack_model.find` query function return value
        snack_model.find = jest.fn().mockResolvedValue([{
            snack_name: 'latte',
            is_drink: true,
            is_available: true,
            price: 2,
            picture_path: 'https://source.unsplash.com/Yao9qtUqLiQ'
        },
            {
                snack_name: 'plain_biscuit',
                is_drink: false,
                is_available: true,
                price: 3,
                picture_path: 'https://source.unsplash.com/4zThEOr1VDE'
            },
            {
                snack_name: 'cappuccino',
                is_drink: true,
                is_available: true,
                price: 3,
                picture_path: 'https://source.unsplash.com/6o2Dk5Op8VI'
            },
            {
                snack_name: 'long_black',
                is_drink: true,
                is_available: true,
                price: 1.5,
                picture_path: 'https://source.unsplash.com/ZLeRlovNk8E'
            },
            {
                snack_name: 'flat_white',
                is_drink: true,
                is_available: true,
                price: 1.75,
                picture_path: 'https://source.unsplash.com/mMNnI1Dpa0s'
            },
            {
                snack_name: 'fancy_biscuit',
                is_drink: false,
                is_available: true,
                price: 4,
                picture_path: 'https://source.unsplash.com/sn1n0LS5FvY'
            },
            {
                snack_name: 'big_cake',
                is_drink: false,
                is_available: true,
                price: 5,
                picture_path: 'https://source.unsplash.com/Lr-KZKYzaj8'
            },
            {
                snack_name: 'small_cake',
                is_drink: false,
                is_available: true,
                price: 4.5,
                picture_path: 'https://source.unsplash.com/Ao09kk2ovB0'
            }])

        // fake `snack_model.find` query function with lean return value
        snack_model.find.mockImplementationOnce(() => ({
            lean: jest.fn().mockReturnValue([
                {
                    snack_name: 'latte',
                    is_drink: true,
                    is_available: true,
                    price: 2,
                    picture_path: 'https://source.unsplash.com/Yao9qtUqLiQ'
                },
                {
                    snack_name: 'plain_biscuit',
                    is_drink: false,
                    is_available: true,
                    price: 3,
                    picture_path: 'https://source.unsplash.com/4zThEOr1VDE'
                },
                {
                    snack_name: 'cappuccino',
                    is_drink: true,
                    is_available: true,
                    price: 3,
                    picture_path: 'https://source.unsplash.com/6o2Dk5Op8VI'
                },
                {
                    snack_name: 'long_black',
                    is_drink: true,
                    is_available: true,
                    price: 1.5,
                    picture_path: 'https://source.unsplash.com/ZLeRlovNk8E'
                },
                {
                    snack_name: 'flat_white',
                    is_drink: true,
                    is_available: true,
                    price: 1.75,
                    picture_path: 'https://source.unsplash.com/mMNnI1Dpa0s'
                },
                {
                    snack_name: 'fancy_biscuit',
                    is_drink: false,
                    is_available: true,
                    price: 4,
                    picture_path: 'https://source.unsplash.com/sn1n0LS5FvY'
                },
                {
                    snack_name: 'big_cake',
                    is_drink: false,
                    is_available: true,
                    price: 5,
                    picture_path: 'https://source.unsplash.com/Lr-KZKYzaj8'
                },
                {
                    snack_name: 'small_cake',
                    is_drink: false,
                    is_available: true,
                    price: 4.5,
                    picture_path: 'https://source.unsplash.com/Ao09kk2ovB0'
                }
            ])
        }))

        // fake `van_model.findOne` query function return value
        van_model.findOne = jest.fn().mockResolvedValue([{
            "van_name": "demo_van",
            "password": "21232f297a57a5a743894a0e4a801fc3",
            "is_open": true,
            "picture_path": "https://source.unsplash.com/Fkwj-xk6yck",
            "description": "debug_van",
            "location": {
                "x_pos": 144.9588068315597,
                "y_pos": -37.79830229214481
            },
            "stars": 3.75,
            "text_address": "Mordor, The Middle Earth"
        }])

        // fake `van_model.findOne` query function with lean return value
        van_model.findOne.mockImplementationOnce(() => ({
            lean: jest.fn().mockReturnValue({
                van_name: "demo_van",
                password: "21232f297a57a5a743894a0e4a801fc3",
                is_open: true,
                picture_path: "https://source.unsplash.com/Fkwj-xk6yck",
                description: "debug_van",
                location: {
                    x_pos: 144.9588068315597,
                    y_pos: -37.79830229214481
                },
                stars: 3.75,
                text_address: "Mordor, The Middle Earth"
            })
        }))

        // run show page func
        menu_controller.show_page(req, res)
    })

    test("Test case 1: testing show menu for demo_van", () =>{
        expect(res.redirect).toHaveBeenCalledTimes(0);
        expect(res.render).toHaveBeenCalledTimes(1);
        expect(res.render).toHaveBeenCalledWith('./customer/menu',{
            title: 'Menu',
            van_name: 'demo_van',
            van_title: 'Demo van',
            foods: [
                {
                    snack_name: 'plain_biscuit',
                    is_drink: false,
                    is_available: true,
                    price: 3,
                    picture_path: 'https://source.unsplash.com/4zThEOr1VDE',
                    snack_title: 'Plain biscuit'
                },
                {
                    snack_name: 'fancy_biscuit',
                    is_drink: false,
                    is_available: true,
                    price: 4,
                    picture_path: 'https://source.unsplash.com/sn1n0LS5FvY',
                    snack_title: 'Fancy biscuit'
                },
                {
                    snack_name: 'big_cake',
                    is_drink: false,
                    is_available: true,
                    price: 5,
                    picture_path: 'https://source.unsplash.com/Lr-KZKYzaj8',
                    snack_title: 'Big cake'
                },
                {
                    snack_name: 'small_cake',
                    is_drink: false,
                    is_available: true,
                    price: 4.5,
                    picture_path: 'https://source.unsplash.com/Ao09kk2ovB0',
                    snack_title: 'Small cake'
                }
            ],
            drinks: [
                {
                    snack_name: 'latte',
                    is_drink: true,
                    is_available: true,
                    price: 2,
                    picture_path: 'https://source.unsplash.com/Yao9qtUqLiQ',
                    snack_title: 'Latte'
                },
                {
                    snack_name: 'cappuccino',
                    is_drink: true,
                    is_available: true,
                    price: 3,
                    picture_path: 'https://source.unsplash.com/6o2Dk5Op8VI',
                    snack_title: 'Cappuccino'
                },
                {
                    snack_name: 'long_black',
                    is_drink: true,
                    is_available: true,
                    price: 1.5,
                    picture_path: 'https://source.unsplash.com/ZLeRlovNk8E',
                    snack_title: 'Long black'
                },
                {
                    snack_name: 'flat_white',
                    is_drink: true,
                    is_available: true,
                    price: 1.75,
                    picture_path: 'https://source.unsplash.com/mMNnI1Dpa0s',
                    snack_title: 'Flat white'
                }
            ]
        })
    })
})