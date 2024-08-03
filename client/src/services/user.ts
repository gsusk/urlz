import client from "./axios";

export type ProfileDataType = {
  username: string;
  email: string;
  profilePic: string;
};

export async function getProfileData() {
  return await client.get<ProfileDataType>("/user/profile", {
    __retry: false,
  });
}

export async function updateProfileData(data: FormData) {
  return await client.put<Partial<ProfileDataType>>("/user/profile", data, {
    __retry: false,
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export async function updatePassword(
  password: string,
  currentPassword: string,
  confirmPassword: string
) {
  return await client.put(
    "/user/password",
    { password, currentPassword, confirmPassword },
    { __retry: false }
  );
}
