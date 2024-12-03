const mapThemes: { [key: string]: string } = {
  standard: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
  satellite:
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  berlinCrime:
    "https://gdi.berlin.de/services/wms/gewaltdelinquenz?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&FORMAT=image/png&TRANSPARENT=true&SRS=EPSG:4326&LAYERS=de.gewaltdelinquenz",
};

export const getDefaultTheme = (): string => "standard";

export const isValidTheme = (themeKey: string): boolean =>
  Object.keys(mapThemes).includes(themeKey);

export default mapThemes;