// utils/token.js
import {jwtDecode} from "jwt-decode";

export const getUserFromToken = () => {
  const token = localStorage.getItem("userToken");
  if (!token) return null;

  try {
    const decodedToken = jwtDecode(token);
    return decodedToken.user;
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
};
