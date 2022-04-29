import { HStack, Text } from "@chakra-ui/react";
import { IconButton } from "../Buttons/IconButton";
import { CopyTag } from "../CopyTag";
import { Link } from "../Link";
import { NamedIcon } from "../NamedIcon";
import { Section } from "../Section";
import { Title } from "../Title";

interface ClassroomBanner {
  id?: string;
  title: string;
  subject?: string;
  description?: string;
  authorizedUser?: ClassroomRelation;
  inviteCode?: string;
};

function ClassroomBanner({ 
  id,
  title, 
  subject, 
  description,
  inviteCode,
  authorizedUser
}: ClassroomBanner) {
  return (
    <Section
      isNeabyOfNavigation
    >
      <Title>
        {title}
      </Title>
      {
        subject && <Text
          fontSize="1.1rem"
          color="solid.500"
        >
          Subject: {subject}
        </Text>
      }
      { description && <Text 
          mt={2}
        >
          {description}
        </Text>
      }
      <HStack
        mt={5}
        spacing={2}
        mb={-3}
      >
        <Link href={`/app/${authorizedUser.user.githubId}/classrooms/${id}/qrcode`}>
          <IconButton
            aria-label="redirect-to-qrcode"
            icon={<NamedIcon name="qrcode"/>}
            theme="primary"
            h={8}
            w={8}
            minW="auto"
          />
        </Link>
        <CopyTag
          text={inviteCode}
          successMessage="Invite code is copied!"
        />
      </HStack>
    </Section>
  );
};

export { ClassroomBanner };

