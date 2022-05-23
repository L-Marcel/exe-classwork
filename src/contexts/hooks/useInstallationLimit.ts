import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Api } from "../../services/api";
import { useUser } from "./useUser";

const initialData = {
  limit: 0,
  used: 0,
  remaining: 0,
  reset: 0
};

function useInstallationLimit(): InstallationLimit {
  const { user } = useUser();
  const [token, setToken] = useState<string | null>(null);

  const { data: rate, isFetching } = useQuery(token, async() => {
    if(!user?.installationId || token === null) {
      return initialData;
    };

    return await Api.get("https://api.github.com/rate_limit", {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
    .then(res => res.data.rate)
    .catch(async(err) => {
      if(err.response.status === 401 && user?.installationId) {
        await getToken();
      };

      return initialData;
    });
  }, {
    initialData,
    refetchIntervalInBackground: true,
    refetchInterval: 2000
  });

  useEffect(() => {
    if(user?.installationId) {
      getToken();
    };
  }, [user, setToken]);

  async function getToken() {
    const token = await Api.get("/user/installation/token")
    .then(res => res.data.token)
    .catch(() => null);

    setToken(token);
  };

  return {
    limit: rate?.limit || initialData.limit,
    used: rate?.used || initialData.used,
    remaining: rate?.remaining || initialData.remaining,
    reset: rate?.reset || initialData.reset,
    isFetching
  };
};

export { useInstallationLimit };

