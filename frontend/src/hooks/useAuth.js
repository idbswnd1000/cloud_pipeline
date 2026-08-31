import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  getMe,
  login as loginApi,
  logout as logoutApi,
  signup as signupApi,
} from "../api/authApi";


export default function useAuth() {
  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);


  const loadUser =
    useCallback(async () => {

      const accessToken =
        localStorage.getItem(
          "access_token"
        );

      if (!accessToken) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const currentUser =
          await getMe();

        setUser(currentUser);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }, []);


  useEffect(() => {
    loadUser();
  }, [loadUser]);


  const login = async (
    email,
    password
  ) => {
    const data =
      await loginApi({
        email,
        password,
      });

    localStorage.setItem(
      "access_token",
      data.access_token
    );

    localStorage.setItem(
      "refresh_token",
      data.refresh_token
    );

    const currentUser =
      await getMe();

    setUser(currentUser);

    return currentUser;
  };


  const signup = async (
    email,
    password,
    name
  ) => {
    return signupApi({
      email,
      password,
      name,
    });
  };


  const logout = async () => {
    const refreshToken =
      localStorage.getItem(
        "refresh_token"
      );

    try {
      if (refreshToken) {
        await logoutApi(
          refreshToken
        );
      }
    } finally {
      localStorage.removeItem(
        "access_token"
      );

      localStorage.removeItem(
        "refresh_token"
      );

      setUser(null);
    }
  };


  return {
    user,
    loading,
    login,
    signup,
    logout,
    loadUser,
  };
}