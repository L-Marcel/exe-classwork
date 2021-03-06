import { GetStaticPaths, GetStaticProps } from "next";
import { useCallback, useEffect, useState } from "react";
import { RepositoryBanner } from "../../../../components/Repository/RepositoryBanner";
import { RepositoryContent } from "../../../../components/Repository/RepositoryContent";
import { Section } from "../../../../components/Section";
import { useRepository } from "../../../../contexts/hooks/useRepository";
import { useUser } from "../../../../contexts/hooks/useUser";
import { CannotGetCommitsError } from "../../../../errors/api/CannotGetCommitsError";
import { Api } from "../../../../services/api";
import { WithUserProps } from "../../../../utils/routes/WithUserProps";

function RepositoryPage({
  repository
}) {
  const { user } = useUser();
  const { setRepository } = useRepository();

  const {
    commits,
    description,
    fullname,
    gitUrl,
    homepage,
    name,
    owner,
    id
  } = repository;

  const [commitsInterval, setCommitsInterval] = useState(commits.map(c => {
    return {
      ...c,
      filtered: true
    };
  }) || []);

  useEffect(() => {
    setRepository(repository);
  }, [repository]);

  const handleOnChangeInterval = useCallback(
    (getFilteredResult: (date: string) => boolean) => {
      if(commits.length > 0) {
        setCommitsInterval(commits.map(c => {
          return {
            ...c,
            filtered: getFilteredResult(c.commitedAt) 
            //to compare with not filtered results in the future
            //please, keep it
          };
        }));
      };
    }, [commits]);

  const isAuthorizedUser = (owner && user) && owner?.id === user?.id;

  return (
    <>
      <RepositoryBanner
        id={id}
        name={name}
        fullname={fullname}
        gitUrl={gitUrl}
        description={description}
        homepage={homepage}
        commits={commits}
        onChangeInterval={handleOnChangeInterval}
        filteredCommits={commitsInterval}
        isAuthorizedUser={isAuthorizedUser}
      />
      <Section
        flex={1}
        py="0!important"
        pl={["0!important", "0!important", "var(--chakra-space-14)!important"]}
        pr={["0!important", "0!important", "var(--chakra-space-14)!important"]}
      >
        <RepositoryContent
          commits={commitsInterval || []}
        />
      </Section>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: true
  };
};

export const getStaticProps: GetStaticProps = async({ params }) => {
  async function getRepositoryCommits(fullname: string, id: string, page = 0, take = 10) {
    const { items: commits, count } = await Api.get(`/user/repository/${id}/commits?page=${page}&take=${take}`).then(res => {
      return res.data;
    }).catch((err) => {
      throw new CannotGetCommitsError(id);
    });

    if(count >= (page * take)) {
      const nextPage = page + 1;
      const nextCommits = await getRepositoryCommits(fullname, id, nextPage, take);
      return [ ...commits, ...(nextCommits || []) ];
    };
  
    return (commits || []);
  };

  try {
    const fullname = `${params.username}/${params.repository}`;
    const repository = await Api.get(`/repository/${fullname}?justLoaded=true`).then(async(res) => {
      const commits: any[] = await getRepositoryCommits(fullname, res.data.id, 0, 10);
      
      return {
        ...res.data,
        commits
      };
    }).catch((err) => {
      console.log(err);
      throw new CannotGetCommitsError(params.repository?.toString());
    });
  
    return {
      props: {
        repository
      }
    };
  } catch (error) {};

  return {
    notFound: true
  };
};

export default WithUserProps(
  RepositoryPage, {
    isPublic: true
  }, {
    title: "We are loading the repository commits.",
    subtitle: "This process is required for every push event."
  }
);