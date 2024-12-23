import defultImg from "../assets/undraw_coding_re_iv62.svg";
import { Link, useNavigate } from "react-router-dom";
import { Button, Modal, message } from "antd";
import { useEffect } from "react";
import { useCookies } from "react-cookie";
import {DeleteChallengeApi} from "../Api/Challenges";

const { confirm } = Modal;

export default function DisplayChallenges({ challenges, CurrentUser }) {
    const adminMails = process.env.REACT_APP_ADMINS_LIST.split(",");
    const isAdmin = adminMails.includes(CurrentUser.user.email);
    const navigate = useNavigate();
    const [cookies] = useCookies([]);

    const deleteChallenge = async (id) => {
        if (!cookies.jwt) {
            navigate("/");
            return;
        }

        const [result, error] = await DeleteChallengeApi(cookies.jwt, id);

        if (result) {
            message.success("Challenge deleted successfully.");
            window.location.reload();
            // Handle UI updates here (e.g., refresh challenges or remove from state)
        } else {
            message.error(error || "Failed to delete the challenge.");
        }
    };

    const showDeleteConfirm = (id) => {
        confirm({
            title: "Are you sure you want to delete this challenge?",
            content: "This action cannot be undone.",
            okText: "Yes, Delete",
            okType: "danger",
            cancelText: "Cancel",
            onOk() {
                deleteChallenge(id);
            },
            onCancel() {
                message.info("Delete action canceled.");
            },
        });
    };

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-3">
          {challenges.map((challenge, index) => (
            <div
              key={index}
              className="h-fit bg-white shadow-md rounded-md p-4 hover:cursor-pointer"
            >
                <Link to={`/challenge/${challenge.id}`} className="hover:cursor-pointer">
                    <div>
                        <img
                          src={challenge.image || defultImg}
                          alt={challenge.title}
                          className="w-full object-cover rounded-md"
                        />
                        <h3 className="text-xl font-bold mb-1 text-ellipsis line-clamp-1">
                            {challenge.title}
                        </h3>
                        <div
                          className="text-ellipsis line-clamp-1"
                          dangerouslySetInnerHTML={{ __html: challenge.description }}
                        />
                        {new Date(challenge.start_date).setHours(0, 0, 0, 0) >
                        new Date().setHours(0, 0, 0, 0) ? (
                          <p className="text-sm text-gray-600">
                              Starts: {challenge.start_date}
                          </p>
                        ) : (
                          <p className="text-sm text-green-600">
                              Started: {challenge.start_date}
                          </p>
                        )}
                        <p className="text-sm text-red-600">Ends: {challenge.end_date}</p>
                    </div>
                </Link>
                {isAdmin && (
                  <div className="flex gap-3">
                      <Button
                        type="primary"
                        className="my-4"
                        onClick={() => {
                            navigate("/update-challenge/" + challenge.id);
                        }}
                      >
                          Edit
                      </Button>
                      <Button
                        type="primary"
                        danger
                        className="my-4"
                        onClick={() => {
                            showDeleteConfirm(challenge.id);
                        }}
                      >
                          Delete
                      </Button>
                  </div>
                )}
            </div>
          ))}
      </div>
    );
}
