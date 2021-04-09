Maybe we don't need this folder anymore, because we are not required to maintain image (avatar, van or snack picture)
uploads/changes, Just hard-code online Splash images path to the database entity like `https://source.unsplash.com/rYOqbTcGp1c`
also works. (Use splash source is recommended by lecturer)

=============

Since free version of MongoDB Atlas is quite slow, it is definitely not suitable for images transfer, So, we can upload
users' uploading images (like customer avatars) to this `upload_images` folder with the help of some node.js modules,
and store image path to the MongoDB. Then we can render these images based on the path quickly, which increase efficiency of DB
query and page rendering. For rendering, using Handlebars to render the <img>'s src attribute.

============================================

IMPORTANT!

As for this project, We can upload Customer's Avatar and let the file name
be user_id. (maybe we don't need to upload/modify avatars, since project spec doesn't require us to do so)

The other images(foods or van pictures) are just hard-coded here, don't need to implement
uploading/modify them. Just hard-code their pathes (eg. './flat_white.jpg') to database model

OR

Just hard-code online Splash images path to the database entity like `https://source.unsplash.com/rYOqbTcGp1c` and
this folder is not needed anymore

============================================
Module we can use:

multer

Example Usage note (retrieve from the internet):

npm i multer

let multer=require('multer')
let fs=require('fs')

// Configure the upload object and upload it to the Upload folder of the public folder under the current directory
let upload = multer({ dest: './public/upload' })

// upload single file
post.post('/upload',upload.single('file'),(req,res)=>{
    let oldPath=req.file.destination+"/"+req.file.filename
    let newPath=req.file.destination+"/"+req.file.originalname
    // change file name
    fs.rename(oldPath,newPath,(err,res)=>{
        console.log("filename changed")
    })
})


// using AJAX for uploading

<!--front-end-->
<form id="uploadform" method="post">
    <input id="input" type="file" name="file">
    <button id="submit">submit</button>
</form>
<script src="https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js"></script>
<script>
    let formData
    $('#input').change(function (e) {
        let file = this.files[0]
        // Create a FormData object and append the file to the FormData object
        formData= new FormData()
        formData.append('file', file)
        // The preview image
        // Generate URL address
        let imgUrl=window.webkitURL.createObjectURL(file)
        let img=new Image()
        img.src=imgUrl
        $('body').append(img)
    })
    $("#submit").click(function () {
        $.ajax({
            url: "http://localhost:3000/users/upload",
            method: 'POST',
            data: formData,
            processData: false,
            contentType: false,
        }).then(res=>{
            console.log(res) // success
        })
    })
</script>

// back-end
app.post('/upload',upload.single('file'),(req,res)=>{
    // Set the route to allow all sources access, otherwise cross-domain problems can occur
    res.append("Access-Control-Allow-Origin","*")
    // Set routing to allow access for all request types
    res.append('Access-Control-Allow-Content-Type',"*")
    let oldPath=req.file.destination+"/"+req.file.filename
    let newPath=req.file.destination+"/"+req.file.originalname
    fs.rename(oldPath,newPath,()=>{})
    res.json('upload success')
})

// image-download

// back end
app.get('/download', async (req, res) => {
    res.download("./public/upload/jq.jpg")
})

// front end
<button id="download">下载</button>
<script src="https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js"></script>
<script >
    $('#download').click(()=>{
        window.location.href="http://localhost:3000/users/download"
    })
</script>
