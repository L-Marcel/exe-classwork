import { NextPage } from "next";
import { PageFallback } from "../../components/PageFallback";
import { useUser } from "../../contexts/hooks/useUser";

function WithUserProps<T = any>(Page: NextPage<T>) {
  return function UserProvider(props: any) {
    const { user } = useUser();
  
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