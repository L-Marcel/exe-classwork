import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { PageFallback } from "../../components/PageFallback";
import { useUser } from "../../contexts/hooks/useUser";
import { Api } from "../../services/api";

function WithUserProps<T = any>(Page: NextPage<T>) {
  return function UserProvider(props: any) {
    const router = useRouter();
    const { user, setUser, signOut } = useUser();

    useEffect(() => {
      if(!user) {
        Api.get(`/user/${router.query?.githubId}`).then(res => {
          setUser(res.data);
        }).catch(() => {
          signOut();
        });
      };
    }, [
      user, 
      router, 
      setUser, 
      signOut
    ]);
    
    if(!user) {
      return (
        <PageFallback
          title="We are getting everything ready for you."
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

