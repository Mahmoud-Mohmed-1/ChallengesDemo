import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { GetActiveAndUpcomingChallengesApi, GetSingleChallengeDetailsApi } from "../Api/Challenges";
import defaultImg from "../assets/undraw_coding_re_iv62.svg";
import {Spin} from "antd";

export default function ChallengeDetails() {
  const [cookies] = useCookies([]);
  const { id } = useParams(); // Get the id from the URL params
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeChallenges, setActiveChallenges] = useState([]);
  const [upcomingChallenges, setUpcomingChallenges] = useState([]);
  const navigate = useNavigate(); // Correctly use useNavigate

  // Fetch active and upcoming challenges
  useEffect(() => {
    const fetchChallenges = async () => {
      if (!cookies.jwt) {
        setError("Authorization token is missing.");
        setLoading(false);
        return;
      }

      const [data, error] = await GetActiveAndUpcomingChallengesApi(cookies.jwt);
      if (data) {
        setActiveChallenges(data.active_challenges);
        setUpcomingChallenges(data.upcoming_challenges);
      } else {
        setError(error);
      }
      setLoading(false);
    };

    fetchChallenges();
  }, [cookies.jwt]);

  const activeChallengesId = activeChallenges.map((challenge) => challenge.id);
  const upcomingChallengesId = upcomingChallenges.map((challenge) => challenge.id);
  const challengeId = parseInt(id);

  useEffect(() => {
    if (activeChallenges.length > 0 || upcomingChallenges.length > 0) {
      if (!activeChallengesId.includes(challengeId) && !upcomingChallengesId.includes(challengeId)) {
        navigate("/");
      }
    }
  }, [activeChallenges, upcomingChallenges, challengeId, navigate]);

  useEffect(() => {
    const getChallenge = async () => {
      if (!cookies.jwt) {
        console.error("Authorization token is missing.");
        setError("Authorization token is missing.");
        setLoading(false);
        return;
      }

      const [data, fetchError] = await GetSingleChallengeDetailsApi(cookies.jwt, id, navigate);
      if (data) {
        setChallenge(data);
      } else if (data?.status === 404) {
        console.error("Challenge not found, redirecting to home.");
        navigate("/");
        return;
      } else {
        console.error(fetchError);
        setError(fetchError || "Failed to fetch challenge details.");
      }
      setLoading(false);
    };

    getChallenge();
  }, [cookies.jwt, id, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!challenge) {
    return <div className="flex justify-center items-center h-screen">
      <Spin size="large"/>
    </div>;
  }

  return (
    <div key={challenge.id} className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 pt-12">
      <img
        src={challenge.image || defaultImg}
        alt={challenge.title}
        className="max-w-96 object-cover rounded-md"
      />
      <h1 className="text-3xl text-black">{challenge.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: challenge.description }} />
      {challenge.start_date > new Date().toISOString() ? (
        <p className="text-sm text-gray-600">Starts: {challenge.start_date}</p>
      ) : (
        <p className="text-sm text-green-600">Started: {challenge.start_date}</p>
      )}
      <p className="text-sm text-red-600">Ends: {challenge.end_date}</p>
    </div>
  );
}
