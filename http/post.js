import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { api_end_point } from "../constants/colors";

const baseUrl = api_end_point + "/api";

let authorization = "";
async function getToken() {
  authorization = await AsyncStorage.getItem("token");
}
getToken();

async function postRequest(mode, payload) {
  let url = `${baseUrl}${mode}`;
  if (!authorization) {
    await getToken();
  }
  const response = await axios.post(url, payload, {
    headers: {
      authorization: authorization,
    },
  });
  return response.data;
}

async function getRequest(mode, payload) {
  let url = `${baseUrl}${mode}`;
  if (!authorization) {
    await getToken();
  }
  const response = await axios.get(url, {
    params: payload,
    headers: {
      authorization: authorization,
    },
  });
  return response.data;
}

export async function createPost(payload) {
  try {
    const response = await postRequest("/posts", payload);
    return {
      message: "Post created successfully",
      success: true,
      data: response,
    };
  } catch (e) {
    return {
      message:
        e?.response?.data?.message ||
        "Something went wrong please try after sometime",
      success: false,
      data: null,
    };
  }
}

export async function fetchFeed(payload) {
  try {
    const response = await getRequest("/posts/timeline", payload);
    return response && response.length ? response : "done";;
  } catch (e) {
    if (e?.response?.data?.status == 401) {
      return "logout";
    }
    return "done";
  }
}

export async function likeHandler(postId, action = "like") {
  try {
    const response = await postRequest(`/likes/${action}/${postId}`, {});
    return response;
  } catch (e) {
    console.log("LIKE", e.response.data);
    return [];
  }
}

export async function getMessagesByPost(payload) {
  try {
    const response = await getRequest("/messages/post", payload);

    return response;
  } catch (e) {
    // console.log("JJ", e.response.data);
    return [];
  }
}

export async function markAsReadChat(chat_id) {
  try {
    const response = await getRequest("/messages/mark-as-read/" + chat_id, {});
    return response;
  } catch (e) {
    // console.log("JJ", e.response.data);
    return [];
  }
}

export async function getChatMessages(payload) {
  try {
    const response = await getRequest("/messages/chat", payload);
    return response;
  } catch (e) {
    // console.log("JJ", e.response.data);
    return [];
  }
}

export async function reportHandler(params) {
  try {
    const response = await postRequest(`/report/post`, params);
    return response;
  } catch (e) {
    console.log("LIKE", e.response.data);
    return [];
  }
}
