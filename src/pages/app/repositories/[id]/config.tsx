import { GetServerSideProps } from "next";
import { RepositoryConfiguration } from "../../../../components/Repository/RepositoryConfiguration";
import { Section } from "../../../../components/Section";
import { Api } from "../../../../services/api";
import { Cookies } from "../../../../services/cookies";
import { WithUserProps } from "../../../../utils/routes/WithUserProps";

interface RepositoryConfigProps {
  repository: Repository;
};

function RepositoryConfig({
  repository
}: RepositoryConfigProps) {
  return (
    <Section
      isNeabyOfNavigation
    >
      <RepositoryConfiguration
        repositoryName={repository.name}
      />
    </Section>
  );
};

export const getServerSideProps: GetServerSideProps = async({ params, req, res }) => {
  const token = Cookies.get("token", { req, res } as any);

  try {
    const { id } = params;

    const res = await Api.get<Repository>(`/user/repository/${id}?token=${token}`);

    return {
      props: {
        repository: res.data
      }
    };
  } catch (error) {
    console.log(error, token);
    return {
      notFound: true
    };
  };
};

export default WithUserProps(RepositoryConfig);

