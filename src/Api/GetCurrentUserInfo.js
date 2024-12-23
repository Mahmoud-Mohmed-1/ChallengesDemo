import {DOMAIN} from "./config";
import axios from "axios";

export const GetCurrentUserInfoApi = async (jwtToken) => {
  if(!jwtToken){
    return[[],"Authorization token is missing or invalid"];
  }
  try{
    const response = await axios.get(`${DOMAIN}/api/v1/challenges/current_user_info`,{
      headers:{
        Authorization: jwtToken,
      },
    });
    if(response.status === 200){
      return [response.data,""];
    }else{
      return [[],"Failed to fetch user details. Please try again."];
    }
  }catch(e){
    let errorMessage = "Error occurred while fetching user details.";
    if(e.response){
      const errorData = e.response?.data;
      errorMessage = errorData?.message || errorMessage;
    }else if(e.request){
      errorMessage = "No response received from the server.";
    }else{
      errorMessage = e.message || errorMessage;
    }
    return [[],errorMessage];
  }
}