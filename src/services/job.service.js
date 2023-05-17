import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://0.0.0.0:8080/api/recruitment/";

class UserService {
  getPositions(params) {
    return axios.get(API_URL + "positions?" + params, {
      headers: authHeader(),
    });
  }
  getPositionsDetail(id) {
    return axios.get(API_URL + "positions/" + id, {
      headers: authHeader(),
    });
  }
}

export default new UserService();
