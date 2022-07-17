import { HStack, Text } from "@chakra-ui/react";
import { useState } from "react";
import { Api } from "../../services/api";
import { IconButton } from "../Buttons/IconButton";
import { CopyTag } from "../CopyTag";
import { Link } from "../Link";
import { NamedIcon } from "../NamedIcon";
import { Section } from "../Section";
import { Title } from "../Title";
import { TooltipOnHover } from "../TooltipOnHover";

interface ClassroomBanner extends Classroom {
  userIsAuthorized?: boolean;
  user: User;
};

function ClassroomBanner({ 
  id,
  title, 
  subject, 
  description,
  inviteCode,
  userIsAuthorized,
  user,
  inviteCodeIsRestricted
}: ClassroomBanner) {
  const [lastInviteCode, setLastInviteCode] = useState(inviteCode);

  async function handleChangeInviteCode() {
    await Api.post(`/user/classroom/${id}/invite`)
    .then(res => {
      setLastInviteCode(res.data.inviteCode);
    }).catch(() => {});
  };

  return (
    <Section
      isNeabyOfNavigation
    >
      <Link 
        href={user? `/app/classrooms`:`/`}
        tabIndex={0}
      >
        {'<'}- return
      </Link>
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
      { userIsAuthorized? <HStack
        mt={5}
        spacing={2}
        mb={-3}
        rowGap={2}
        flexWrap="wrap"
      >
        <Link href={`/app/classrooms/${id}/config`}>
          <TooltipOnHover
            label="Classroom configuration"
          >
            <IconButton
              aria-label="redirect-to-config"
              icon={<NamedIcon name="cog"/>}
              theme="primary"
              h={8}
              w={8}
              minW="auto"
            />
          </TooltipOnHover>
        </Link>
        <Link href={`/app/classrooms/${id}/qrcode`}>
          <TooltipOnHover
            label="Get QRCode"
          >
            <IconButton
              aria-label="redirect-to-qrcode"
              icon={<NamedIcon name="qrcode"/>}
              theme="primary"
              h={8}
              w={8}
              minW="auto"
            />
          </TooltipOnHover>
        </Link>
        <TooltipOnHover
          label="Get a new invite code"
        >
          <IconButton
            aria-label="change-invite-code"
            icon={<NamedIcon name="refresh"/>}
            theme="primary"
            h={8}
            w={8}
            minW="auto"
            onClick={handleChangeInviteCode}
          />
        </TooltipOnHover>
        <CopyTag
          text={lastInviteCode}
          successMessage="Invite code is copied!"
        />
      </HStack>:(lastInviteCode && !inviteCodeIsRestricted) && <HStack
        mt={5}
        spacing={2}
        mb={-3}
        rowGap={2}
        flexWrap="wrap"
      >
        <Link href={`/app/classrooms/${id}/qrcode`}>
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
          text={lastInviteCode}
          successMessage="Invite code is copied!"
        />
      </HStack> }
    </Section>
  );
};

export { ClassroomBanner };

