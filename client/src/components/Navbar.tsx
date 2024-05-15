function Navbar() {
  return (
    <div className="nav-container">
      <div className="img-c-fit">
        <img src="/logosm.png" alt="logosmall" />
      </div>
      <div className="grow-end-c">
        <button className="button __vsc">Sign Up</button>
        <button className="button __vsc">Sign In</button>
      </div>
    </div>
  );
}

export default Navbar;
