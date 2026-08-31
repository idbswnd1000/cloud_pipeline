import api from "./axios";


export const signup = async ({
  email,
  password,
  name,
}) => {
  const response = await api.post(
    "/auth/signup",
    {
      email,
      password,
      name,
    }
  );

  return response.data;
};


export const login = async ({
  email,
  password,
}) => {
  const response = await api.post(
    "/auth/login",
    {
      email,
      password,
    }
  );

  return response.data;
};


export const getMe = async () => {
  const response = await api.get(
    "/auth/me"
  );

  return response.data;
};


export const refreshAccessToken =
  async (refreshToken) => {
    const response = await api.post(
      "/auth/refresh",
      {
        refresh_token:
          refreshToken,
      }
    );

    return response.data;
  };


export const logout = async (
  refreshToken
) => {
  await api.post(
    "/auth/logout",
    {
      refresh_token:
        refreshToken,
    }
  );
};