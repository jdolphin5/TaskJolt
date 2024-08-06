import axios from "axios";

export const navigate = (url: string) => {
  window.location.href = url;
};

export const logout = async () => {
  try {
    const response = await axios.post(`http://localhost:3000/logout`, {
      withCredentials: true,
    });

    //need to use post to return the redirect URI to the frontend
    //if redirecting from the backend, headers are lost and redirect is blocked due to CORS
    navigate(response.data);
  } catch (error: any) {
    console.error("Cannot logout: /logout", error);
  }
};

export const getAuthValue = async () => {
  try {
    const response = await checkAuth();

    if (response) {
      const authData = response.data;
      return authData;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error in getAuthValue:", error);
    return null;
  }
};

export async function checkAuth() {
  try {
    const response = await axios.get("http://localhost:3000/api/isauth");

    console.log(response);

    return response;
  } catch (error) {
    console.error("Error fetching auth data:", error);
  }
}
