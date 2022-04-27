import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { PageFallback } from "../../components/PageFallback";
import { useClassroom } from "../../contexts/hooks/useClassroom";
import { Api } from "../../services/api";

function WithClassroomProps<T = any>(Page: NextPage<T>) {
  return function classroomProvider(props: any) {
    const router = useRouter();

    const { classroom, setClassroom } = useClassroom();

    useEffect(() => {
      if(!classroom) {
        Api.get(`/user/classroom/${router.query?.classroom}`).then(res => {
          setClassroom(res.data);
        }).catch(() => {
          router.push(`/app/${router.query?.githubId}/classrooms`);
        });
      };
    }, [
      classroom, 
      router, 
      setClassroom
    ]);
    
    if(!classroom) {
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

