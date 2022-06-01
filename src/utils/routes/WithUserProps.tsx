import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { PageFallback } from "../../components/PageFallback";
import { useIsLoading } from "../../contexts/hooks/useIsLoading";
import { useUser } from "../../contexts/hooks/useUser";
import { Api } from "../../services/api";

type WithUserPropsFallback = {
  title?: string;
  subtitle?: string;
};

function WithUserProps<T = any>(Page: NextPage<T>, {
  title = "We are getting everything ready for you.",
  subtitle
}: WithUserPropsFallback) {
  return function UserProvider(props: any) {
    const router = useRouter();
    const { user, setUser, signOut } = useUser();
    const { isLoading } = useIsLoading();

    useEffect(() => {
      if(!user && !isLoading && router.query?.githubId) {
        Api.get(`/user/${router.query?.githubId}`).then(res => {
          setUser(res.data);
        }).catch(() => {});
      };
    }, [
      user, 
      router, 
      setUser,
      isLoading,
      signOut
    ]);
    
    if(!user || router.isFallback) {
      return (
        <PageFallback
          title={title}
          subtitle={subtitle}
        />
      );
    };
  
    return (
      <Page
        user={user}
        {...props}
      />
    );
  };
};

export { WithUserProps };

