Models need to be designed

===============
mongoDB.js provides mongoDB connection.
the rest of files are entity models.

===============
connect to MongoDB Atlas online:

user: admin
password: admin

===============
method:
1. using MongoDB Compass to connect:

(developing using online Atlas database)
mongodb+srv://admin:admin@x3ra-demo.9ztkf.mongodb.net/snackApp

(locally)
please setup your mongoDB on the computer, and change configurations
in mongoDB.js

(production environment: will be used at the end of the project)
mongodb+srv://admin:admin@x3ra-demo.9ztkf.mongodb.net/snackApp-production

2. using model:

DB connection is defined in mongoDB.js, you can set username, password and databaseName there
