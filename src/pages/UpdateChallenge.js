import { Button, DatePicker, notification } from "antd";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import {UpdateChallengeApi, GetChallengeByIdApi, GetSingleChallengeDetailsApi} from "../Api/Challenges"; // Ensure `GetChallengeByIdApi` is implemented
import { useCookies } from "react-cookie";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import EditorToolbar, { formats, modules } from "../components/EditorToolbar";
import { useNavigate, useParams } from "react-router-dom";

const { RangePicker } = DatePicker;

export default function UpdateChallenge() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dateRange, setDateRange] = useState([null, null]);
  const [error, setError] = useState({ description: false, date: false });
  const [cookies] = useCookies([]);
  const today = dayjs();
  const navigate = useNavigate();
  const { id } = useParams(); // Get challenge ID from URL params

  useEffect(() => {
    if (!cookies.jwt) {
      navigate("/"); // Redirect if no JWT
    }
  }, [cookies.jwt, navigate]);

  // Fetch the existing challenge data
  useEffect(() => {
    async function fetchChallenge() {
      try {
        const [response, error] = await GetSingleChallengeDetailsApi(cookies.jwt, id);
        if (response) {
          const { title, description, start_date, end_date } = response;
          setTitle(title);
          setDescription(description);
          setDateRange([dayjs(start_date), dayjs(end_date)]);
        } else {
          notification.error({
            message: "Error Fetching Challenge",
            description: error,
          });
        }
      } catch (err) {
        notification.error({
          message: "Unexpected Error",
          description: `An error occurred while fetching challenge data: ${err.message}`,
        });
      }
    }

    fetchChallenge();
  }, [cookies.jwt, id]);

  const disablePastDates = (current) => current && current.isBefore(today, "day");

  const validateInputs = () => {
    let valid = true;

    if (!description.trim()) {
      setError((prev) => ({ ...prev, description: true }));
      notification.error({
        message: "Invalid Description",
        description: "Please provide a description.",
      });
      valid = false;
    }

    if (!dateRange[0] || !dateRange[1]) {
      setError((prev) => ({ ...prev, date: true }));
      notification.error({
        message: "Invalid Date Range",
        description: "Please select both start and end dates.",
      });
      valid = false;
    } else if (dateRange[0].isAfter(dateRange[1])) {
      setError((prev) => ({ ...prev, date: true }));
      notification.error({
        message: "Invalid Date Range",
        description: "The start date cannot be after the end date.",
      });
      valid = false;
    }

    return valid;
  };

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validateInputs()) return;

    const challengeData = {
      title,
      description,
      start_date: dateRange[0].format("YYYY-MM-DD"),
      end_date: dateRange[1].format("YYYY-MM-DD"),
    };

    try {
      const [response, error] = await UpdateChallengeApi(cookies.jwt, challengeData, id);

      if (response) {
        notification.success({
          message: "Challenge Updated Successfully",
          description: `Title: ${response.data.title}, Start Date: ${response.data.start_date}, End Date: ${response.data.end_date}`,
        });

        // Reset form state
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        notification.error({
          message: "Error Updating Challenge",
          description: error,
        });
      }
    } catch (err) {
      notification.error({
        message: "Unexpected Error",
        description: `An unexpected error occurred: ${err.message}`,
      });
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl">Update Challenge</h1>
      <form onSubmit={handleSubmit} className="mt-10 flex gap-4 flex-col">
        {/* Title Input */}
        <input
          type="text"
          value={title}
          placeholder="Title"
          onChange={(e) => setTitle(e.target.value)}
          required
          className="py-2 border border-gray-600 rounded px-3 w-full"
        />

        {/* Description Input */}
        <div className="text-editor">
          <EditorToolbar />
          <ReactQuill
            theme="snow"
            value={description}
            onChange={(value) => {
              setDescription(value);
              if (error.description && value.trim()) {
                setError((prev) => ({ ...prev, description: false }));
              }
            }}
            placeholder="Write something awesome..."
            modules={modules}
            formats={formats}
            className={error.description ? "border border-red-600 rounded" : ""}
          />
          {error.description && <p className="text-red-600 mt-1">This field is required.</p>}
        </div>

        {/* Date Range Picker */}
        <RangePicker
          value={dateRange}
          onChange={(dates) => {
            setDateRange(dates);
            if (error.date && dates[0] && dates[1] && dates[0].isBefore(dates[1])) {
              setError((prev) => ({ ...prev, date: false }));
            }
          }}
          className={`w-full ${error.date ? "border border-red-600 rounded" : ""}`}
          disabledDate={disablePastDates}
        />
        {error.date && <p className="text-red-600 mt-1">Please select a valid date range.</p>}

        <Button type="primary" htmlType="submit">
          Update Challenge
        </Button>
      </form>
    </div>
  );
}
