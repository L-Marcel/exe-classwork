import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { PageFallback } from "../../components/PageFallback";
import { useIsLoading } from "../../contexts/hooks/useIsLoading";
import { useUser } from "../../contexts/hooks/useUser";
import { Api } from "../../services/api";

type WithUserOptions = {
  isPublic?: boolean
};

type WithUserPropsFallback = {
  title?: string;
  subtitle?: string;
};

function WithUserProps<T = any>(Page: NextPage<T>, {
  isPublic
}: WithUserOptions = {
  isPublic: false
}, {
  title,
  subtitle
}: WithUserPropsFallback = {
  title: "We are getting everything ready for you."
}) {
  return function UserProvider(props: any) {
    const router = useRouter();
    
    const { user, setUser, signOut } = useUser();
    const { isLoading } = useIsLoading();

    useEffect(() => {
      if(!user && !isLoading) {
        Api.get(`/user`).then(res => {
          setUser(res.data);
        }).catch((err) => { console.log( err )});
      };
    }, [
      user, 
      router, 
      setUser,
      isLoading,
      signOut
    ]);
    
    if((!user && !isPublic) || router.isFallback) {
      return (
        <PageFallback
          title={router.isFallback? title:"We are getting everything ready for you."}
          subtitle={router.isFallback && subtitle}
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

