import client from "./axios";

export async function getProfileData() {
  await client.get("/user/profile", { __retry: false });
}
