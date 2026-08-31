import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";

import useAuth from "./hooks/useAuth";

import ImageRagPage from "./pages/ImageRagPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";


function App() {
  const {
    user,
    loading,
    login,
    signup,
    logout,
  } = useAuth();

  return (
    <>
      <Header
        user={user}
        logout={logout}
      />

      <Routes>
        <Route
          path="/login"
          element={
            user ? (
              <Navigate
                to="/"
                replace
              />
            ) : (
              <LoginPage
                login={login}
              />
            )
          }
        />

        <Route
          path="/signup"
          element={
            user ? (
              <Navigate
                to="/"
                replace
              />
            ) : (
              <SignupPage
                signup={signup}
              />
            )
          }
        />

        <Route
          path="/"
          element={
            <ProtectedRoute
              user={user}
              loading={loading}
            >
              <ImageRagPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />
      </Routes>
    </>
  );
}

export default App;