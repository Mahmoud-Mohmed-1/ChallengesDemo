import axios from "axios";
import {redirect, useNavigate} from "react-router-dom";

const DOMAIN = process.env.REACT_APP_API_URL || "http://127.0.0.1:3001"; // Fallback to default if no env variable

export const AddChallengesApi = async (jwtToken, bodyObject) => {
  if (!jwtToken) {
    return ["", "Authorization token is missing or invalid"];
  }

  try {
    const response = await axios.post(`${DOMAIN}/api/v1/challenges`, bodyObject, {
      headers: {
        "Content-Type": "application/json",
        Authorization: jwtToken,
      },
    });

    if (response.status === 201) {
      return ["Challenge added successfully", ""];
    } else {
      return ["", "Failed to add challenge. Please try again."];
    }
  } catch (error) {
    const errorData = error.response?.data;
    const errorMessage =
      errorData?.message || "Error occurred while adding challenge.";
    return ["", errorMessage];
  }
};






// Add this to each function where navigation is required
export const GetActiveAndUpcomingChallengesApi = async (jwtToken, navigate) => {
  try {
    if (!jwtToken) {
      return [[], "Authorization token is missing or invalid"];
    }

    const response = await axios.get(`${DOMAIN}/api/v1/challenges/active_and_upcoming`,{
      headers: {
        Authorization: jwtToken,
      },
    });
    if (response.status === 200) {
      return [response.data, ""];
    } else {
      return [[], "Failed to fetch challenges. Please try again."];
    }
  } catch (error) {
    let errorMessage = "Error occurred while fetching challenges.";
    if (error.response) {
      const errorData = error.response?.data;
      errorMessage = errorData?.message || errorMessage;
    } else if (error.request) {
      errorMessage = "No response received from the server.";
    } else {
      errorMessage = error.message || errorMessage;
    }
    return [[], errorMessage];
  }
};




export const GetSingleChallengeDetailsApi = async (jwtToken, id, navigate) => {
  try {
    if (!jwtToken) {
      return [[], "Authorization token is missing or invalid"];
    }

    const response = await axios.get(`${DOMAIN}/api/v1/challenges/${id}`, {
      headers: {
        Authorization: jwtToken,
      },
    });

     if (response.status === 200) {
      return [response.data, ""];
    } else {
      return [[], "Failed to fetch challenge. Please try again."];
    }
  } catch (error) {
    let errorMessage = "Error occurred while fetching challenge.";
    if (error.response) {
      const errorData = error.response?.data;
      errorMessage = errorData?.message || errorMessage;
    } else if (error.request) {
      errorMessage = "No response received from the server.";
    } else {
      errorMessage = error.message || errorMessage;
    }
    return [[], errorMessage];
  }
};



export const UpdateChallengeApi = async (jwtToken, bodyObject, id) => {
  try {
    if (!jwtToken) {

      return [[], "Authorization token is missing or invalid"];
    }

    const response = await axios.patch(`${DOMAIN}/api/v1/challenges/${id}`, bodyObject, {
      headers: {
        Authorization: `${jwtToken}`,
      },
    });


    if (response.status === 200) {
      return [response.data, ""];
    } else {
      return [[], "Failed to update challenge. Please try again."];
    }
  } catch (e) {

    let errorMessage = "Error occurred while updating challenge.";
    if (e.response) {
      const errorData = e.response?.data;
      errorMessage = errorData?.message || errorMessage;
    } else if (e.request) {
      errorMessage = "No response received from the server.";
    } else {
      errorMessage = e.message || errorMessage;
    }

    return [[], errorMessage];
  }
};




export const DeleteChallengeApi = async (jwtToken, id) => {
  try {
    if (!jwtToken) {
      return [null, "Authorization token is missing or invalid"];
    }
    const response = await axios.delete(`${DOMAIN}/api/v1/challenges/${id}`, {
      headers: {
        Authorization: `${jwtToken}`,
      },
    });
    return [response.data, null];
  } catch (e) {
    let errorMessage = "Error occurred while deleting challenge.";
    if (e.response) {
      errorMessage = e.response.data?.message || errorMessage;
    } else if (e.request) {
      errorMessage = "No response received from the server.";
    } else {
      errorMessage = e.message || errorMessage;
    }
    return [null, errorMessage];
  }
};
