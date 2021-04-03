Routers will forward request to correct controller function.

==========================
REMINDER:

Firstly, every routers need 'router.use(express.static('./static'));'. This is for Express static resource hosting.

Secondly, for route, the route path try not to exceed two levels (except path parameters like /route/:id),

for example, if you want to render/send/write a page like this:

router.get('/login/failed', (req, res) = > {
    res.render('register_success')
}));

OR

router.get('/login/failed', (req, res) = > {
    res.send(__dirname+'/debug.html'});
}));

all the link resource of the <head></head> will fail, because of Express static resource hosting path reasons,

if you want more route levels, create a new router, and attach it to the parent router by:

parent_router.use('/next_level', new_router)

==========================
We need to make controller and router seperate with each other, to make
project low coupling and high cohesion

For more information, see lectures and workshop demo files and slides