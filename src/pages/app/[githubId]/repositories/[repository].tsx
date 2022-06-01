import { Text } from "@chakra-ui/react";
import { RepositoryBanner } from "../../../../components/Repository/RepositoryBanner";
import { Section } from "../../../../components/Section";

import { GetStaticPaths, GetStaticProps } from "next";
import { useEffect } from "react";
import { RepositoryChart } from "../../../../components/Repository/RepositoryChart";
import { useRepository } from "../../../../contexts/hooks/useRepository";
import { CannotGetCommits } from "../../../../errors/api/CannotGetCommits";
import { Api } from "../../../../services/api";
import { WithUserProps } from "../../../../utils/routes/WithUserProps";

function RepositoryPage({
  repository
}) {
  const { setRepository } = useRepository();

  const {
    commits,
    description,
    fullname,
    gitUrl,
    homepage,
    name,
    sshUrl
  } = repository;

  useEffect(() => {
    setRepository(repository);
  }, [repository]);

  return (
    <>
      <RepositoryBanner
        name={name}
        fullname={fullname}
        gitUrl={gitUrl}
        sshUrl={sshUrl}
        description={description}
        homepage={homepage}
        commits={commits?.map(c => c.message) || []}
      />
      <Section
        py="0!important"
        pl={["0!important", "0!important", "var(--chakra-space-14)!important"]}
        pr={["0!important", "0!important", "var(--chakra-space-14)!important"]}
      >
        <RepositoryChart
          commits={commits || []}
        />
      </Section>
      <Section>
        <Text textAlign="center">This page will still undergo many changes.</Text>
      </Section>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking"
  };
};

export const getStaticProps: GetStaticProps = async({ params }) => {
  async function getRepositoryCommits(id: string, page = 0, take = 10) {
    const { items: commits, count } = await Api.get(`/user/repository/${id}/commits?page=${page}&take=${take}`).then(res => {
      return res.data;
    }).catch((err) => {
      throw new Error();
    });

    if(count >= (page * take)) {
      const nextPage = page + 1;
      const nextCommits = await getRepositoryCommits(id, nextPage, take);
      return [ ...commits, ...(nextCommits || []) ];
    };
  
    return (commits || []);
  };

  try {
    const repository = await Api.get(`/user/repository/${params.repository}`).then(async(res) => {
      const commits: any[] = await getRepositoryCommits(res.data.id, 0, 10);
      
      return {
        ...res.data,
        commits
      };
    }).catch((err) => {
      throw new CannotGetCommits(params.repository?.toString());
    });
  
    return {
      props: {
        repository
      }
    };
  } catch (error) {};

  return {
    redirect: {
      destination: `/app/${params.githubId}/repositories`,
      permanent: false
    }
  };
};

export default WithUserProps(
  RepositoryPage, {
    title: "We are loading the repository commits.",
    subtitle: "This process is required for every push event."
  }
);