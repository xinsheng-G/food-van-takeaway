layouts folder contains the root template of other .hbs templates,
the root template defines .css & .js file that we need in <head></head>

we write <body>   ...    <script>...</script></body> in other view .hbs
templates, then they will be rendered to the root template. We can also
pass information to these view hbs by calling res.render() function.

in res.render() function, we can pass variables to the template by:

res.render('templateName', {
		variable1: req.params.id,
		variable2: req.params.abc,
		variable3: req.params.def,
	});

if you want to render a view without a parent layout:

res.render('templateName', {layout: false})

for more information, see lectures and workshop demo files.

==============================================================
