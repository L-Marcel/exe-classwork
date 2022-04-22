import { Text } from "@chakra-ui/react";
import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import { Layout } from "../../../components/Layout";
import { PageFallback } from "../../../components/PageFallback";
import { Users } from "../../../controllers/Users";
import { Api } from "../../../services/api";

function App({ user }) {
  const { isFallback } = useRouter();

  if(isFallback) {
    return (
      <Layout>
        <PageFallback
          title="We are getting everything ready for you."
        />
      </Layout>
    );
  };

  return (
    <Layout>
      <Text>
        Hello, {user.name}
      </Text>
    </Layout>
  );
};

export const getStaticPaths: GetStaticPaths = async() => {
  const users = await Api.get("/users", {
    headers: {
      secret: process.env.SECRET
    }
  })
  .then(res => res.data).catch((err) => {
    return [];
  });

  const paths = users.map(u => ({
    params: {
      id: u.id
    }
  }))

  return {
    paths,
    fallback: true
  };
};

export const getStaticProps: GetStaticProps = async(ctx) => {
  const { id } = ctx.params;
  const user = await Users.getByGithubId(id?.toString());

  if(!user || !id || id !== user?.githubId) {
    return {
      notFound: true
    };
  };

  return {
    props: {
      user
    }
  };
};

export default App;