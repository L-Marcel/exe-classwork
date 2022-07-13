import { GetServerSideProps } from "next";
import { Prisma } from "../../../../../../services/prisma";
import { WithClassroomProps } from "../../../../../../utils/routes/WithClassroomProps";
import { WithUserProps } from "../../../../../../utils/routes/WithUserProps";
import { TeamFormPage } from "../../team";

export const getServerSideProps: GetServerSideProps = async({
  query
}) => {
  const { team: teamId, classroom: classroomId } = query;

  const team = await Prisma.team.findFirst({
    where: {
      id: String(teamId),
      classroomId: String(classroomId)
    },
    include: {
      users: {
        include: {
          user: true
        }
      },
      repository: {
        include: {
          owner: true
        }
      }
    }
  });

  if(!team) {
    return {
      notFound: true
    };
  };

  return {
    props: {
      team
    }
  };
};

export default WithUserProps(
  WithClassroomProps(TeamFormPage, (classroom, user, team) => {
    const isMember = team? team.users.some(u => u.user.id === user.id && u.role === "LEADER"):false;

    if(!isMember && !classroom.users.some(u => 
      u.user.id === user.id && 
      u.role !== "STUDENT" && 
      u.role !== "OBSERVER")
    ) {
      return false;
    };

    return true;
  }) 
);