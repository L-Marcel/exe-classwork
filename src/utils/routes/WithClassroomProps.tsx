import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { PageFallback } from "../../components/PageFallback";
import { useClassroom } from "../../contexts/hooks/useClassroom";
import { useIsLoading } from "../../contexts/hooks/useIsLoading";
import { Api } from "../../services/api";

function WithClassroomProps<T = any>(Page: NextPage<T>) {
  return function classroomProvider(props: any) {
    const router = useRouter();
    const { classroom, setClassroom } = useClassroom();
    const { isLoading } = useIsLoading();

    const classroomIsLoaded = classroom 
    && router?.query?.classroom 
    && classroom?.id === router?.query?.classroom;

    useEffect(() => {
      if(!classroomIsLoaded && !isLoading) {
        Api.get(`/user/classroom/${router?.query?.classroom}`).then(res => {
          setClassroom(res.data);
        }).catch(() => {
          router.push(`/app/${router?.query?.githubId}/classrooms`);
        });
      };
    }, [
      classroom, 
      router, 
      setClassroom
    ]);
    
    if(!classroomIsLoaded) {
      return (
        <PageFallback
          title="We are getting everything ready for you."
        />
      );
    };
  
    return (
      <Page
        classroom={classroom}
        {...props}
      />
    );
  };
};

export { WithClassroomProps };

