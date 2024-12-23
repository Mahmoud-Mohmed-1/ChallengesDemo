import { Button, Alert, Spin } from "antd";
import { useCookies } from "react-cookie";
import { logoutApi } from "../Api/authentication";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Header() {
    const [cookies, setCookies, removeCookie] = useCookies([]);
    const [jwt, setJwt] = useState(cookies.jwt);
    const navigate = useNavigate();
    const [alertMessage, setAlertMessage] = useState(null);
    const [alertType, setAlertType] = useState(null);
    const [user, setUser] = useState(null); // To store user data
    const [loading, setLoading] = useState(true); // To track the loading state

    useEffect(() => {
        // Fetch user info from sessionStorage
        const fetchUser = async () => {
            const storedUser = window.sessionStorage.getItem("user");
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
            setLoading(false); // Stop loading once the data is retrieved
        };
        fetchUser();
    }, []);

    const adminMails = process.env.REACT_APP_ADMINS_LIST
      ? process.env.REACT_APP_ADMINS_LIST.split(",")
      : [];
    const isAdmin = user && adminMails.includes(user.user.email); // Ensure user exists before checking
    const handleLogout = async () => {
        if (!jwt) {
            setAlertMessage("You are not logged in.");
            setAlertType("info");
            return;
        }

        const [result, error] = await logoutApi(jwt);

        removeCookie("jwt");
        window.sessionStorage.clear();
        setJwt(null);

        if (result) {
            setAlertMessage("Logout successful! Redirecting to login...");
            setAlertType("success");
        } else {
            setAlertMessage(error || "Logout failed. Redirecting to login...");
            setAlertType("error");
        }

        setTimeout(() => {
            navigate("/login");
        }, 2000);
    };

    if (loading) {
        // Show loading spinner while fetching user data
        return (
          <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                flexDirection: "column",
            }}
          >
              <Spin size="large" />
              <p style={{ marginTop: "16px", fontSize: "16px", color: "#555" }}>
                  Fetching user data...
              </p>
          </div>
        );
    }

    return (
      <div className={"bg-white shadow"}>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
              <div className={"flex justify-between items-center"}>
                  <p className={"font-bold text-2xl"}>Code Challenges</p>
                  <div>
                      {isAdmin && (
                        <Button
                          type={"primary"}
                          className={"my-4 mx-2"}
                          onClick={() => {
                              navigate("/add-challenge"); // Redirect to the add challenge page
                          }}
                        >
                            Add Challenge
                        </Button>
                      )}
                      {jwt ? (
                        <Button
                          danger
                          type={"primary"}
                          className={"my-4"}
                          onClick={handleLogout}
                        >
                            Logout
                        </Button>
                      ) : (
                        <Button
                          type={"primary"}
                          className={"my-4"}
                          onClick={() => {
                              navigate("/login"); // Redirect to the login page
                          }}
                        >
                            Login
                        </Button>
                      )}

                  </div>
              </div>

              {alertMessage && (
                <Alert
                  message={alertMessage}
                  type={alertType} // Success or error
                  showIcon
                  className={"mb-4"}
                  onClose={() => setAlertMessage(null)} // Dismiss the alert
                  closable
                />
              )}
          </div>
      </div>
    );
}
