import { useState } from "react";

function LoginForm() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    const id = e.currentTarget.id;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  return (
    <div className="bmt">
      <form>
        <label htmlFor="username" className="login-form-label">
          Username
        </label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          className="login-form-input"
        />
        <label htmlFor="password" className="login-form-label">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="login-form-input"
        />
      </form>
    </div>
  );
}

export default LoginForm;
