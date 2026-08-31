import {
  Navigate,
} from "react-router-dom";

import styled from "styled-components";


export default function ProtectedRoute({
  user,
  loading,
  children,
}) {
  if (loading) {
    return (
      <LoadingContainer>
        <Loader />

        <LoadingText>
          로그인 정보를 확인하고 있습니다.
        </LoadingText>
      </LoadingContainer>
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


const LoadingContainer = styled.div`
  min-height: calc(100vh - 68px);

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  gap: 16px;

  background: #f8f9fb;
`;

const Loader = styled.div`
  width: 30px;
  height: 30px;

  border: 3px solid #e5e7eb;
  border-top-color: #111827;
  border-radius: 50%;

  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.div`
  color: #6b7280;

  font-size: 14px;
`;