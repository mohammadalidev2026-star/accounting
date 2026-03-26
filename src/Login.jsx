import { useState } from "react";
import { useNavigate } from "react-router";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { Eye, EyeOff } from "lucide-react";

const ADMIN_LOGIN = gql`
  mutation AdminLogin($email: String!, $password: String!) {
    adminLogin(input: { email: $email, password: $password }) {
      accessToken
      refreshToken
      adminInfo {
        _id
        firstName
        lastName
        email
        profileImage
        role
        isEmailVerified
        lastLogin
        createdAt
        updatedAt
      }
    }
  }
`;

export default function Login() {
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [adminLogin, { loading }] = useMutation(ADMIN_LOGIN);

  async function handlelogin(e) {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const { data } = await adminLogin({
        variables: { email, password },
      });

      localStorage.setItem("accessToken", data.adminLogin.accessToken);
      localStorage.setItem("refreshToken", data.adminLogin.refreshToken);

      navigate("/customers", { replace: true });
    } catch (error) {
      setLoginError(error.message);
      setTimeout(() => setLoginError(""), 3000);
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
                type="email"
                required
                placeholder=".ایمیل خود را وارد کنید"
                name="email"
                className="w-full py-3 border-2 border-gray-300 text-right p-2 rounded"
              />
            </div>

            <div className="flex flex-col gap-2">
              <h2 className="font-medium text-xl text-right">رمز</h2>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder=".رمز خود را وارد کنید"
                  name="password"
                  className="w-full py-3 border-2 border-gray-300 text-right p-2 rounded"
                />

                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </span>
              </div>
            </div>

            <span
              className={`text-red-600 flex justify-center transition-opacity duration-300 ${
                loginError ? "opacity-100" : "opacity-0"
              }`}
            >
              {loginError}
            </span>

            <div className="flex justify-center pt-4">
              <input
                type="submit"
                value={loading ? "...در حال ورود" : "ورود"}
                disabled={loading}
                className="bg-blue-400 text-white w-full h-12 text-xl rounded hover:bg-blue-500 duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
