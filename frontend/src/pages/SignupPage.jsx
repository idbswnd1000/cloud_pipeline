import {
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";


export default function SignupPage({
  signup,
}) {
  const navigate =
    useNavigate();

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const [
    error,
    setError,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(false);


  const handleSubmit =
    async (event) => {

      event.preventDefault();

      setError("");
      setLoading(true);

      try {
        await signup(
          email,
          password,
          name
        );

        navigate("/login");
      } catch (error) {
        setError(
          error.response?.data
            ?.detail ||
            "회원가입에 실패했습니다."
        );
      } finally {
        setLoading(false);
      }
    };


  return (
    <div style={styles.container}>
      <form
        onSubmit={handleSubmit}
        style={styles.form}
      >
        <h1>
          회원가입
        </h1>

        <input
          type="text"
          placeholder="이름"
          value={name}
          onChange={(event) =>
            setName(
              event.target.value
            )
          }
          required
          style={styles.input}
        />

        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(event) =>
            setEmail(
              event.target.value
            )
          }
          required
          style={styles.input}
        />

        <input
          type="password"
          placeholder="비밀번호 (8자 이상)"
          value={password}
          onChange={(event) =>
            setPassword(
              event.target.value
            )
          }
          minLength={8}
          required
          style={styles.input}
        />

        {error && (
          <p style={styles.error}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={styles.button}
        >
          {loading
            ? "가입 중..."
            : "회원가입"}
        </button>

        <p>
          이미 계정이 있나요?{" "}
          <Link to="/login">
            로그인
          </Link>
        </p>
      </form>
    </div>
  );
}


const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  form: {
    width: "360px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    padding: "32px",
    border: "1px solid #ddd",
    borderRadius: "12px",
  },

  input: {
    padding: "12px",
    fontSize: "16px",
  },

  button: {
    padding: "12px",
    fontSize: "16px",
    cursor: "pointer",
  },

  error: {
    color: "red",
  },
};