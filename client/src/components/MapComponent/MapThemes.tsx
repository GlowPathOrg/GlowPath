const mapThemes: { [key: string]: string } = {
  dark: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  lighttime: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
  satellite:
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  
};

export const getDefaultTheme = (): string => "dark";

export const isValidTheme = (themeKey: string): boolean =>
  Object.keys(mapThemes).includes(themeKey);

export default mapThemes;