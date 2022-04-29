import { Box, ListItem, OrderedList, Text } from "@chakra-ui/react";
import QRCode from "react-qr-code";
import { Link } from "../../../../../components/Link";
import { Section } from "../../../../../components/Section";
import { Title } from "../../../../../components/Title";
import { WithClassroomProps } from "../../../../../utils/routes/WithClassroomProps";
import { WithUserProps } from "../../../../../utils/routes/WithUserProps";

interface ClassroomPageProps extends WithClassroomProps {};

function ClassroomQrCodePage({ classroom, user }: ClassroomPageProps) {
  return (
    <Section
      isNeabyOfNavigation
    >
      <Link href={`/app/${user.githubId}/classrooms/${classroom.id}`}>
        {'<'}- return
      </Link>
      <Title
        mt={[3, 2]}
      >
        {classroom.title}
      </Title>
      <Text>
        (QRCode) Instructions for use:
      </Text>
      <OrderedList
        mt={4}
      >
        <ListItem>
          In your mobile device, put the camera in front of QRCode bellow:
        </ListItem>
      </OrderedList>
      <Box
        mt={5}
        p={5}
        bgColor="solid.100"
        borderRadius={8}
      >
        <QRCode
          value={`${process.env.NEXT_PUBLIC_URL}/login?qrcode=${classroom.inviteCode}`}
          bgColor="transparent"
          fgColor="var(--chakra-colors-primary-800)"
        />
      </Box>
      <OrderedList
        mt={4}
      >
        <ListItem>
          Open QRCode URL in your browser.
        </ListItem>
      </OrderedList>
    </Section>
  );
}

export default WithUserProps(
  WithClassroomProps(ClassroomQrCodePage, (classroom, user) => {
    if(!classroom.users.some(u => 
      u.user.id === user.id && 
      u.role !== "STUDENT" && 
      u.role !== "OBSERVER")
    ) {
      return false;
    };

    return true;
  }) 
);