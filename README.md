**The University of Melbourne**
# INFO30005 – Web Information Technologies

# Group Project Repository

Welcome!

Our heroku app address: https://project-t05-x3ra.herokuapp.com/

Our database entry: 
mongodb+srv://admin:3ulH5EXbBpj5mcax@cluster0.1saxw.mongodb.net/test?authSource=admin&replicaSet=atlas-gq4o85-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true

For Mockup APP Server infromation, see [Mockup APP Server](#mockup-app-server).

## Table of contents
* [Team Members](#team-members)
* [Mockup APP Server](#mockup-app-server)
* [General Info](#general-info)
* [Technologies](#technologies)
* [Code Implementation](#code-implementation)
* [Adding Images](#adding-images)

## Team Members

| Name | Task | State |
| :---         |     :---:      |          ---: |
| Xiaotian Li  | Back End for Customer App     |  working |
| Student Name 2    | Front End      |  Testing |
| Student Name 3    | README Format      |  Amazing! |


## Mockup APP Server

### Customer APP mockup

Customer mockup functionalities are fulfilled by `customer_mock_up_controller.js` in `controller` folder and `customer_mock_up_router.js` in `router` folder.

Mockup interfaces ignored login interception to make it convenient for debugging, and customer id is hard-coded, but we have implemented login interception in the other route. For more information, see **Other features** below.

#### Mockup features:

*1. View menu of snacks (including pictures and prices):*
Request to the url below with GET method, then it will return html document for menu, you can add/remove line items there:

Input: van_name as a param at `https://project-t05-x3ra.herokuapp.com/customer_mockup/menu/:van_name` via GET. van_name param can be : `debug_van_name`,  `valve`,  `ubisoft`, `ea`...

example: https://project-t05-x3ra.herokuapp.com/customer_mockup/menu/debug_van_name

 Output: a html document of menu of snacks will show in the browser with 200 status.

*2. View details of a snack*
Request with a snack name with GET method, then it will return snack detail from database in JSON.

Input: snack_name as a param at `https://project-t05-x3ra.herokuapp.com/customer_mockup/snack_detail/:snack_name`  via GET. snack_name can be: `latte`, `plain_biscuit,` `fancy_biscuit`, `small_cake`, `big_cake`, `cappuccino`, `long_black`, `flat_white`

Example: https://project-t05-x3ra.herokuapp.com/customer_mockup/snack_detail/fancy_biscuit

Output: a JSON of snack details will show in the browser with 200 status

Exception: when a snack is not exist, return a warning with 500 status.

*3. Customer starts a new order by requesting a snack*
There are two ways to place a new order:

1. Request with a form via POST method, then it will place an order in database
   
   Input: A  form, the key-value should be `snack_name: number`,  for example:
   
   ``` javascript
   fancy_biscuit: 2
   small_cake: 1
   latte: 3
   not_valid_snack_name: 66
   ```
   
then send the form with POST method to https://project-t05-x3ra.herokuapp.com/customer_mockup/place_an_order/debug_van_name. The van_name param at the end of url can be changed, for example: https://project-t05-x3ra.herokuapp.com/customer_mockup/place_an_order/ubisoft or https://project-t05-x3ra.herokuapp.com/customer_mockup/place_an_order/valve
   
   Output: a JSON of an order entity will show in the browser with 200 status.
   
   
   
2. Or, you can get access to https://project-t05-x3ra.herokuapp.com/customer_mockup/menu/debug_van_name, in the html page, you can edit line items, then press `place an order` button to submit the form. In this way you can also place an order in the MongoDB and get a return in JSON.

    

#### Other features:

We have implemented more functionalities than requirements of the deliverable 2:

1. Login interceptor for place an order:

   User can see a menu of a van via https://project-t05-x3ra.herokuapp.com/menu/debug_van_name, if the user hasn't logged in and press `place an order` button at this route, login interception will redirect the user to the login in page. 

   Login interceptor is based on session, which is defined in `login_interceptor.js` in `controller` folder

2. Login/register/logout:

   User can login via https://project-t05-x3ra.herokuapp.com/customer/login, and register via https://project-t05-x3ra.herokuapp.com/customer/register. 

   A customer acoount for debugging: admin@admin.com, password: admina

   You can see other RESTful routes for customer operations in `customer_router.js` file at `router` folder.

3. Map:

   User can see vans' position on the map in index via https://project-t05-x3ra.herokuapp.com/, vans' position is rendered from database.

4. My orders:

   If one user has logged in, he/she can see orders have made via  https://project-t05-x3ra.herokuapp.com/customer/my_orders/,

   order records are from database.

   You can see other RESTful routes for order operations in `my_orders_router.js` file at `router` folder.

5. Others:

   You could check `controller` and `router` to see more features we have implemented for the project so far.

   

### Vendor APP mockup


*1. Setting van status (vendor sendslocation,marksvan as ready-for-orders)

 * POST Request
 * INPUT: send van name in url | send van_location in x-www-form-url-encoded as {"x_pos": (Any Number),  "y_pos": (Any Number)}
 * OUTPUT:  Response  -> Open for Business: <van_name> | OPEN: true at { x_pos: <Number>, y_pos: <Number> }
 * Exception Handling: Handles van name not found | Catches Bad Requests (400), Internal Server Errors (50-x) and Database Errors

 * API ENDPOINT: /vendor/van_open/:id (:id is a van_name)...


*2. Show list of all outstanding orders

* GET Request
* INPUT: send van name and order status in url
* OUTPUT: JSON output of orders 
* Exception Handling: Catches Bad Requests (400), Internal Server Errors (50-x) and Database Errors

* API ENDPOINT: /vendor/orders/:van_name/:status 


*3. Mark an order as "fulfilled" (ready to be picked up by customer)

* POST Request
* INPUT: send order id in url
* OUTPUT: Response  -> Successfully updated order: 607aa2f9fae4190f82be5f48 | complete.
* Exception Handling:  Handles invalid order status and van name not found  | Catches Bad Requests (400), Internal Server Errors (50-x) and Database

* API ENDPOINT: /vendor/update_order_status/:id  (:id is a order id)


## General info
This is project ...
Lorem ipsum dolor sit amet

## Technologies
Project is created with:
* NodeJs 14.16.0
* Express 4.17.1
* MongoDB Atlas
* mongoose 5.12.3
* Bootstrap 3
* Baidu Map API
* Open Street map OSM API

## Code Implementation

You can include a code snippet here.

```HTML
<!--
Example code from: https://www.w3schools.com/jsref/met_win_alert.asp
__>

<!DOCTYPE html>
<html>
<body>

<p>Click the button to display an alert box.</p>

<button onclick="myFunction()">Try it</button>

<script>
function myFunction() {
  alert("Hello! I am an alert box!");
}
</script>

</body>
</html>
```

## Adding Images

You can use images/gif hosted online:

<p align="center">
  <img src="https://github.com/Martin-Reinoso/sandpit-Profile/raw/main/Images_Readme/01.gif"  width="300" >
</p>

Or you can add your own images from a folder in your repo with the following code. The example has a folder `Gifs` with an image file `Q1-1.gif`:
```HTML
<p align="center">
  <img src="Gifs/Q1-1.gif"  width="300" >
</p>
```

To create a gif from a video you can follow this [link](https://ezgif.com/video-to-gif/ezgif-6-55f4b3b086d4.mov).

You can use emojis :+1: but do not over use it, we are looking for professional work. If you would not add them in your job, do not use them here! :shipit:

**Now Get ready to complete all the tasks:**

- [x] Read the Project handouts carefully
- [x] User Interface (UI)mockup
- [ ] App server mockup
- [ ] Front-end + back-end (one feature)
- [ ] Complete system + source code
- [ ] Report on your work(+ test1 feature)

