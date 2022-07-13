import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { PageFallback } from "../../components/PageFallback";
import { useClassroom } from "../../contexts/hooks/useClassroom";
import { Api } from "../../services/api";

function WithClassroomProps<T = any>(Page: NextPage<T>, auth?: (classroom?: Classroom, user?: User, team?: Team) => boolean) {
  return function classroomProvider(props: any) {
    const router = useRouter();

    const [isAuthorized, setIsAuthorized] = useState(auth? false:true);
    const { classroom, setClassroom } = useClassroom();

    const classroomIsLoaded = classroom 
    && router?.query?.classroom 
    && classroom?.id === router?.query?.classroom;

    const teamId = router?.query?.team;
    const team = classroomIsLoaded && classroom?.teams.find(t => t?.id?.toLowerCase() === String(teamId).toLowerCase());

    useEffect(() => {
      if(!classroomIsLoaded && router?.query?.classroom) {
        Api.get(`/user/classroom/${router?.query?.classroom}`).then(res => {
          setClassroom(res.data);
        }).catch((err) => {
          
          console.log(err);
          //router.push(`/app/classrooms`);
        });
      };
    }, [
      classroom, 
      router, 
      setClassroom
    ]);

    useEffect(() => {
      if(auth && classroomIsLoaded && props.user) {
        const isAuth = auth(classroom, props.user, team);
        
        setIsAuthorized(isAuth);

        if(!isAuth && classroomIsLoaded && (teamId && !team)) {
          console.log("aff");
          //router.push("/app/classrooms");
        };
      };
    }, [
      router,
      props.user, 
      classroom, 
      setIsAuthorized,
      auth
    ]);
    
    if(!classroomIsLoaded || !isAuthorized || (teamId && !team)) {
      return (
        <PageFallback
          title="We are getting everything ready for you."
        />
      );
    };
  
    return (
      <Page
        classroom={classroom}
        team={team}
        {...props}
      />
    );
  };
};

export { WithClassroomProps };

