import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/appSelector";
import MyImage from "./MyImage";
import { Link } from "react-router-dom";
import { getProfileData, updateProfileData } from "../services/user";
import { updateInfo } from "../redux/user/user";

function Profile() {
  const profilePic = useAppSelector((state) => state.user.user?.profilePic)!;
  const username = useAppSelector((state) => state.user.user?.username)!;
  const [usernameField, setUsernameField] = useState(username);
  const [emailField, setEmailField] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [_file, setFile] = useState<File | undefined>();
  const inputRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  console.log(profilePic, emailField);
  const handleClick = () => {
    inputRef.current?.click();
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!isLoading) setIsLoading(true);
      try {
        const res = await getProfileData();
        console.log(res.data, profilePic, "dataaaaaaaaaaaaa");

        console.log("dispatchhh");
        dispatch(
          updateInfo({
            username: res.data.username,
            profilePic: res.data.profilePic,
          })
        );
        setUsernameField(res.data.username);
        setEmailField(res.data.email);

        console.log("no");
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    if (_file && inputRef.current && inputRef.current.files?.[0]) {
      const update = async () => {
        try {
          const file = new FormData();
          file.set("file", _file);
          const res = await updateProfileData(file);
          dispatch(
            updateInfo({
              profilePic: res.data.profilePic,
            })
          );
        } catch (error) {
          console.log(error);
        } finally {
          //setFile(undefined);
        }
      };
      update();
    }
  }, [_file]);

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
                <MyImage src={profilePic} alt="pic" />
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
            {isLoading ? (
              <div className="row-container">
                <div className="button-submit-container">loading</div>
              </div>
            ) : (
              <>
                {" "}
                <div className="row-container">
                  <label htmlFor="username_profile" className="outer-image-box">
                    Username
                  </label>
                  <div className="profile-file-container">
                    <input
                      type="text"
                      name="username"
                      value={usernameField}
                      id="username_profile"
                      className="shortener-input"
                      style={{ width: "100%" }}
                      onChange={(e) => setUsernameField(e.target.value)}
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
                      value={emailField}
                      onChange={(e) => setEmailField(e.target.value)}
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
              </>
            )}
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
