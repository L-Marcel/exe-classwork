import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { PageFallback } from "../../components/PageFallback";
import { useRepository } from "../../contexts/hooks/useRepository";
import { Api } from "../../services/api";

function WithRepositoryProps<T = any>(Page: NextPage<T>, auth?: (repository?: Repository, user?: User) => boolean) {
  return function repositoryProvider(props: any) {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(auth? false:true);
    const { repository, setRepository } = useRepository();

    const repositoryIsLoaded = repository 
    && router?.query?.repository 
    && repository?.id === router?.query?.repository;

    useEffect(() => {
      if(!repositoryIsLoaded) {
        console.log(router?.query?.repository);
        Api.get(`/user/repository/${router?.query?.repository}`).then(res => {
          setRepository(res.data);
        }).catch(() => {
          router.push(`/app/${router?.query?.githubId}/repositories`);
        });
      };
    }, [
      repository, 
      router, 
      setRepository
    ]);

    useEffect(() => {
      if(auth && repositoryIsLoaded) {
        const isAuth = auth(repository, props.user);
        setIsAuthorized(isAuth);

        if(!isAuth && repositoryIsLoaded) {
          router.push(`/app/${router?.query?.githubId}/repositories`);
        };
      };
    }, [
      router,
      props.user, 
      repository, 
      setIsAuthorized,
      auth
    ]);
    
    if(!repositoryIsLoaded || !isAuthorized) {
      return (
        <PageFallback
          title="We are getting everything ready for you."
        />
      );
    };
  
    return (
      <Page
        repository={repository}
        {...props}
      />
    );
  };
};

export { WithRepositoryProps };

