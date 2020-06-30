var granimInstance = new Granim({
    element: '#canvas-image-blending',
    direction: 'top-bottom',
    isPausedWhenNotInView: true,
    image : {
        source: 'static/img/forest.jpg',
        blendingMode: 'multiply',
        position: ['center', 'bottom'],
    },
    states : {
        "default-state": {
            gradients: [
                ['#29323c', '#485563'],
                ['#FF6B6B', '#556270'],
                ['#80d3fe', '#7ea0c4'],
                ['#f0ab51', '#eceba3']
            ],
            transitionSpeed: 1000
        }
    }
});

var greenIcon = L.icon({
    iconUrl: 'static/img/image-asset.png',
    iconSize:     [38, 65], // size of the icon
    iconAnchor:   [22, 64], // point of the icon which will correspond to marker's location
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

// Adding plotly visitation graph
function graphVisitation(np_code){
  d3.csv('yearly_visitation.csv', (function(dataset){
    //console.log(dataset)
    let code = np_code;
    let park = dataset.filter(data => data.Code === code)
    //console.log(park)
    let x_axis = park.map(d => +d.Year).reverse()
    let y_axis = park.map(d => +d.Total).reverse()

    var trace1 = {
      x: x_axis,
      y: y_axis,
      mode: 'lines+markers',
    };

    let layout = {
      xaxis: {
        title: `Year`,
        range: [d3.min(x_axis)-.2, d3.max(x_axis)+.2]
      },
      yaxis: {
        title: `Visitation`,
        range: [0, d3.max(y_axis)]
      },
      title:`Yearly Visitation: ${code}`
    }
    
    var data = [trace1];
    
    Plotly.newPlot('plotly', data, layout);
  })
)};

// climate graph
function graphBaseClimate(np_code){
  d3.csv('climate_data_total.csv', (function(dataset){
    let code = np_code;
    let unit = 'F';
    let parkC = dataset.filter(data => (data.Code === code && data.Unit === unit ));
    console.log(parkC)
    let x_axisC = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Year']
    let y_axisC = []
    for (let i = 0;i < x_axisC.length; ++i){
      let month = x_axisC[i]
      let temp = +parkC[0][month]
      y_axisC.push(temp)
    }
    var traceC = {
      x: x_axisC,
      y: y_axisC,
      type: 'bar',
    };
    let layoutC = {
      xaxis: {
        title: `Month`
      },
      yaxis: {
        title: `Avg. Max Temperature (${unit})`,
      },
      title:`Avg High Temperature by Month: ${code}`
    } 
    var dataC = [traceC];  
    Plotly.newPlot('plotly', dataC, layoutC);
  })
  )};

// climate graph
function graphCompareClimate(np_code,decade){
    d3.csv('climate_data_total.csv', (function(dataset){
      let code = np_code
      let unit = 'F'
      let park20 = dataset.filter(data => (data.Code === code && data.Unit === unit && data.Decade=='2020'))
      console.log(park20)
      let x_axis = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Year']
      let y_axis20 = [];
      for (let i = 0;i < x_axis.length; ++i){
        let month = x_axis[i]
        let temp = +park20[0][month]
        y_axis20.push(temp)
      }
      let parkComp = dataset.filter(data => (data.Code === code && data.Unit === unit && data.Decade==`${decade}`))
      let y_axisComp = [];
      for (let i = 0;i < x_axis.length; ++i){
        let month = x_axis[i]
        let temp = +parkComp[0][month]
        y_axisComp.push(temp)
      }
      var trace20 = {
        x: x_axis,
        y: y_axis20,
        type: 'bar',
    //   mode: 'markers',
        name: '2020'
      };
      var traceComp = {
        x: x_axis,
        y: y_axisComp,
        type: 'bar',
     //   mode: 'markers',
        name: `${decade}`,
      };
      let layout = {
        xaxis: {
          title: `Month`
        },
        yaxis: {
          title: `Avg. Max Temperature (${unit})`,
          range: [d3.min(y_axis20) - 5,d3.max(y_axisComp) + 5]
        },
        title:`Avg High Temperature by Month: ${code}`
      }  
      var dataC = [trace20, traceComp]; 
      Plotly.newPlot('plotly', dataC, layout);
    })
    )};

function createVisitationMap() {
    // Adding markers for one location for each park
    let parks = [{'Park': 'Olympic National Park', 'Code': 'OLYM', 'lat': 47.8021067, 'lng': -123.6043524}, {'Park': 'Acadia National Park', 'Code': 'ACAD', 'lat': 44.3385559, 'lng': -68.2733346}, {'Park': 'Great Smoky Mountains National Park', 'Code': 'GRSM', 'lat': 35.6117644, 'lng': -83.4895449}, {'Park': 'Isle Royale National Park', 'Code': 'ISRO', 'lat': 47.9958654, 'lng': -88.9092899}, {'Park': 'Redwood National Park', 'Code': 'REDW', 'lat': 41.2131788, 'lng': -124.0046275}, {'Park': 'Shenandoah National Park', 'Code': 'SHEN', 'lat': 38.29275579999999, 'lng': -78.6795836}, {'Park': 'Wolf Trap National Park for the Performing Arts', 'Code': 'WOTR', 'lat': 38.9378645, 'lng': -77.2653551}, {'Park': 'Dry Tortugas National Park', 'Code': 'DRTO', 'lat': 24.628477, 'lng': -82.87318739999999}, {'Park': 'Bryce Canyon National Park', 'Code': 'BRCA', 'lat': 37.5930377, 'lng': -112.1870895}, {'Park': 'Yellowstone National Park', 'Code': 'YELL', 'lat': 44.427963, 'lng': -110.588455}, {'Park': 'Sequoia National Park', 'Code': 'SEQU', 'lat': 36.5647207, 'lng': -118.7727191}, {'Park': 'Mammoth Cave National Park', 'Code': 'MACA', 'lat': 37.1861597, 'lng': -86.0999753}, {'Park': 'Great Basin National Park', 'Code': 'GRBA', 'lat': 38.98333299999999, 'lng': -114.3}, {'Park': 'Channel Islands National Park', 'Code': 'CHIS', 'lat': 34.0069361, 'lng': -119.778533}, {'Park': 'Canyonlands National Park', 'Code': 'CANY', 'lat': 38.3268693, 'lng': -109.8782592}, {'Park': 'Biscayne National Park', 'Code': 'BISC', 'lat': 25.4824229, 'lng': -80.20831030000001}, {'Park': 'Guadalupe Mountains National Park', 'Code': 'GUMO', 'lat': 31.891227, 'lng': -104.8605034}, {'Park': 'Gateway Arch National Park', 'Code': 'JEFF', 'lat': 38.6246855, 'lng': -90.1854426}, {'Park': 'Kings Canyon National Park', 'Code': 'KICA', 'lat': 36.8878548, 'lng': -118.5551477}, {'Park': 'Capitol Reef National Park', 'Code': 'CARE', 'lat': 38.3669703, 'lng': -111.2615042}, {'Park': 'Pinnacles National Park', 'Code': 'PINN', 'lat': 36.4905655, 'lng': -121.1824925}, {'Park': 'Lassen Volcanic National Park', 'Code': 'LAVO', 'lat': 40.49766, 'lng': -121.4206552}, {'Park': 'Mount Rainier National Park', 'Code': 'MORA', 'lat': 46.8799663, 'lng': -121.7269094}, {'Park': 'Yosemite National Park', 'Code': 'YOSE', 'lat': 37.8651011, 'lng': -119.5383294}, {'Park': 'Wind Cave National Park', 'Code': 'WICA', 'lat': 43.6045811, 'lng': -103.4213433}, {'Park': 'North Cascades National Park', 'Code': 'NOCA', 'lat': 48.7718174, 'lng': -121.2984648}, {'Park': 'National Park of American Samoa', 'Code': 'NPSA', 'lat': -14.2583333, 'lng': -170.6833333}, {'Park': 'Voyageurs National Park', 'Code': 'VOYA', 'lat': 48.4840955, 'lng': -92.8270873}, {'Park': 'Congaree National Park', 'Code': 'CONG', 'lat': 33.7948001, 'lng': -80.7820962}, {'Park': 'Haleakala National Park', 'Code': 'HALE', 'lat': 20.7096921, 'lng': -156.2535147}, {'Park': 'Carlsbad Caverns National Park', 'Code': 'CAVE', 'lat': 32.1478553, 'lng': -104.5567138}, {'Park': 'Zion National Park', 'Code': 'ZION', 'lat': 37.2982022, 'lng': -113.0263005}, {'Park': 'Theodore Roosevelt National Park', 'Code': 'THRO', 'lat': 46.978965, 'lng': -103.5387091}, {'Park': 'Crater Lake National Park', 'Code': 'CRLA', 'lat': 42.8684411, 'lng': -122.1684785}, {'Park': 'Glacier National Park', 'Code': 'GLAC', 'lat': 48.7596128, 'lng': -113.7870225}, {'Park': 'Saguaro National Park', 'Code': 'SAGU', 'lat': 32.2967359, 'lng': -111.166615}, {'Park': 'Grand Teton National Park', 'Code': 'GRTE', 'lat': 43.7410416, 'lng': -110.8024362}, {'Park': 'Great Sand Dunes National Park', 'Code': 'GRSA', 'lat': 37.7915959, 'lng': -105.5943276}, {'Park': 'Black Canyon of the Gunnison National Park', 'Code': 'BLCA', 'lat': 38.5753936, 'lng': -107.7415961}, {'Park': 'Big Bend National Park', 'Code': 'BIBE', 'lat': 29.1274869, 'lng': -103.2425379}, {'Park': 'Arches National Park', 'Code': 'ARCH', 'lat': 38.733081, 'lng': -109.5925139}, {'Park': 'Grand Canyon National Park', 'Code': 'GRCA', 'lat': 36.0544445, 'lng': -112.1401108}, {'Park': 'Mesa Verde National Park', 'Code': 'MEVE', 'lat': 37.2308729, 'lng': -108.4618335}, {'Park': 'Virgin Islands National Park', 'Code': 'VIIS', 'lat': 18.3424047, 'lng': -64.74857589999999}, {'Park': "Hawai'i Volcanoes National Park", 'Code': 'HAVO', 'lat': 19.4193697, 'lng': -155.2884969}, {'Park': 'Cuyahoga Valley National Park', 'Code': 'CUVA', 'lat': 41.2808248, 'lng': -81.56781199999999}, {'Park': 'Wrangell-St. Elias National Park', 'Code': 'WRST', 'lat': 61.8, 'lng': -143.5}, {'Park': 'Glacier Bay National Park', 'Code': 'GLBA', 'lat': 58.7, 'lng': -136.1499999}, {'Park': 'Katmai National Park', 'Code': 'KATM', 'lat': 58.6125631, 'lng': -155.0631051}, {'Park': 'Kenai Fjords National Park', 'Code': 'KEFJ', 'lat': 59.69222219999999, 'lng': -150.6155555}, {'Park': 'Gates of the Arctic National Park', 'Code': 'GAAR', 'lat': 67.91462969999999, 'lng': -153.4637908}, {'Park': 'Denali National Park', 'Code': 'DENA', 'lat': 63.1148002, 'lng': -151.1926057}, {'Park': 'Kobuk Valley National Park', 'Code': 'KOVA', 'lat': 67.3356197, 'lng': -159.1243161}, {'Park': 'Lake Clark National Park', 'Code': 'LACL', 'lat': 60.4126957, 'lng': -154.3234955}, {'Park': 'Rocky Mountain National Park', 'Code': 'ROMO', 'lat': 40.3427932, 'lng': -105.6836389}, {'Park': 'Joshua Tree National Park', 'Code': 'JOTR', 'lat': 33.873415, 'lng': -115.9009923}, {'Park': 'Everglades National Park', 'Code': 'EVER', 'lat': 25.2866155, 'lng': -80.89865089999999}, {'Park': 'Badlands National Park', 'Code': 'BADL', 'lat': 43.8553804, 'lng': -102.3396912}, {'Park': 'Petrified Forest National Park', 'Code': 'PEFO', 'lat': 34.9099897, 'lng': -109.8067916}, {'Park': 'Hot Springs National Park', 'Code': 'HOSP', 'lat': 34.5216915, 'lng': -93.0423545}, {'Park': 'Indiana Dunes National Park', 'Code': 'INDU', 'lat': 41.6532682, 'lng': -87.05243349999999}, {'Park': 'Death Valley National Park', 'Code': 'DEVA', 'lat': 36.5053891, 'lng': -117.0794078}]
    for (var i = 0; i < parks.length; i++) {
        var park = parks[i];
        var m = L.marker([park.lat, park.lng], {icon: greenIcon}).addTo(map)    
        p = new L.popup({keepInView: true,minWidth:1000, minHeight: 2000,})
            .setContent("<h1>" + park.Park + "</h1> <h2 id='plotly'></h2>")
            .setLatLng([park.lat, park.lng]);
        m.bindPopup(p);
        m.on('popupopen', function(e) {
            graphVisitation(e.popup._source._myID);
        }).addTo(map);
        m._myID = park.Code;
    }
};

function createBaseClimateMap() {

    // Adding markers for one location for each park
    let parks = [{'Park': 'Olympic National Park', 'Code': 'OLYM', 'lat': 47.8021067, 'lng': -123.6043524}, {'Park': 'Acadia National Park', 'Code': 'ACAD', 'lat': 44.3385559, 'lng': -68.2733346}, {'Park': 'Great Smoky Mountains National Park', 'Code': 'GRSM', 'lat': 35.6117644, 'lng': -83.4895449}, {'Park': 'Isle Royale National Park', 'Code': 'ISRO', 'lat': 47.9958654, 'lng': -88.9092899}, {'Park': 'Redwood National Park', 'Code': 'REDW', 'lat': 41.2131788, 'lng': -124.0046275}, {'Park': 'Shenandoah National Park', 'Code': 'SHEN', 'lat': 38.29275579999999, 'lng': -78.6795836}, {'Park': 'Wolf Trap National Park for the Performing Arts', 'Code': 'WOTR', 'lat': 38.9378645, 'lng': -77.2653551}, {'Park': 'Dry Tortugas National Park', 'Code': 'DRTO', 'lat': 24.628477, 'lng': -82.87318739999999}, {'Park': 'Bryce Canyon National Park', 'Code': 'BRCA', 'lat': 37.5930377, 'lng': -112.1870895}, {'Park': 'Yellowstone National Park', 'Code': 'YELL', 'lat': 44.427963, 'lng': -110.588455}, {'Park': 'Sequoia National Park', 'Code': 'SEQU', 'lat': 36.5647207, 'lng': -118.7727191}, {'Park': 'Mammoth Cave National Park', 'Code': 'MACA', 'lat': 37.1861597, 'lng': -86.0999753}, {'Park': 'Great Basin National Park', 'Code': 'GRBA', 'lat': 38.98333299999999, 'lng': -114.3}, {'Park': 'Channel Islands National Park', 'Code': 'CHIS', 'lat': 34.0069361, 'lng': -119.778533}, {'Park': 'Canyonlands National Park', 'Code': 'CANY', 'lat': 38.3268693, 'lng': -109.8782592}, {'Park': 'Biscayne National Park', 'Code': 'BISC', 'lat': 25.4824229, 'lng': -80.20831030000001}, {'Park': 'Guadalupe Mountains National Park', 'Code': 'GUMO', 'lat': 31.891227, 'lng': -104.8605034}, {'Park': 'Gateway Arch National Park', 'Code': 'JEFF', 'lat': 38.6246855, 'lng': -90.1854426}, {'Park': 'Kings Canyon National Park', 'Code': 'KICA', 'lat': 36.8878548, 'lng': -118.5551477}, {'Park': 'Capitol Reef National Park', 'Code': 'CARE', 'lat': 38.3669703, 'lng': -111.2615042}, {'Park': 'Pinnacles National Park', 'Code': 'PINN', 'lat': 36.4905655, 'lng': -121.1824925}, {'Park': 'Lassen Volcanic National Park', 'Code': 'LAVO', 'lat': 40.49766, 'lng': -121.4206552}, {'Park': 'Mount Rainier National Park', 'Code': 'MORA', 'lat': 46.8799663, 'lng': -121.7269094}, {'Park': 'Yosemite National Park', 'Code': 'YOSE', 'lat': 37.8651011, 'lng': -119.5383294}, {'Park': 'Wind Cave National Park', 'Code': 'WICA', 'lat': 43.6045811, 'lng': -103.4213433}, {'Park': 'North Cascades National Park', 'Code': 'NOCA', 'lat': 48.7718174, 'lng': -121.2984648}, {'Park': 'National Park of American Samoa', 'Code': 'NPSA', 'lat': -14.2583333, 'lng': -170.6833333}, {'Park': 'Voyageurs National Park', 'Code': 'VOYA', 'lat': 48.4840955, 'lng': -92.8270873}, {'Park': 'Congaree National Park', 'Code': 'CONG', 'lat': 33.7948001, 'lng': -80.7820962}, {'Park': 'Haleakala National Park', 'Code': 'HALE', 'lat': 20.7096921, 'lng': -156.2535147}, {'Park': 'Carlsbad Caverns National Park', 'Code': 'CAVE', 'lat': 32.1478553, 'lng': -104.5567138}, {'Park': 'Zion National Park', 'Code': 'ZION', 'lat': 37.2982022, 'lng': -113.0263005}, {'Park': 'Theodore Roosevelt National Park', 'Code': 'THRO', 'lat': 46.978965, 'lng': -103.5387091}, {'Park': 'Crater Lake National Park', 'Code': 'CRLA', 'lat': 42.8684411, 'lng': -122.1684785}, {'Park': 'Glacier National Park', 'Code': 'GLAC', 'lat': 48.7596128, 'lng': -113.7870225}, {'Park': 'Saguaro National Park', 'Code': 'SAGU', 'lat': 32.2967359, 'lng': -111.166615}, {'Park': 'Grand Teton National Park', 'Code': 'GRTE', 'lat': 43.7410416, 'lng': -110.8024362}, {'Park': 'Great Sand Dunes National Park', 'Code': 'GRSA', 'lat': 37.7915959, 'lng': -105.5943276}, {'Park': 'Black Canyon of the Gunnison National Park', 'Code': 'BLCA', 'lat': 38.5753936, 'lng': -107.7415961}, {'Park': 'Big Bend National Park', 'Code': 'BIBE', 'lat': 29.1274869, 'lng': -103.2425379}, {'Park': 'Arches National Park', 'Code': 'ARCH', 'lat': 38.733081, 'lng': -109.5925139}, {'Park': 'Grand Canyon National Park', 'Code': 'GRCA', 'lat': 36.0544445, 'lng': -112.1401108}, {'Park': 'Mesa Verde National Park', 'Code': 'MEVE', 'lat': 37.2308729, 'lng': -108.4618335}, {'Park': 'Virgin Islands National Park', 'Code': 'VIIS', 'lat': 18.3424047, 'lng': -64.74857589999999}, {'Park': "Hawai'i Volcanoes National Park", 'Code': 'HAVO', 'lat': 19.4193697, 'lng': -155.2884969}, {'Park': 'Cuyahoga Valley National Park', 'Code': 'CUVA', 'lat': 41.2808248, 'lng': -81.56781199999999}, {'Park': 'Wrangell-St. Elias National Park', 'Code': 'WRST', 'lat': 61.8, 'lng': -143.5}, {'Park': 'Glacier Bay National Park', 'Code': 'GLBA', 'lat': 58.7, 'lng': -136.1499999}, {'Park': 'Katmai National Park', 'Code': 'KATM', 'lat': 58.6125631, 'lng': -155.0631051}, {'Park': 'Kenai Fjords National Park', 'Code': 'KEFJ', 'lat': 59.69222219999999, 'lng': -150.6155555}, {'Park': 'Gates of the Arctic National Park', 'Code': 'GAAR', 'lat': 67.91462969999999, 'lng': -153.4637908}, {'Park': 'Denali National Park', 'Code': 'DENA', 'lat': 63.1148002, 'lng': -151.1926057}, {'Park': 'Kobuk Valley National Park', 'Code': 'KOVA', 'lat': 67.3356197, 'lng': -159.1243161}, {'Park': 'Lake Clark National Park', 'Code': 'LACL', 'lat': 60.4126957, 'lng': -154.3234955}, {'Park': 'Rocky Mountain National Park', 'Code': 'ROMO', 'lat': 40.3427932, 'lng': -105.6836389}, {'Park': 'Joshua Tree National Park', 'Code': 'JOTR', 'lat': 33.873415, 'lng': -115.9009923}, {'Park': 'Everglades National Park', 'Code': 'EVER', 'lat': 25.2866155, 'lng': -80.89865089999999}, {'Park': 'Badlands National Park', 'Code': 'BADL', 'lat': 43.8553804, 'lng': -102.3396912}, {'Park': 'Petrified Forest National Park', 'Code': 'PEFO', 'lat': 34.9099897, 'lng': -109.8067916}, {'Park': 'Hot Springs National Park', 'Code': 'HOSP', 'lat': 34.5216915, 'lng': -93.0423545}, {'Park': 'Indiana Dunes National Park', 'Code': 'INDU', 'lat': 41.6532682, 'lng': -87.05243349999999}, {'Park': 'Death Valley National Park', 'Code': 'DEVA', 'lat': 36.5053891, 'lng': -117.0794078}]
    let no_data = ['ISRO','WOTR','JEFF','NPSA','HALE','BIBE','VIIS','HAVO','WRST','KATM','KEFJ','GAAR','KOVA','LACL']
    for (var i = 0; i < parks.length; i++) {
        var park = parks[i];
        var m = L.marker([park.lat, park.lng],{icon: greenIcon}).addTo(map)
        if (no_data.includes(park.Code)){
        p = new L.popup({keepInView: true,minWidth:1000, minHeight: 2000,})
            .setContent("<h1>" + park.Park + "</h1> <h2> No Weather Data Available </h2>")
            .setLatLng([park.lat, park.lng]);
        m.bindPopup(p);
        }
        else {
        p = new L.popup({keepInView: true,minWidth:1000, minHeight: 2000,})
            .setContent("<h1>" + park.Park + "</h1> <h2 id='plotly'></h2>")
            .setLatLng([park.lat, park.lng]);
        m.bindPopup(p);
        m.on('popupopen', function(e) {
            graphBaseClimate(e.popup._source._myID);
        }).addTo(map);
        m._myID = park.Code;
    }}
};

function create2050ClimateMap() {

    // Adding markers for one location for each park
    let parks = [{'Park': 'Olympic National Park', 'Code': 'OLYM', 'lat': 47.8021067, 'lng': -123.6043524}, {'Park': 'Acadia National Park', 'Code': 'ACAD', 'lat': 44.3385559, 'lng': -68.2733346}, {'Park': 'Great Smoky Mountains National Park', 'Code': 'GRSM', 'lat': 35.6117644, 'lng': -83.4895449}, {'Park': 'Isle Royale National Park', 'Code': 'ISRO', 'lat': 47.9958654, 'lng': -88.9092899}, {'Park': 'Redwood National Park', 'Code': 'REDW', 'lat': 41.2131788, 'lng': -124.0046275}, {'Park': 'Shenandoah National Park', 'Code': 'SHEN', 'lat': 38.29275579999999, 'lng': -78.6795836}, {'Park': 'Wolf Trap National Park for the Performing Arts', 'Code': 'WOTR', 'lat': 38.9378645, 'lng': -77.2653551}, {'Park': 'Dry Tortugas National Park', 'Code': 'DRTO', 'lat': 24.628477, 'lng': -82.87318739999999}, {'Park': 'Bryce Canyon National Park', 'Code': 'BRCA', 'lat': 37.5930377, 'lng': -112.1870895}, {'Park': 'Yellowstone National Park', 'Code': 'YELL', 'lat': 44.427963, 'lng': -110.588455}, {'Park': 'Sequoia National Park', 'Code': 'SEQU', 'lat': 36.5647207, 'lng': -118.7727191}, {'Park': 'Mammoth Cave National Park', 'Code': 'MACA', 'lat': 37.1861597, 'lng': -86.0999753}, {'Park': 'Great Basin National Park', 'Code': 'GRBA', 'lat': 38.98333299999999, 'lng': -114.3}, {'Park': 'Channel Islands National Park', 'Code': 'CHIS', 'lat': 34.0069361, 'lng': -119.778533}, {'Park': 'Canyonlands National Park', 'Code': 'CANY', 'lat': 38.3268693, 'lng': -109.8782592}, {'Park': 'Biscayne National Park', 'Code': 'BISC', 'lat': 25.4824229, 'lng': -80.20831030000001}, {'Park': 'Guadalupe Mountains National Park', 'Code': 'GUMO', 'lat': 31.891227, 'lng': -104.8605034}, {'Park': 'Gateway Arch National Park', 'Code': 'JEFF', 'lat': 38.6246855, 'lng': -90.1854426}, {'Park': 'Kings Canyon National Park', 'Code': 'KICA', 'lat': 36.8878548, 'lng': -118.5551477}, {'Park': 'Capitol Reef National Park', 'Code': 'CARE', 'lat': 38.3669703, 'lng': -111.2615042}, {'Park': 'Pinnacles National Park', 'Code': 'PINN', 'lat': 36.4905655, 'lng': -121.1824925}, {'Park': 'Lassen Volcanic National Park', 'Code': 'LAVO', 'lat': 40.49766, 'lng': -121.4206552}, {'Park': 'Mount Rainier National Park', 'Code': 'MORA', 'lat': 46.8799663, 'lng': -121.7269094}, {'Park': 'Yosemite National Park', 'Code': 'YOSE', 'lat': 37.8651011, 'lng': -119.5383294}, {'Park': 'Wind Cave National Park', 'Code': 'WICA', 'lat': 43.6045811, 'lng': -103.4213433}, {'Park': 'North Cascades National Park', 'Code': 'NOCA', 'lat': 48.7718174, 'lng': -121.2984648}, {'Park': 'National Park of American Samoa', 'Code': 'NPSA', 'lat': -14.2583333, 'lng': -170.6833333}, {'Park': 'Voyageurs National Park', 'Code': 'VOYA', 'lat': 48.4840955, 'lng': -92.8270873}, {'Park': 'Congaree National Park', 'Code': 'CONG', 'lat': 33.7948001, 'lng': -80.7820962}, {'Park': 'Haleakala National Park', 'Code': 'HALE', 'lat': 20.7096921, 'lng': -156.2535147}, {'Park': 'Carlsbad Caverns National Park', 'Code': 'CAVE', 'lat': 32.1478553, 'lng': -104.5567138}, {'Park': 'Zion National Park', 'Code': 'ZION', 'lat': 37.2982022, 'lng': -113.0263005}, {'Park': 'Theodore Roosevelt National Park', 'Code': 'THRO', 'lat': 46.978965, 'lng': -103.5387091}, {'Park': 'Crater Lake National Park', 'Code': 'CRLA', 'lat': 42.8684411, 'lng': -122.1684785}, {'Park': 'Glacier National Park', 'Code': 'GLAC', 'lat': 48.7596128, 'lng': -113.7870225}, {'Park': 'Saguaro National Park', 'Code': 'SAGU', 'lat': 32.2967359, 'lng': -111.166615}, {'Park': 'Grand Teton National Park', 'Code': 'GRTE', 'lat': 43.7410416, 'lng': -110.8024362}, {'Park': 'Great Sand Dunes National Park', 'Code': 'GRSA', 'lat': 37.7915959, 'lng': -105.5943276}, {'Park': 'Black Canyon of the Gunnison National Park', 'Code': 'BLCA', 'lat': 38.5753936, 'lng': -107.7415961}, {'Park': 'Big Bend National Park', 'Code': 'BIBE', 'lat': 29.1274869, 'lng': -103.2425379}, {'Park': 'Arches National Park', 'Code': 'ARCH', 'lat': 38.733081, 'lng': -109.5925139}, {'Park': 'Grand Canyon National Park', 'Code': 'GRCA', 'lat': 36.0544445, 'lng': -112.1401108}, {'Park': 'Mesa Verde National Park', 'Code': 'MEVE', 'lat': 37.2308729, 'lng': -108.4618335}, {'Park': 'Virgin Islands National Park', 'Code': 'VIIS', 'lat': 18.3424047, 'lng': -64.74857589999999}, {'Park': "Hawai'i Volcanoes National Park", 'Code': 'HAVO', 'lat': 19.4193697, 'lng': -155.2884969}, {'Park': 'Cuyahoga Valley National Park', 'Code': 'CUVA', 'lat': 41.2808248, 'lng': -81.56781199999999}, {'Park': 'Wrangell-St. Elias National Park', 'Code': 'WRST', 'lat': 61.8, 'lng': -143.5}, {'Park': 'Glacier Bay National Park', 'Code': 'GLBA', 'lat': 58.7, 'lng': -136.1499999}, {'Park': 'Katmai National Park', 'Code': 'KATM', 'lat': 58.6125631, 'lng': -155.0631051}, {'Park': 'Kenai Fjords National Park', 'Code': 'KEFJ', 'lat': 59.69222219999999, 'lng': -150.6155555}, {'Park': 'Gates of the Arctic National Park', 'Code': 'GAAR', 'lat': 67.91462969999999, 'lng': -153.4637908}, {'Park': 'Denali National Park', 'Code': 'DENA', 'lat': 63.1148002, 'lng': -151.1926057}, {'Park': 'Kobuk Valley National Park', 'Code': 'KOVA', 'lat': 67.3356197, 'lng': -159.1243161}, {'Park': 'Lake Clark National Park', 'Code': 'LACL', 'lat': 60.4126957, 'lng': -154.3234955}, {'Park': 'Rocky Mountain National Park', 'Code': 'ROMO', 'lat': 40.3427932, 'lng': -105.6836389}, {'Park': 'Joshua Tree National Park', 'Code': 'JOTR', 'lat': 33.873415, 'lng': -115.9009923}, {'Park': 'Everglades National Park', 'Code': 'EVER', 'lat': 25.2866155, 'lng': -80.89865089999999}, {'Park': 'Badlands National Park', 'Code': 'BADL', 'lat': 43.8553804, 'lng': -102.3396912}, {'Park': 'Petrified Forest National Park', 'Code': 'PEFO', 'lat': 34.9099897, 'lng': -109.8067916}, {'Park': 'Hot Springs National Park', 'Code': 'HOSP', 'lat': 34.5216915, 'lng': -93.0423545}, {'Park': 'Indiana Dunes National Park', 'Code': 'INDU', 'lat': 41.6532682, 'lng': -87.05243349999999}, {'Park': 'Death Valley National Park', 'Code': 'DEVA', 'lat': 36.5053891, 'lng': -117.0794078}]
    let no_data = ['ISRO','WOTR','JEFF','NPSA','HALE','BIBE','VIIS','HAVO','WRST','KATM','KEFJ','GAAR','KOVA','LACL']
    for (var i = 0; i < parks.length; i++) {
        var park = parks[i];
        var m = L.marker([park.lat, park.lng],{icon: greenIcon}).addTo(map)
        if (no_data.includes(park.Code)){
            p = new L.popup({keepInView: true,minWidth:1000, minHeight: 2000,})
                .setContent("<h1>" + park.Park + "</h1> <h2> No Weather Data Available </h2>")
                .setLatLng([park.lat, park.lng]);
            m.bindPopup(p);
        }
        else {
        p = new L.popup({keepInView: true,minWidth:1000, minHeight: 2000,})
            .setContent("<h1>" + park.Park + "</h1> <h2 id='plotly'></h2>")
            .setLatLng([park.lat, park.lng]);
        m.bindPopup(p);
        m.on('popupopen', function(e) {
            graphCompareClimate(e.popup._source._myID, '2050');
        }).addTo(map);
        m._myID = park.Code;
    }}
};

function create2100ClimateMap() {

    // Adding markers for one location for each park
    let parks = [{'Park': 'Olympic National Park', 'Code': 'OLYM', 'lat': 47.8021067, 'lng': -123.6043524}, {'Park': 'Acadia National Park', 'Code': 'ACAD', 'lat': 44.3385559, 'lng': -68.2733346}, {'Park': 'Great Smoky Mountains National Park', 'Code': 'GRSM', 'lat': 35.6117644, 'lng': -83.4895449}, {'Park': 'Isle Royale National Park', 'Code': 'ISRO', 'lat': 47.9958654, 'lng': -88.9092899}, {'Park': 'Redwood National Park', 'Code': 'REDW', 'lat': 41.2131788, 'lng': -124.0046275}, {'Park': 'Shenandoah National Park', 'Code': 'SHEN', 'lat': 38.29275579999999, 'lng': -78.6795836}, {'Park': 'Wolf Trap National Park for the Performing Arts', 'Code': 'WOTR', 'lat': 38.9378645, 'lng': -77.2653551}, {'Park': 'Dry Tortugas National Park', 'Code': 'DRTO', 'lat': 24.628477, 'lng': -82.87318739999999}, {'Park': 'Bryce Canyon National Park', 'Code': 'BRCA', 'lat': 37.5930377, 'lng': -112.1870895}, {'Park': 'Yellowstone National Park', 'Code': 'YELL', 'lat': 44.427963, 'lng': -110.588455}, {'Park': 'Sequoia National Park', 'Code': 'SEQU', 'lat': 36.5647207, 'lng': -118.7727191}, {'Park': 'Mammoth Cave National Park', 'Code': 'MACA', 'lat': 37.1861597, 'lng': -86.0999753}, {'Park': 'Great Basin National Park', 'Code': 'GRBA', 'lat': 38.98333299999999, 'lng': -114.3}, {'Park': 'Channel Islands National Park', 'Code': 'CHIS', 'lat': 34.0069361, 'lng': -119.778533}, {'Park': 'Canyonlands National Park', 'Code': 'CANY', 'lat': 38.3268693, 'lng': -109.8782592}, {'Park': 'Biscayne National Park', 'Code': 'BISC', 'lat': 25.4824229, 'lng': -80.20831030000001}, {'Park': 'Guadalupe Mountains National Park', 'Code': 'GUMO', 'lat': 31.891227, 'lng': -104.8605034}, {'Park': 'Gateway Arch National Park', 'Code': 'JEFF', 'lat': 38.6246855, 'lng': -90.1854426}, {'Park': 'Kings Canyon National Park', 'Code': 'KICA', 'lat': 36.8878548, 'lng': -118.5551477}, {'Park': 'Capitol Reef National Park', 'Code': 'CARE', 'lat': 38.3669703, 'lng': -111.2615042}, {'Park': 'Pinnacles National Park', 'Code': 'PINN', 'lat': 36.4905655, 'lng': -121.1824925}, {'Park': 'Lassen Volcanic National Park', 'Code': 'LAVO', 'lat': 40.49766, 'lng': -121.4206552}, {'Park': 'Mount Rainier National Park', 'Code': 'MORA', 'lat': 46.8799663, 'lng': -121.7269094}, {'Park': 'Yosemite National Park', 'Code': 'YOSE', 'lat': 37.8651011, 'lng': -119.5383294}, {'Park': 'Wind Cave National Park', 'Code': 'WICA', 'lat': 43.6045811, 'lng': -103.4213433}, {'Park': 'North Cascades National Park', 'Code': 'NOCA', 'lat': 48.7718174, 'lng': -121.2984648}, {'Park': 'National Park of American Samoa', 'Code': 'NPSA', 'lat': -14.2583333, 'lng': -170.6833333}, {'Park': 'Voyageurs National Park', 'Code': 'VOYA', 'lat': 48.4840955, 'lng': -92.8270873}, {'Park': 'Congaree National Park', 'Code': 'CONG', 'lat': 33.7948001, 'lng': -80.7820962}, {'Park': 'Haleakala National Park', 'Code': 'HALE', 'lat': 20.7096921, 'lng': -156.2535147}, {'Park': 'Carlsbad Caverns National Park', 'Code': 'CAVE', 'lat': 32.1478553, 'lng': -104.5567138}, {'Park': 'Zion National Park', 'Code': 'ZION', 'lat': 37.2982022, 'lng': -113.0263005}, {'Park': 'Theodore Roosevelt National Park', 'Code': 'THRO', 'lat': 46.978965, 'lng': -103.5387091}, {'Park': 'Crater Lake National Park', 'Code': 'CRLA', 'lat': 42.8684411, 'lng': -122.1684785}, {'Park': 'Glacier National Park', 'Code': 'GLAC', 'lat': 48.7596128, 'lng': -113.7870225}, {'Park': 'Saguaro National Park', 'Code': 'SAGU', 'lat': 32.2967359, 'lng': -111.166615}, {'Park': 'Grand Teton National Park', 'Code': 'GRTE', 'lat': 43.7410416, 'lng': -110.8024362}, {'Park': 'Great Sand Dunes National Park', 'Code': 'GRSA', 'lat': 37.7915959, 'lng': -105.5943276}, {'Park': 'Black Canyon of the Gunnison National Park', 'Code': 'BLCA', 'lat': 38.5753936, 'lng': -107.7415961}, {'Park': 'Big Bend National Park', 'Code': 'BIBE', 'lat': 29.1274869, 'lng': -103.2425379}, {'Park': 'Arches National Park', 'Code': 'ARCH', 'lat': 38.733081, 'lng': -109.5925139}, {'Park': 'Grand Canyon National Park', 'Code': 'GRCA', 'lat': 36.0544445, 'lng': -112.1401108}, {'Park': 'Mesa Verde National Park', 'Code': 'MEVE', 'lat': 37.2308729, 'lng': -108.4618335}, {'Park': 'Virgin Islands National Park', 'Code': 'VIIS', 'lat': 18.3424047, 'lng': -64.74857589999999}, {'Park': "Hawai'i Volcanoes National Park", 'Code': 'HAVO', 'lat': 19.4193697, 'lng': -155.2884969}, {'Park': 'Cuyahoga Valley National Park', 'Code': 'CUVA', 'lat': 41.2808248, 'lng': -81.56781199999999}, {'Park': 'Wrangell-St. Elias National Park', 'Code': 'WRST', 'lat': 61.8, 'lng': -143.5}, {'Park': 'Glacier Bay National Park', 'Code': 'GLBA', 'lat': 58.7, 'lng': -136.1499999}, {'Park': 'Katmai National Park', 'Code': 'KATM', 'lat': 58.6125631, 'lng': -155.0631051}, {'Park': 'Kenai Fjords National Park', 'Code': 'KEFJ', 'lat': 59.69222219999999, 'lng': -150.6155555}, {'Park': 'Gates of the Arctic National Park', 'Code': 'GAAR', 'lat': 67.91462969999999, 'lng': -153.4637908}, {'Park': 'Denali National Park', 'Code': 'DENA', 'lat': 63.1148002, 'lng': -151.1926057}, {'Park': 'Kobuk Valley National Park', 'Code': 'KOVA', 'lat': 67.3356197, 'lng': -159.1243161}, {'Park': 'Lake Clark National Park', 'Code': 'LACL', 'lat': 60.4126957, 'lng': -154.3234955}, {'Park': 'Rocky Mountain National Park', 'Code': 'ROMO', 'lat': 40.3427932, 'lng': -105.6836389}, {'Park': 'Joshua Tree National Park', 'Code': 'JOTR', 'lat': 33.873415, 'lng': -115.9009923}, {'Park': 'Everglades National Park', 'Code': 'EVER', 'lat': 25.2866155, 'lng': -80.89865089999999}, {'Park': 'Badlands National Park', 'Code': 'BADL', 'lat': 43.8553804, 'lng': -102.3396912}, {'Park': 'Petrified Forest National Park', 'Code': 'PEFO', 'lat': 34.9099897, 'lng': -109.8067916}, {'Park': 'Hot Springs National Park', 'Code': 'HOSP', 'lat': 34.5216915, 'lng': -93.0423545}, {'Park': 'Indiana Dunes National Park', 'Code': 'INDU', 'lat': 41.6532682, 'lng': -87.05243349999999}, {'Park': 'Death Valley National Park', 'Code': 'DEVA', 'lat': 36.5053891, 'lng': -117.0794078}]
    let no_data = ['ISRO','WOTR','JEFF','NPSA','HALE','BIBE','VIIS','HAVO','WRST','KATM','KEFJ','GAAR','KOVA','LACL']
    for (var i = 0; i < parks.length; i++) {
        var park = parks[i];
        var m = L.marker([park.lat, park.lng],{icon: greenIcon}).addTo(map)
        if (no_data.includes(park.Code)){
            p = new L.popup({keepInView: true,minWidth:1000, minHeight: 2000,})
                .setContent("<h1>" + park.Park + "</h1> <h2> No Weather Data Available </h2>")
                .setLatLng([park.lat, park.lng]);
            m.bindPopup(p);
        }
        else {
        p = new L.popup({keepInView: true,minWidth:1000, minHeight: 2000,})
            .setContent("<h1>" + park.Park + "</h1> <h2 id='plotly'></h2>")
            .setLatLng([park.lat, park.lng]);
        m.bindPopup(p);
        m.on('popupopen', function(e) {
            graphCompareClimate(e.popup._source._myID,'2100');
        }).addTo(map);
        m._myID = park.Code;
    }}
};



// Initializing map tile, view tile, and geojson tile
var map = L.map("map", {
    center: [40, -100],
    zoom: 5
});

// Adding tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
}).addTo(map);

// Uncomment this link local geojson for when data.beta.nyc is down
var link = "static/data/np.geojson";

// Our style object
var mapStyle = {
    color: "white",
    fillColor: "black",
    fillOpacity: 0.7,
    weight: 1.5
};

// Grabbing our GeoJSON data to make locations for each park 62 parks used
d3.json(link, function(data) {
    // Creating a geoJSON layer with the retrieved data
    //console.log(data)
    //console.log(data.features);
    let features = data.features;
    let np = features.filter(d => d.properties.UNIT_TYPE == 'National Park')
    let park_names = np.map( d => d.properties.UNIT_NAME)
    var park_codes = np.map( d => d.properties.UNIT_CODE)
    //console.log(park_codes)
    function npFilter(feature) {
    if (feature.properties.UNIT_TYPE === "National Park") 
        return true
    }
    L.geoJson(data, {
    // Passing in our style object
    filter: npFilter,
    style: mapStyle
    }).addTo(map);
});

createVisitationMap();



// Park Api data 

// Populating drop down with park codes
var selector = d3.select("#selPark");
var park_ids = ["OLYM", "ACAD", "GRSM", "ISRO", "REDW", "SHEN", "WOTR", "DRTO", "BRCA", "YELL", "SEQU", "MACA", "GRBA", "CHIS", "CANY", "BISC", "GUMO", "JEFF", "KICA", "CARE", "PINN", "LAVO", "MORA", "YOSE", "WICA", "NOCA", "NPSA", "VOYA", "CONG", "HALE", "CAVE", "ZION", "THRO", "CRLA", "GLAC", "SAGU", "GRTE", "GRSA", "BLCA", "BIBE", "ARCH", "GRCA", "MEVE", "VIIS", "HAVO", "CUVA", "WRST", "GLBA", "KATM", "KEFJ", "GAAR", "DENA", "KOVA", "LACL", "ROMO", "JOTR", "EVER", "BADL", "PEFO", "HOSP", "INDU", "DEVA"]
park_ids.forEach((park) => {
    selector
      .append("option")
      .text(park)
      .property("value", park);
  });


  function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
  }

function alertTable(np_nps_code) {
  d3.csv("../../all_park_info.csv",function(parkData) {
    console.log(parkData);
    //log a list of park names
    let park_id = np_nps_code;

    var current_park = parkData.filter(entry => entry.CODE == park_id);
    console.log(current_park)
    var alert_code = d3.select('#selPark').value
  
    var alert_table = d3.select('#current_alerts');
    alert_table.html('');
    Object.entries(current_park[0]).forEach(function([key, value]){
     alert_table.append('h4').text(`${toTitleCase(key)}`)
     alert_table.append('h5').text(` ${value}`)
     alert_table.append('br')
    })
  });
}

function optionChanged(parkID){
  alertTable(parkID);
};