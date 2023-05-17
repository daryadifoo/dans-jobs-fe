import axios from "axios";

const API_URL = "http://0.0.0.0:8080/api/user/";

class AuthService {
  login(username, password) {
    return axios
      .post(API_URL + "signin", {
        username,
        password,
      })
      .then((response) => {
        console.log(response.data);
        if (response.data.accessToken) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }

        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("user");
  }

  register(username, password) {
    return axios.post(API_URL + "signup", {
      username,
      password,
    });
  }

  getCurrentUser() {
    console.log(JSON.parse(localStorage.getItem("user")));
    return JSON.parse(localStorage.getItem("user"));
  }
}

export default new AuthService();
