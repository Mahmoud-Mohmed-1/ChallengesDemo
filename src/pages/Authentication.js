import {useEffect, useState} from "react";
import { Alert, Button } from "antd";
import { ValidateEmail, ValidatePassword } from "../utilies/validations";
import {Link, useNavigate} from "react-router-dom";
import {loginApi, registerApi} from "../Api/authentication";
import {useCookies} from "react-cookie";

export const PageType = Object.freeze({
    LOGIN: 0,
    REGISTER: 1,
});

export default function Authentication({ pageType = PageType.LOGIN }) {
    const navigate=useNavigate();
    const [cookies,setCookies]=useCookies([])

    useEffect(() => {
        if(cookies.jwt){
            navigate('/')
        }
    }, []);

    const initialErrorsState = {
        email: "",
        password: "",
        api: "",
    };
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState(initialErrorsState);
    const [isLoading, setIsLoading] = useState(false);
    const [apiMessage, setApiMessage] = useState("");

    const handleEmailChange = (e) => setEmail(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);

    const handleSubmit = async (e) => {
        e.preventDefault();
        let newErrors = {};
        if (!ValidateEmail(email)) newErrors.email = "Invalid Email Address";
        if (!ValidatePassword(password)) newErrors.password = "At least 6 characters required";
        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) return;

        setIsLoading(true);
        setApiMessage("");

        try {
            if (pageType === PageType.REGISTER) {
                const [response, error] = await registerApi({
                    user: { email, password },
                });
                if (response) {

                    setApiMessage("Registration successful! Redirecting to the Login page...");
                    setErrors(initialErrorsState); // Reset errors
                    setTimeout(() => {
                        navigate("/login");
                    }, 2000);
                } else {
                    setErrors({ ...errors, api: error || "Registration failed." });
                }
            } else {
                const [response,token,error]=await loginApi({
                    user: { email, password },
                });

                if (response) {
                    setCookies('jwt', token)
                    setApiMessage("Login successful! Redirecting to the home page...");
                    setErrors(initialErrorsState);
                    setTimeout(() => {
                        navigate("/");
                    }, 2000);
                }
                else {
                    setErrors({ ...errors, api: error || "Login failed." });
                }
            }
        } catch (error) {
            setErrors({ ...errors, api: "Something went wrong! Try again later." });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={"bg-white"}>
            <div className={"mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 py-12"}>
                <h3 className={"text-2xl font-bold"}>
                    {pageType === PageType.LOGIN ? "Login" : "Register"}
                </h3>

                {pageType === PageType.LOGIN ? (
                    <p className={"mt-4"}>
                        Not a User?{" "}
                        <Link to={"/register"} className={"underline"}>
                            Register
                        </Link>
                    </p>
                ) : (
                    <p className={"mt-4"}>
                        Already a User?{" "}
                        <Link to={"/login"} className={"underline"}>
                            Login
                        </Link>
                    </p>
                )}
                {errors.api && (
                    <Alert
                        message={errors.api}
                        type="error"
                        showIcon
                        className={"mb-4"}
                    />
                )}
                {apiMessage && (
                    <Alert
                        message={apiMessage}
                        type="success"
                        showIcon
                        className={"mb-4"}
                    />
                )}

                <form
                    className={"mt-10 flex gap-4 flex-col max-w-96"}
                    onSubmit={handleSubmit}
                >
                    <div>
                        <input
                            name={"email"}
                            value={email}
                            type={"email"}
                            placeholder={"Enter Your Email"}
                            className={
                                "py-2 border border-gray-600 rounded px-3 w-full"
                            }
                            onChange={handleEmailChange}
                        />
                        {errors.email && (
                            <p className={"text-sm text-medium text-red-500"}>
                                {errors.email}
                            </p>
                        )}
                    </div>
                    <div>
                        <input
                            name={"password"}
                            value={password}
                            type={"password"}
                            placeholder={"Enter Your Password"}
                            className={
                                "py-2 border border-gray-600 rounded px-3 w-full"
                            }
                            onChange={handlePasswordChange}
                        />
                        {errors.password && (
                            <p className={"text-sm text-medium text-red-500"}>
                                {errors.password}
                            </p>
                        )}
                    </div>
                    <Button
                        type={"primary"}
                        htmlType={"submit"}
                        loading={isLoading}
                    >
                        {pageType === PageType.LOGIN ? "Login" : "Register"}
                    </Button>
                </form>
            </div>
        </div>
    );
}

