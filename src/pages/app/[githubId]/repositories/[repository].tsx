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
    commits,
    alerts
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
      />
      <Text>
        {commits?.length}
      </Text>
      <Section
        minH={1200}
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