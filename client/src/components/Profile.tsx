import { useRef, useState } from "react";
import { useAppSelector } from "../hooks/appSelector";
import MyImage from "./MyImage";
import { Link } from "react-router-dom";

function Profile() {
  const profilePic = useAppSelector((state) => state.user.user?.profilePic)!;
  const [file, setFile] = useState<File>();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="profile-container">
      <h4>Profile Management</h4>
      <h2>Update Information</h2>
      <div>
        <div className="mw">
          <form
            role="form"
            className="row-container"
            onChange={() => console.log("object")}
          >
            <div className="outer-image-box">
              <div className="profile-image-container">
                <MyImage src={`${profilePic}`} alt="pic" fetchPriority="low" />
              </div>
            </div>
            <div className="profile-file-container">
              <div className="inner-file-c">
                <input
                  type="file"
                  name="file"
                  className="file-hidden-input"
                  ref={inputRef}
                  accept="image/*"
                  multiple={false}
                  onChange={(e) => setFile(e.target?.files?.[0])}
                  onError={() => console.log("error")}
                />
                <button
                  type="button"
                  className="button __vmc open-file-button"
                  role="upload image"
                  onClick={handleClick}
                >
                  Select a Photo
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="mw">
        <div className="uw">
          <h3>Contact Information</h3>
          <form role="form row-container">
            <div className="row-container">
              <label htmlFor="username_profile" className="outer-image-box">
                Username
              </label>
              <div className="profile-file-container">
                <input
                  type="text"
                  name="username"
                  id="username_profile"
                  className="shortener-input"
                  style={{ width: "100%" }}
                />
              </div>
            </div>
            <div className="row-container">
              <label htmlFor="email_profile" className="outer-image-box">
                Email Address
              </label>
              <div className="profile-file-container">
                <input
                  type="text"
                  name="email"
                  id="email_profile"
                  style={{ width: "100%" }}
                  className="shortener-input"
                />
              </div>
            </div>
            <div className="row-container">
              <div className="button-submit-container">
                <button
                  type="submit"
                  name="email"
                  id="email_profile"
                  className="button __vmc"
                >
                  Update
                </button>
              </div>
            </div>
            <Link to="delete" className="delete-account-button button __vsc">
              Delete Account
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;
