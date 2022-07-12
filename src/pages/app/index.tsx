import { Text } from "@chakra-ui/react";
import { DynamicGridList } from "../../components/List/DynamicGridList";
import { ReferenceButton } from "../../components/ReferenceButton";
import { Section } from "../../components/Section";
import { Title } from "../../components/Title";
import { WithUserProps } from "../../utils/routes/WithUserProps";

interface HomePageProps extends WithUserProps {};

function HomePage({
  user
}: HomePageProps) {
  return (
    <Section isNeabyOfNavigation>
      <Title>Welcome, {user.name ?? user.username}!</Title>
      <Text
        maxW={["100%", "100%", "100%", "60%", "60%", "50%"]}
      >
        Did you know Exe Classwork? Exe Classwork is a new version of the Classwork: a tool for analyze github repositories focused in help teachers with students software development monitoring.
      </Text>
      <DynamicGridList
        w="100%"
        mt={4}
        colsMaxW={["100%", "100%", "70%", "60%", "40%", "40%"]}
        cols={{
          base: ["a"],
          xl: ["a", "b"],
          lg: ["a", "b"],
          md: ["a", "b"],
          sm: ["a"]
        }}
        items={[
          <ReferenceButton
            title="Is a user? See the documentation"
            description="You can extract data of Github repositories, create classrooms,  teams and monitor all of them without need force loads all time."
          />,
          <ReferenceButton
            title="Is a developer? See the documentation for developers"
            description="Instructions to clone, install and execute the Exe Classwork in you development environment. See all API routes too and contribute with this tool!"
          />,
          <ReferenceButton
            title="Creating and managing a classroom"
            description="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Necessitatibus hic, officiis eius rerum qui harum maiores voluptatum similique ex aut, nam adipisci reprehenderit aperiam placeat! Alias eveniet in recusandae magni."
          />,
          <ReferenceButton
            title="Metrics extracted of a repository"
            description="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Necessitatibus hic, officiis eius rerum qui harum maiores voluptatum similique ex aut, nam adipisci reprehenderit aperiam placeat! Alias eveniet in recusandae magni."
          />,
          <ReferenceButton
            title="Send your feedback for us"
            description="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Necessitatibus hic, officiis eius rerum qui harum maiores voluptatum similique ex aut, nam adipisci reprehenderit aperiam placeat! Alias eveniet in recusandae magni."
          />
        ]}
      />
    </Section>
  );
};

export default WithUserProps(HomePage);