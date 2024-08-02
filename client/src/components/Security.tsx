function Security() {
  return (
    <div className="out-sec">
      <div className="profile-container panel panel-border">
        <h4>Security</h4>
        <h2>Update Password</h2>
        <div className="uw">
          <div className="mw">
            <form action="form row-container">
              <div className="inner-sec-form">
                <div className="row-container">
                  <label
                    htmlFor="currentPassword"
                    className="security-label-column"
                  >
                    Current Password
                  </label>
                  <div className="security-input-column">
                    <input
                      type="password"
                      name="currentPassword"
                      id="currentPassword"
                      className="shortener-input relative-input"
                    />
                  </div>
                </div>
                <div className="row-container">
                  <label htmlFor="password" className="security-label-column">
                    Password
                  </label>
                  <div className="security-input-column">
                    <input
                      type="password"
                      name="password"
                      id="password"
                      className="shortener-input relative-input"
                    />
                  </div>
                </div>
                <div className="row-container">
                  <label
                    htmlFor="confirmPassword"
                    className="security-label-column"
                  >
                    Confirm Password
                  </label>
                  <div className="security-input-column ">
                    <input
                      type="password"
                      name="confirmPassword"
                      id="confirmPassword"
                      className="shortener-input relative-input"
                    />
                  </div>
                </div>
                <div className="row-container">
                  <div className="sec-update-button">
                    <button type="submit" className="button __vmc">
                      Update
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="profile-container panel">
        <div>
          <h4>Additional Security</h4>
          <h2>Two-Factor Authentication</h2>
          <p>
            Add an extra layer of security to your account by enabling
            Two-Factor Authentication.{" "}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Security;
