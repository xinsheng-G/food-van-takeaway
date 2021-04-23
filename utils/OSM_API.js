const http=require('http');

/** Note finished yet */
let parse_address_to_coordinates = async (text_address) => {

    // change space into +
    let param = text_address.replace(/\ /g, "+")

    let url = 'https://nominatim.openstreetmap.org/search?q=' + param

    //get
    http.get(url,function(req,res){
        var html='';
        req.on('data',function(data){
            html+=data;
        });
        req.on('end',function(){
            console.info(html);
        });
    });
}


