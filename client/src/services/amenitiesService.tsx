import { latLng, LatLng, latLngBounds } from "leaflet";

export interface Amenity  {
  type: "node" | "way";
  id: number;
  lat: number;
  lon: number;
  tags: AmenityTags;
  bounds?: {
    minlat: number;
    minlon: number;
    maxlat: number;
    maxlon: number;
  }
  geometry?: [];
  nodes?: [];


}


export interface AmenityTags {
  name?: string;
  amenity?: string;
  bench?: string;
  bin?: string;
  bus?: string;
  highway?: string;
  lit?: string;
  public_transport?: string;
  shelter?: string;
  opening_hours?: string;
  wheelchair: string;


}


export const fetchAmenities = async (radius: number, coords: LatLng = latLng(52.4919, 13.4217)) => {

  const bbox = coords.toBounds(radius);
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
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "data=" + encodeURIComponent(query)
      },
    );

    if (result.ok) {
      const data = await result.json();
      if (Object.keys(data).includes('elements')) {
        const elements: Amenity[] = data.elements;
       const reviewedElements = elements.map((el) => {
           if (el.type === "way" && Object.keys(el).includes('bounds') && el.bounds) {
            const mylatLngBounds = latLngBounds(
              latLng(el.bounds.minlat, el.bounds.minlon),
              latLng(el.bounds.maxlat, el.bounds.maxlon)
            );
            const center: LatLng = mylatLngBounds.getCenter();
            el.lat = center.lat;
            el.lon = center.lng;

          }
          return el

        })
        return reviewedElements;

      } else {
        console.error('error returning amen. data', result.status, result.statusText);
      }
    } else {
      console.error('error fetching: ', result.status, result.statusText);
      return result.status
    }
  }
  catch (error) {
    console.log('caught error: ', error);

  }

}

