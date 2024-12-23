import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { GetSingleChallengeDetailsApi } from "../Api/Challenges";
import defaultImg from "../assets/undraw_coding_re_iv62.svg";
export default function ChallengeDetails() {
  const [cookies] = useCookies([]);
  const { id } = useParams();
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getChallenge = async () => {
      if (!cookies.jwt) {
        console.error("Authorization token is missing.");
        setError("Authorization token is missing.");
        setLoading(false);
        return;
      }

      const [data, error] = await GetSingleChallengeDetailsApi(cookies.jwt, id);
      if (data) {
        setChallenge(data);
      } else {
        console.error(error);
        setError(error || "Failed to fetch challenge details.");
      }
      setLoading(false);
    };

    getChallenge();
  }, [cookies.jwt, id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!challenge) {
    return <div>No challenge found.</div>;
  }

  return (
    <div key={challenge.id} className={"mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 pt-12  "}>
      <img src={challenge.image || defaultImg} alt={challenge.title} className={"max-w-96  object-cover rounded-md"}/>
      <h1 className={"text-3xl text-black"}>{challenge.title}</h1>
      <div dangerouslySetInnerHTML={{__html: challenge.description}}/>
      {
        challenge.start_date > new Date().toISOString() ?
          <p className={"text-sm text-gray-600"}>Starts : {challenge.start_date}</p> :
          <p className={"text-sm text-green-600"}>Started : {challenge.start_date}</p>
      }
      <p className={"text-sm text-red-600"}>Ends : {challenge.end_date}</p>
    </div>
  );
}

