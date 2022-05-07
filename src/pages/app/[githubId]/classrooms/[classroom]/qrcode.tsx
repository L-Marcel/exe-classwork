import { Box, ListItem, OrderedList, Text } from "@chakra-ui/react";
import { QRCodeSVG as QRCode } from "qrcode.react";
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
      <Link 
        href={`/app/${user.githubId}/classrooms/${classroom.id}`}
        tabIndex={0}
      >
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
        bgColor="white.100"
        borderRadius={8}
      >
        <QRCode
          value={`${process.env.NEXT_PUBLIC_URL}/login?qrcode=${classroom.inviteCode}`}
          bgColor="transparent"
          fgColor="black"
          size={256}
        />
      </Box>
      <OrderedList
        mt={4}
        start={2}
      >
        <ListItem>
          Open QRCode URL in your browser.
        </ListItem>
      </OrderedList>
      <Text
        mt={4}
      >
        On some devices it may be necessary to copy the url and manually access the browser.
      </Text>
    </Section>
  );
}

export default WithUserProps(
  WithClassroomProps(ClassroomQrCodePage, (classroom, user) => {
    if(
      !classroom.users.some(u => 
        u.user.id === user.id && 
        u.role !== "STUDENT" && 
        u.role !== "OBSERVER"
      ) && classroom.rolesAreRestricted
    ) {
      return false;
    };

    return true;
  }) 
);