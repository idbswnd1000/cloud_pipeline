import {
  Navigate,
} from "react-router-dom";


export default function ProtectedRoute({
  user,
  loading,
  children,
}) {
  if (loading) {
    return (
      <div>
        로그인 확인 중...
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return children;
}