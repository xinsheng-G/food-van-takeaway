# Use Case

## 1 Customer

*When customer is NOT login-in*

- [x] A customer can find nearby vans ( van list OR map )
- [x] Customer App can get customer's location.
- [x] Customer App can access van locations from database.
- [ ] Customer App can calculate five nearest vans. ( show van locations in list )
- [x] A customer can choose a van to purchase from.
- [x] A menu should appear, which list snacks after a customer choosing a van
- [x] Customer App needs to handle login registrations.

*When customer is login-in*

- [x] A customer can register & login with email and password
- [x] Customer App's database will store a customer's loginID(email), password, family name and given name.
- [ ] A Customer can change his/her profile details (names and password) 
- [ ] A logged-in Customer can place an order.
- [ ] An order consists of 1..* snacks, with quantities for each, needs to be timestamped.
- [ ] An order will be given 20% discount if the order is not ready for pick up in 15min.  (This time can be changed by Company & developer)
- [ ] A customer can monitor order status (fulfilled or ready for pick up).
- [ ] A customer can cancel or change (add or remove items) the order within 10 min (This time can be changed by Company & developer)
- [ ] A cancelled order shouldn't be seen to Customers and Vendors
- [ ] Changing order can reset change timestamp
- [ ] A Customer can rate the order, rating should be 1-5
- [ ] Customer app will be used on phones and also desktops.



## 2 Vendor

- [ ] A vendor can log in using van name.
- [ ] A vendor can be registered by name and password.
- [ ] A vendor can send their location to the database, address input is short text address (.*** st, Melbourne )
- [ ] Vendor APP can capture coordinate with the address text
- [ ] A vendor can mark his van as open-for-business OR quit for the day
- [ ] A vendor can change location address
- [ ] A vendor need a list of van's orders that are not yet fulfilled, in time order, urgent on the top
- [ ] A vendor can click on the order in the list and see order detail ( order number, customer's given name, order items, time remains for 20% discount )
- [ ] A vendor can mark an order as fufilled ( snacks are prepared ), should be seen
- [ ] A vendor can mark an order as finished ( snacks are picked up ), should be invisible, but not deleted in database
- [ ] A finished order should be findable and show again
- [ ] Vendor APP will be used on ipad size. Design should be clear so that operators will make less mistakes.



## 3 Others

### 3.1 menu

- [x] Snacks of menu should be stored in database include images and prices for each

  ( for the image, store it in node.js server folder and store its path to database to increase database efficiency )

### 3.2 locations

- [ ] calculate distance with Euclidean formula
- [x] display locations on the map

### 3.3 live pages

- [ ] Order monitoring pages will be updated live (refresh and read data from database)



## 4 Reminder

**Things below we DON'T need to implement based on the project requirement**

- Change/upload user avatar
- Record Customer's username (but we need first name and last name)
- Change birthday
- Add snack description/remark in order
- Cart
- Change/upload van images
- Edit van profile
- Maintain snacks in menu

These things just place/hard-code them in the database OR ignore some of them if 
unnecessary.

