import { latLng, LatLng } from "leaflet";



export const fetchAmenities = async (coords: LatLng = latLng(52.4919, 13.4217)) => {
    const bbox = coords.toBounds(1000);
  console.log(bbox);
  const sw = bbox.getSouthWest();
  const ne = bbox.getNorthEast();
  const bbQuery = `${sw.lat},${sw.lng},${ne.lat},${ne.lng}`


  const query = `[out:json][timeout:25];
(
  nwr["amenity"="restaurant"](${bbQuery});
  nwr["amenity"="library"](${bbQuery});
  node["public_transport"="platform"](${bbQuery});
  nwr["amenity"="fuel"](${bbQuery});
  nwr["amenity"="bank"](${bbQuery});
  nwr["amenity"="clinic"](${bbQuery});
  nwr["shop"="chemist"](${bbQuery});
  nwr["amenity"="fire_station"](${bbQuery});
  nwr["amenity"="police"](${bbQuery});
  nwr["amenity"="hospital"](${bbQuery});
);
out geom;
`;

  try {

    const result = await fetch(
      "https://overpass-api.de/api/interpreter",
      {
        method: "POST",
        // The body contains the query
        // to understand the query language see "The Programmatic Query Language" on
        // https://wiki.openstreetmap.org/wiki/Overpass_API#The_Programmatic_Query_Language_(OverpassQL)
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "data=" + encodeURIComponent(query)
      },
    );
    console.log('query is: ', query)
    if (result.ok) {
      const data = await result.json();
      return data;
    } else {
      console.error('error parsing result: ', result.status, result.statusText);
      return result.status
    }
  }
  catch (error) {
    console.log('caught error: ', error);

  }

}


// for testing in console:
fetchAmenities().then((data) => {
  console.log(JSON.stringify(data, null, 2));
}).catch((error) => {
  console.error("Error fetching amenities:", error);
});