import { Link, useNavigate } from "react-router-dom";

export default function Header({
  user,
  logout,
}) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header style={styles.header}>
      <Link
        to="/"
        style={styles.logo}
      >
        Pipeline
      </Link>

      <div style={styles.right}>
        {user ? (
          <>
            <span>
              {user.name}님
            </span>

            <button
              onClick={handleLogout}
              style={styles.logoutButton}
            >
              로그아웃
            </button>
          </>
        ) : (
          <Link
            to="/login"
            style={styles.loginButton}
          >
            로그인
          </Link>
        )}
      </div>
    </header>
  );
}


const styles = {
  header: {
    height: "64px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 32px",
    borderBottom: "1px solid #e5e5e5",
    backgroundColor: "white",
  },

  logo: {
    fontSize: "20px",
    fontWeight: "bold",
    textDecoration: "none",
    color: "#111",
  },

  right: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },

  loginButton: {
    textDecoration: "none",
    color: "#111",
  },

  logoutButton: {
    padding: "8px 14px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "white",
    cursor: "pointer",
  },
};