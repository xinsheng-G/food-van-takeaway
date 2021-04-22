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
https://project-t05-x3ra.herokuapp.com/customer_mockup/menu/debug_van_name

*2. View details of a snack*
Request with a snack name with GET method, then it will return snack detail from database in JSON.
https://project-t05-x3ra.herokuapp.com/customer_mockup/snack_detail/fancy_biscuit

*3. Customer starts a new order by requesting a snack*
There are two ways to place a new order:

1. Request with a form via POST method, then it will place an order in database
   https://project-t05-x3ra.herokuapp.com/customer_mockup/place_an_order/debug_van_name
   
   The form's key-value should be `snack_name: number`,  for example:
   
   ``` javascript
   fancy_biscuit: 2
   small_cake: 1
   latte: 3
   not_valid_snack_name: 66
   ```

2. Or, you can get access to https://project-t05-x3ra.herokuapp.com/customer_mockup/menu/debug_van_name, in the html page, you can edit line items, then press `place an order` button to submit the form. In this way you can also place an order in the MongoDB and get a return in JSON

    

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

