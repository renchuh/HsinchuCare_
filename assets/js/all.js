//載入地圖
const map = L.map("map").setView([25.033976, 121.5623502], 16);
let popUp;
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

const icon_violet = new L.Icon({
  iconUrl:
    "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const icon_center = new L.Icon({
  iconUrl:
    "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const icon_park = new L.Icon({
  iconUrl:
    "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const icon_pharmacy = new L.Icon({
  iconUrl:
    "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
// markers.addLayer(L.marker([0,0], {icon: icon_violet}).bindPopup());
const local = L.marker([0, 0], { icon: icon_violet }).addTo(map);

//定位使用者位置
if ("geolocation" in navigator) {
  console.log("geolocation available");
  navigator.geolocation.getCurrentPosition((position) => {
    userLat = position.coords.latitude;
    userLng = position.coords.longitude;
    console.log(userLat, userLng);
    map.setView([userLat, userLng], 13);
    local
      .setLatLng([userLat, userLng])
      .bindPopup(`<h3>你的位置</h3>`)
      .openPopup();
  });
} else {
  console.log("geolocation not available");
}

//新增定位按鈕
let geoBtn = document.getElementById("jsGeoBtn");
geoBtn.addEventListener(
  "click",
  function () {
    map.setView([userLat, userLng], 13);
    marker
      .setLatLng([userLat, userLng])
      .bindPopup(`<h3>你的位置</h3>`)
      .openPopup();
  },
  false
);

var markers = new L.MarkerClusterGroup({ disableClusteringAtZoom: 16 }).addTo(
  map
);

$(function () {
  $.ajax({
    url: "v1/api/maps/listPoint.json",
    type: "GET",
    dataType: "json",
    success: function (res) {
      if (res.code === 200) {
        for (let i = 0; i < res.data.length; i++) {
          // map.setView([res.data[i].lat, res.data[i].pre], 13);

          // const marker = L.marker([res.data[i].lat, res.data[i].pre], {
          //   icon: getIcon(res.data[i].type),
          // }).addTo(map);
          // marker.setLatLng([res.data[i].lat, res.data[i].pre]);

          let maker = L.marker([res.data[i].lat, res.data[i].pre]);
          maker.bindPopup("<h3>" + res.data[i].center_name + "</h3>");
          maker
            .on("click", function () {
              showDetail(
                res.data[i].id,
                res.data[i].type,
                res.data[i].center_name,
                res.data[i].center_address,
                res.data[i].tel,
                res.data[i].lat,
                res.data[i].pre
              );
            })
            .openPopup();
          markers.addLayer(maker, { icon: getIcon(res.data[i].type) });
        }
        map.addLayer(markers);
      } else {
        showTip(res.msg);
      }
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      showErrorMsg("unable to connect to server, please try again later");
    },
  });
});

function getIcon(type) {
  if (type == "活動中心") {
    return icon_center;
  } else if (type == "公園") {
    return icon_park;
  } else if (type == "藥局") {
    return icon_pharmacy;
  } else {
    return icon_violet;
  }
}

function showDetail(id, type, name, address, tel, lat, pre, addTime) {
  layer.open({
    type: 1,
    title: "標籤點資訊",
    skin: "layui-layer-rim",
    area: ["420px", "340px"],
    isOutAnim: true,
    icon: 3,
    skin: "demo-class",
    content: name + "<br>" + address + "<br>" + tel + "<br>",
  });
}

// 左邊部分

let selectedData;
async function addComponents() {
  const data = await d3.json("../../location.json");
  const types = d3.groups(data, (d) => d["type"]);
  const dists = d3.groups(data, (d) => d["dist"]);

  console.log(data, types);
  const container = d3.select("#locationComponents");
  // select
  const distSelect = container.append("select");
  distSelect.style("width", "100%");
  distSelect
    .selectAll("option")
    .data(dists)
    .join("option")
    .attr("value", (d) => d[0])
    .text((d) => d[0]);

  distSelect.on("change", (e, d) => {
    let value = e.target.value;
    selectedData = data.filter((v) => v.dist === value);
    console.log(selectedData);

    // genDistList
    genDistList(selectedData);
  });

  // buttons
  const buttons = container
    .append("div")
    .selectAll("button")
    .data(types)
    .join("button");

  buttons.attr("class", "buttonType").text((d) => d[0]);

  buttons.on("click", (e, d) => {
    console.log(e, d);
    let data = selectedData.filter((v) => v.type === d[0]);
    console.log(data);
    genDistList(data);
  });
}

addComponents();

function genDistList(data) {
  const container = d3.select("#distList");
  container.selectAll("*").remove();
  const div = container.selectAll("div").data(data).join("div");

  div.append("p").html((d) => d.name);
  div.append("p").html((d) => d.address);
  div.append("p").html((d) => d.tel);
}
