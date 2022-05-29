import { NextPage } from "next";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { PageFallback } from "../../components/PageFallback";
import { useRepository } from "../../contexts/hooks/useRepository";
import { Api } from "../../services/api";

function WithRepositoryProps<T = any>(Page: NextPage<T>, auth?: (repository?: Repository, user?: User) => boolean) {
  return function repositoryProvider(props: any) {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(auth? false:true);
    const { repository, setRepository } = useRepository();

    const [progress, setProgress] = useState(0);

    const repositoryIsLoaded = repository 
    && router?.query?.repository 
    && repository?.id === router?.query?.repository;

    const getRepositoryCommits = useCallback(async(id: string, page = 0, take = 10) => {
      const { items: commits, count } = await Api.get(`/user/repository/${id}/commits?page=${page}&take=${take}`).then(res => {
        return res.data;
      }).catch((err) => {
        throw new Error();
      });
    
      setProgress(Math.min((page * take)/count, 100) * 100);

      if(count >= (page * take)) {
        const nextPage = page + 1;
        const nextCommits = await getRepositoryCommits(id, nextPage, take);
        return [ ...commits, ...(nextCommits || []) ];
      };
    
      return (commits || []);
    }, [setProgress]);

    useEffect(() => {
      if(!repositoryIsLoaded) {
        Api.get(`/user/repository/${router?.query?.repository}`).then(async(res) => {
          const commits: any[] = await getRepositoryCommits(res.data.id, 0, 10);
          setRepository({
            ...res.data,
            commits
          });
        }).catch((err) => {
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
          title="We are loading the repository commits."
          subtitle="This process is required for every push event."
          progress={progress}
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

