export const getToken = () => {
  return localStorage.getItem("token");
}

export const removeToken = () => {
  localStorage.removeItem("token");
}

export const setToken = (token: string) => {
  localStorage.setItem("token", token);
}