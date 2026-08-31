export default function HomePage({
  user,
  logout,
}) {
  const handleLogout =
    async () => {
      await logout();

      window.location.href =
        "/login";
    };


  return (
    <div
      style={{
        padding: "40px",
      }}
    >
      <h1>
        Pipeline
      </h1>

      <p>
        {user.name}님
        로그인 중
      </p>

      <p>
        {user.email}
      </p>

      <button
        onClick={handleLogout}
      >
        로그아웃
      </button>
    </div>
  );
}