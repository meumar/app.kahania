import axios from "axios";
import { api_end_point } from "../constants/colors";

const baseUrl = api_end_point + "/api/users";

export async function authenticate(mode, email, password, name) {
  let url = `${baseUrl}${mode}`;
  const response = await axios.post(url, {
    email,
    password,
    name,
  });
  return response.data;
}
export async function verify(mode, email, code, type, password) {
  let url = `${baseUrl}${mode}`;
  const response = await axios.post(url, {
    email,
    code,
    password,
    type
  });
  return response.data;
}

export async function createUser(email, password, name) {
  try {
    const response = await authenticate("/register", email, password, name);
    return {
      message: "Register successfully",
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

export async function resendCode(email, type) {
  try {
    const response = await verify("/forgot-password/sent-otp", email, '', type, '');
    return {
      message: "sent successfully",
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

export async function verifyUser(mode, email, code, type, password) {
  try {
    const response = await verify(mode, email, code, type, password);
    return {
      message: "verity successfully",
      success: true,
      data: response,
    };
  } catch (e) {
    return {
      message:
        e?.response?.data?.message ||
        e?.response?.data?.errors ||
        "Something went wrong please try after sometime",
      success: false,
      data: null,
    };
  }
}

export async function login(email, password) {
  try {
    const response = await authenticate("/login", email, password);
    return {
      message: "Login successfully",
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
