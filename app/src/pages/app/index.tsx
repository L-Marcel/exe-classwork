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
        Did you know Exe Classwork? It is a new version of the Classwork: a tool for analyzing Github repositories focused on helping teachers with students' software development monitoring.
      </Text>
      <DynamicGridList
        w="100%"
        mt={6}
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
            href="https://l-marcel.gitbook.io/classwork/for-users/first-steps-for-a-common-user"
            title="+ Are you a new user? See the documentation for users"
            description="You can extract data from Github repositories, create classrooms, and teams and monitor all of them without needing to force loads all time."
          />,
          <ReferenceButton
            href="https://l-marcel.gitbook.io/classwork/for-developers/creating-a-development-environment"
            title="+ Are you a developer? See as you can contribute"
            description={`Instructions to clone, install and execute the Exe Classwork in your development environment; see the errors,  mean, the possible unknown flaws created by destiny and resolve them; optimize the application with us, or... just read the documentation. \n\nCan you contribute with this tool too!`}
          />,
          <ReferenceButton
            href="https://l-marcel.gitbook.io/classwork/classrooms/creating-and-managing-a-classroom"
            title="+ Creating and managing a classroom"
            description="To automate the evaluation of many repositories, a teacher can create a classroom to unify all your students' repositories in teams and see or filter all data to reduce the time needed to check all. The data is updated for each push event of each repository linked with the classroom."
          />,
          <ReferenceButton
            href="https://l-marcel.gitbook.io/classwork/analytic-and-metrics/metrics-extracted-of-a-repository"
            title="+ Metrics extracted of a repository"
            description="Some metrics can make a difference in the repository evaluation; they aren't all but can show important data for the teacher or the developer byself, improving the rest of the development process."
          />,
          <ReferenceButton
            href="https://exe-code-analytics-playground.vercel.app/"
            title="+ Test in playground"
            description="Check the metrics extracted for a file in real-time in our playground. You can check more than a programming language! (But we have extended support only for Java and JavaScript)"
          />,
          <ReferenceButton
            href="https://l-marcel.gitbook.io/classwork/additional/send-your-feedback-for-us"
            title="+ Send your feedback for us"
            description="You shouldn't be a developer to contribute to the Exe Classwork. Send your opinion, it's important and can make a difference."
          />
        ]}
      />
    </Section>
  );
};

export default WithUserProps(HomePage);