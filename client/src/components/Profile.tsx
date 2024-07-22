import { useAppSelector } from "../hooks/appSelector";
import MyImage from "./MyImage";

function Profile() {
  const user = useAppSelector((state) => state.user.user)!;
  const handleUpload = () => {};
  return (
    <div className="profile-container">
      <h4>Profile Management</h4>
      <h2>Update Information</h2>
      <div>
        <div className="mw">
          <form role="form" className="row-container">
            <div className="outer-image-box">
              <div className="profile-image-container">
                <MyImage
                  src={`${user.profilePic}`}
                  alt="pic"
                  fetchPriority="low"
                />
              </div>
            </div>
            <div className="profile-file-container">
              <div className="inner-file-c">
                <input type="file" name="file" className="file-hidden-input" />
                <button
                  className="button __vmc open-file-button"
                  onClick={handleUpload}
                >
                  Select a Photo
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div></div>
    </div>
  );
}

export default Profile;
