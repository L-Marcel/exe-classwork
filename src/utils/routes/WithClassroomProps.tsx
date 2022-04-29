import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { PageFallback } from "../../components/PageFallback";
import { useClassroom } from "../../contexts/hooks/useClassroom";
import { Api } from "../../services/api";

function WithClassroomProps<T = any>(Page: NextPage<T>, auth?: (classroom?: Classroom, user?: User) => boolean) {
  return function classroomProvider(props: any) {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(auth? false:true);
    const { classroom, setClassroom } = useClassroom();

    const classroomIsLoaded = classroom 
    && router?.query?.classroom 
    && classroom?.id === router?.query?.classroom;

    useEffect(() => {
      if(!classroomIsLoaded) {
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

    useEffect(() => {
      if(auth && classroomIsLoaded) {
        const isAuth = auth(classroom, props.user);
        setIsAuthorized(isAuth);

        if(!isAuth && classroomIsLoaded) {
          router.push(`/app/${router?.query?.githubId}/classrooms`);
        };
      };
    }, [
      router,
      props.user, 
      classroom, 
      setIsAuthorized,
      auth
    ]);
    
    if(!classroomIsLoaded || !isAuthorized) {
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

