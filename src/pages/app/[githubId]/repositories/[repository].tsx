import { Text } from "@chakra-ui/react";
import { RepositoryBanner } from "../../../../components/Repository/RepositoryBanner";
import { Section } from "../../../../components/Section";

import { RepositoryChart } from "../../../../components/Repository/RepositoryChart";
import { WithRepositoryProps } from "../../../../utils/routes/WithRepositoryProps";
import { WithUserProps } from "../../../../utils/routes/WithUserProps";

interface RepositoryPageProps extends WithRepositoryProps {};

function RepositoryPage({
  repository
}: RepositoryPageProps) {
  const { 
    name,
    fullname,
    gitUrl,
    sshUrl,
    description,
    homepage,
    commits
  } = repository;

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

export default WithUserProps(
  WithRepositoryProps(RepositoryPage)
);