/* this file is for js dubug. the file can be removed*/
// 百度地图API功能
//GPS坐标
var x = 116.32715863448607;
var y = 39.990912172420714;
var ggPoint = new BMapGL.Point(x,y);

//地图初始化
var bm = new BMapGL.Map("allmap");
bm.centerAndZoom(ggPoint, 15);
bm.addControl(new BMapGL.ZoomControl());

//添加gps marker和label
var markergg = new BMapGL.Marker(ggPoint);
bm.addOverlay(markergg); //添加GPS marker
var labelgg = new BMapGL.Label("未转换的GPS坐标（错误）",{offset:new BMapGL.Size(10, -10)});
markergg.setLabel(labelgg); //添加GPS label

//坐标转换完之后的回调函数
let translateCallback = function (data){
    if(data.status === 0) {
        var marker = new BMapGL.Marker(data.points[0]);
        bm.addOverlay(marker);
        var label = new BMapGL.Label("转换后的百度坐标（正确）",{offset:new BMapGL.Size(10, -10)});
        marker.setLabel(label); //添加百度label
        bm.setCenter(data.points[0]);
    }
}

setTimeout(function(){
    var convertor = new BMapGL.Convertor();
    var pointArr = [];
    pointArr.push(ggPoint);
    convertor.translate(pointArr, COORDINATES_WGS84, COORDINATES_BD09, translateCallback)
}, 1000);

/**
 * 坐标常量说明：
 * COORDINATES_WGS84 = 1, WGS84坐标
 * COORDINATES_WGS84_MC = 2, WGS84的平面墨卡托坐标
 * COORDINATES_GCJ02 = 3，GCJ02坐标
 * COORDINATES_GCJ02_MC = 4, GCJ02的平面墨卡托坐标
 * COORDINATES_BD09 = 5, 百度bd09经纬度坐标
 * COORDINATES_BD09_MC = 6，百度bd09墨卡托坐标
 * COORDINATES_MAPBAR = 7，mapbar地图坐标
 * COORDINATES_51 = 8，51地图坐标
 */


function f() {
    let UserTranslateCallback = function (point){

        // focus the map
        map.centerAndZoom(user_point, 18);

        let userMarker = new BMapGL.Marker(user_point, {icon: redIcon});
        map.addOverlay(userMarker);
        // User info window
        // user's image path is hard coded, waiting for making dynamic
        var sContent = `<div><h4 style='margin:0 0 5px 0;'>{{{customer_username}}}</h4>
    <a href="" id="btn-van" style="z-index: 999"></a>
    </div>`;
        var infoWindow = new BMapGL.InfoWindow(sContent);
        // click event
        userMarker.addEventListener('click', function () {
            this.openInfoWindow(infoWindow);
            // infoWindow
            document.getElementById('imgAvator').onload = function () {
                infoWindow.redraw(); // if net speed is slow, redraw to prevent cropped images
            };
        });
    }
}