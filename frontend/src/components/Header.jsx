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
      <div style={styles.inner}>
        <Link
          to="/"
          style={styles.logo}
        >
          <div style={styles.logoIcon}>
            P
          </div>

          <span>Pipeline</span>
        </Link>

        <div style={styles.right}>
          {user ? (
            <>
              <div style={styles.user}>
                <div style={styles.avatar}>
                  {user.name?.charAt(0).toUpperCase()}
                </div>

                <span style={styles.userName}>
                  {user.name}
                </span>
              </div>

              <div style={styles.divider} />

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
      </div>
    </header>
  );
}


const styles = {
  header: {
    position: "sticky",
    top: 0,
    zIndex: 100,

    width: "100%",
    height: "68px",

    display: "flex",
    alignItems: "center",

    backgroundColor: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(12px)",

    borderBottom: "1px solid #eaecef",

    boxSizing: "border-box",
  },

  inner: {
    width: "100%",
    maxWidth: "1200px",
    height: "100%",

    margin: "0 auto",
    padding: "0 32px",

    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",

    boxSizing: "border-box",
  },

  logo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",

    color: "#111827",

    fontSize: "20px",
    fontWeight: "700",
    letterSpacing: "-0.5px",

    textDecoration: "none",
  },

  logoIcon: {
    width: "34px",
    height: "34px",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    borderRadius: "9px",

    backgroundColor: "#111827",
    color: "#ffffff",

    fontSize: "17px",
    fontWeight: "700",
  },

  right: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },

  user: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
  },

  avatar: {
    width: "32px",
    height: "32px",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    borderRadius: "50%",

    backgroundColor: "#f1f3f5",
    color: "#374151",

    fontSize: "14px",
    fontWeight: "600",
  },

  userName: {
    color: "#374151",

    fontSize: "14px",
    fontWeight: "500",
  },

  divider: {
    width: "1px",
    height: "20px",

    backgroundColor: "#e5e7eb",
  },

  loginButton: {
    padding: "9px 16px",

    borderRadius: "8px",

    backgroundColor: "#111827",
    color: "#ffffff",

    fontSize: "14px",
    fontWeight: "600",

    textDecoration: "none",
  },

  logoutButton: {
    padding: "8px 13px",

    border: "1px solid #e5e7eb",
    borderRadius: "8px",

    backgroundColor: "#ffffff",
    color: "#4b5563",

    fontSize: "13px",
    fontWeight: "500",

    cursor: "pointer",
  },
};