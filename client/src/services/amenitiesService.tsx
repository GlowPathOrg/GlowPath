import { latLng, LatLng } from "leaflet";


export interface Amenity  {
  type: "node";
  id: number;
  lat: number;
  lon: number;
  tags: AmenityTags;
}


export interface AmenityTags {
  name?: string;
  amenity?: string;
  bench?: "yes" | "no";
  bin?: "yes" | "no";
  bus?: "yes" | "no";
  highway?: string;
  lit?: "yes" | "no";
  public_transport?: "platform" | "station" | "stop";
  shelter?: "yes" | "no";
  opening_hours?: string;

}

export const fetchAmenities = async (coords: LatLng = latLng(52.4919, 13.4217)) => {
    const bbox = coords.toBounds(500);
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

    if (result.ok) {
      const data = await result.json();
      return data
    } else {
      console.error('error parsing result: ', result.status, result.statusText);
      return result.status
    }
  }
  catch (error) {
    console.log('caught error: ', error);

  }

}

