import { useEffect, useState } from "react";
import { GetActiveAndUpcomingChallengesApi } from "../Api/Challenges";
import { useCookies } from "react-cookie";
import DisplayChallenges from "../components/DisplayChallenges";
import {GetCurrentUserInfoApi} from "../Api/GetCurrentUserInfo";
import {Spin} from "antd";

export default function ChallengeList() {
  const [loading, setLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);
  const [activeChallenges, setActiveChallenges] = useState([]);
  const [upcomingChallenges, setUpcomingChallenges] = useState([]);
  const [cookies] = useCookies([]);
  if(userInfo){
    window.sessionStorage.setItem("user", JSON.stringify(userInfo));
  }
  useEffect(() => {
    async function GetUserInfo(){
      if (!cookies.jwt) {
        console.error("Authorization token is missing.");
        setUserLoading(false);
        return;
      }
      const [data, error] = await GetCurrentUserInfoApi(cookies.jwt);
      if (data) {
        setUserInfo(data);
      } else {
        console.error(error);
      }
      setUserLoading(false);
    }
    GetUserInfo();
  }, [cookies.jwt]);
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

  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <Spin size="large"/>
    </div>;
  }
  if (userLoading) {
    return <div className="flex justify-center items-center h-screen">
      <Spin size="large"/>
    </div>
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <div className={"mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 py-12"} >
      {activeChallenges && activeChallenges.length > 0 &&
        <div key={0}>
          <h3 className={"text-3xl font-bold mb-5"}>Active Challenges</h3>
          <DisplayChallenges challenges={activeChallenges} CurrentUser={userInfo} />
        </div>
      }
      {upcomingChallenges && upcomingChallenges.length > 0 &&
        <div key={1}>
          <h3 className={"text-3xl font-bold mb-5"}>Upcoming Challenges</h3>
          <DisplayChallenges challenges={upcomingChallenges} CurrentUser={userInfo}/>
        </div>}



    </div>
  );
}
