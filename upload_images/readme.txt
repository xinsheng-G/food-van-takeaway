Maybe we can upload images(van, customer avatar, snack) to this folder with the help of some node.js modules, and store image path to the MongoDB,
which increase efficiency of DB query. since the free version of MongoDB Atlas is quite slow, we'd better send path strings rather
than all binary data of images to the database online.