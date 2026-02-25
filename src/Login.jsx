import React, { useState } from "react";
import { useNavigate } from "react-router";

export default function Login() {
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState(false);

  function handlelogin(e) {
    e.preventDefault();
    const userEmail = e.target.email.value;
    const userPassword = e.target.password.value;

    if (userEmail === "mirm87327" && userPassword === "09059200825") {
      navigate("/customers", { replace: true });
    } else {
      setLoginError(true);
      setTimeout(() => setLoginError(false), 3000);
    }
  }

  return (
    <div className="flex flex-col justify-center h-screen">
      <h1 className="text-black font-bold text-3xl flex justify-center dark:text-white">
        ورود به برنامه
      </h1>

      <div className="flex justify-center mt-8 px-4">
        <form onSubmit={handlelogin} className="w-full max-w-lg">
          <div className="bg-white rounded p-6 flex flex-col gap-4 shadow-md">
            <div className="flex flex-col gap-2">
              <h2 className="font-medium text-xl text-right">ایمیل</h2>
              <input
                type="text"
                placeholder=".ایمیل خود را وارد کنید"
                name="email"
                className="w-full py-3 border-2 border-gray-300 text-right p-2 rounded"
              />
            </div>

            <div className="flex flex-col gap-2">
              <h2 className="font-medium text-xl text-right">رمز</h2>
              <input
                type="password"
                placeholder=".رمز خود را وارد کنید"
                name="password"
                className="w-full py-3 border-2 border-gray-300 text-right p-2 rounded"
              />
            </div>

            <span
              className={`text-red-600 h-4 flex justify-center transition-opacity duration-300 ${loginError ? "opacity-100" : "opacity-0"}`}
            >
              .ایمیل یا رمز عبور اشتباه است
            </span>

            <div className="flex justify-center pt-4">
              <input
                type="submit"
                value="ورود"
                className="bg-blue-400 text-white w-full h-12 text-xl rounded hover:bg-blue-500 duration-300 cursor-pointer"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
