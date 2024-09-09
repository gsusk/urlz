import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/appSelector";
import MyImage from "./MyImage";
import { Link } from "react-router-dom";
import { getProfileData, updateProfileData } from "../services/user";
import { formError, updateInfo } from "../redux/user/user";
import { errorHandler } from "../utils/errorparser";
import { profileSchema, ProfileType } from "../validation/forms";

function Profile() {
  const profilePic = useAppSelector((state) => state.user.user?.profilePic)!;
  const username = useAppSelector((state) => state.user.user?.username)!;
  const [form, setForm] = useState({
    usernameField: username,
    emailField: "",
    oldEmail: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<{
    username?: string;
    email?: string;
    message?: string;
  }>({});
  const inputRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    if (file) {
      const update = async () => {
        try {
          const _file = new FormData();
          _file.set("profilePic", file);
          const res = await updateProfileData(_file);
          dispatch(
            updateInfo({
              profilePic: res.data.profilePic,
            })
          );
        } catch (error) {
          setError(errorHandler<typeof form>(error as Error));
        }
      };
      update();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const { data, error } = profileSchema.safeParse({
      username: form.usernameField,
      email: form.emailField,
      oldUsername: username,
      oldEmail: form.oldEmail,
    });

    if (error) {
      return setError(error);
    }

    const formData = new FormData();

    for (const [key, value] of Object.entries(data)) {
      formData.set(key, value);
    }

    if (data.username) formData.set("username", data.username);
    if (data.email) formData.set("email", data.email);

    try {
      const { data } = await updateProfileData(formData);

      dispatch(
        updateInfo({
          username: data.username,
        })
      );

      if (data.email) {
        setForm((prev) => {
          return {
            ...prev,
            emailField: data.email!,
            oldEmail: data.email!,
          };
        });
      }
    } catch (err) {
      const error = errorHandler<{ username?: string; email?: string }>(
        err as Error
      );
      setError({
        ...error,
        username: error.errors.username,
        email: error.errors.email,
      });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!isLoading) setIsLoading(true);
      try {
        getProfileData().then((res) => {
          dispatch(
            updateInfo({
              username: res.data.username,
              profilePic: res.data.profilePic,
            })
          );
          setForm((prev) => ({
            ...prev,
            emailField: res.data.email,
            oldEmail: res.data.email,
          }));
        });
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

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
            <div className="left-flex-container">
              <div className="profile-image-container">
                <MyImage src={profilePic} alt="pic" />
              </div>
            </div>
            <div className="right-flex-container t-fix">
              <div className="inner-file-c">
                <input
                  type="file"
                  name="file"
                  className="file-hidden-input"
                  ref={inputRef}
                  accept="image/*"
                  multiple={false}
                  onChange={handleFileChange}
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
          <form role="form row-container" onSubmit={handleSubmit}>
            {isLoading ? (
              <div className="row-container">
                <div className="button-submit-container">loading</div>
              </div>
            ) : (
              <>
                <div className="row-container">
                  <label
                    htmlFor="username_profile"
                    className="left-flex-container"
                  >
                    Username
                  </label>
                  <div className="right-flex-container">
                    <input
                      type="text"
                      name="username"
                      value={form.usernameField}
                      id="username_profile"
                      className="shortener-input"
                      style={{ width: "100%" }}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          usernameField: e.target.value,
                        }))
                      }
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <div>{error.username}</div>
                <div className="row-container">
                  <label
                    htmlFor="email_profile"
                    className="left-flex-container"
                  >
                    Email Address
                  </label>
                  <div className="right-flex-container">
                    <input
                      type="text"
                      name="email"
                      id="email_profile"
                      style={{ width: "100%" }}
                      className="shortener-input"
                      value={form.emailField}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          emailField: e.target.value,
                        }))
                      }
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <div>{error.email}</div>
                <div className="row-container">
                  <div className="button-submit-container">
                    <button
                      type="submit"
                      className="button __vmc"
                      disabled={isLoading}
                    >
                      Update
                    </button>
                  </div>
                  <div>{error.message}</div>
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
