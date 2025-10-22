const Navbar = ({ user, logout }) => {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <h3>Teacher Review System</h3>
      </div>
      <div className="nav-items">
        <span>Welcome, {user.name}</span>
        <span className="role-badge">{user.role}</span>
        <button onClick={logout} className="logout-btn">Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;