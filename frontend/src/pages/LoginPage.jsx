import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";
import styled from "styled-components";


export default function LoginPage({
  login,
}) {
  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  const handleSubmit =
    async (event) => {
      event.preventDefault();

      setError("");
      setLoading(true);

      try {
        await login(
          email,
          password,
        );

        navigate("/");
      } catch (error) {
        setError(
          error.response?.data?.detail ||
            "로그인에 실패했습니다.",
        );
      } finally {
        setLoading(false);
      }
    };


  return (
    <Page>
      <Card>
        <HeaderArea>
          <Logo>P</Logo>

          <Title>다시 만나서 반가워요</Title>

          <Description>
            Pipeline 계정으로 로그인하세요.
          </Description>
        </HeaderArea>

        <Form onSubmit={handleSubmit}>
          <Field>
            <Label>이메일</Label>

            <Input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(event) =>
                setEmail(
                  event.target.value,
                )
              }
              required
            />
          </Field>

          <Field>
            <Label>비밀번호</Label>

            <Input
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value,
                )
              }
              required
            />
          </Field>

          {error && (
            <ErrorMessage>
              {error}
            </ErrorMessage>
          )}

          <SubmitButton
            type="submit"
            disabled={loading}
          >
            {loading
              ? "로그인 중..."
              : "로그인"}
          </SubmitButton>
        </Form>

        <BottomText>
          아직 계정이 없나요?
          {" "}
          <SignupLink to="/signup">
            회원가입
          </SignupLink>
        </BottomText>
      </Card>
    </Page>
  );
}


const Page = styled.div`
  min-height: calc(100vh - 68px);

  display: flex;
  justify-content: center;
  align-items: center;

  padding: 40px 20px;

  background: #f8f9fb;

  box-sizing: border-box;
`;

const Card = styled.div`
  width: 100%;
  max-width: 420px;

  padding: 40px;

  background: #ffffff;

  border: 1px solid #e8eaed;
  border-radius: 18px;

  box-shadow:
    0 8px 30px rgba(17, 24, 39, 0.06);

  box-sizing: border-box;
`;

const HeaderArea = styled.div`
  text-align: center;

  margin-bottom: 32px;
`;

const Logo = styled.div`
  width: 46px;
  height: 46px;

  margin: 0 auto 20px;

  display: flex;
  justify-content: center;
  align-items: center;

  border-radius: 12px;

  background: #111827;
  color: white;

  font-size: 21px;
  font-weight: 700;
`;

const Title = styled.h1`
  margin: 0;

  color: #111827;

  font-size: 26px;
  font-weight: 700;
`;

const Description = styled.p`
  margin: 10px 0 0;

  color: #6b7280;

  font-size: 14px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;

  gap: 18px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;

  gap: 8px;
`;

const Label = styled.label`
  color: #374151;

  font-size: 14px;
  font-weight: 600;
`;

const Input = styled.input`
  height: 48px;

  padding: 0 14px;

  border: 1px solid #dfe3e8;
  border-radius: 10px;

  outline: none;

  color: #111827;

  font-size: 15px;

  transition: 0.2s;

  box-sizing: border-box;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    border-color: #111827;

    box-shadow:
      0 0 0 3px rgba(17, 24, 39, 0.07);
  }
`;

const SubmitButton = styled.button`
  height: 50px;

  margin-top: 4px;

  border: none;
  border-radius: 10px;

  background: #111827;
  color: white;

  font-size: 15px;
  font-weight: 600;

  cursor: pointer;

  transition: 0.2s;

  &:hover:not(:disabled) {
    background: #1f2937;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const ErrorMessage = styled.div`
  padding: 11px 13px;

  border-radius: 8px;

  background: #fef2f2;
  color: #dc2626;

  font-size: 13px;
`;

const BottomText = styled.p`
  margin: 26px 0 0;

  text-align: center;

  color: #6b7280;

  font-size: 14px;
`;

const SignupLink = styled(Link)`
  color: #111827;

  font-weight: 600;

  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;