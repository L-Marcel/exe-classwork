import { HStack, Stack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { useInputErrors } from "../../contexts/hooks/useInputErrors";
import { useUser } from "../../contexts/hooks/useUser";
import { Api } from "../../services/api";
import { IconButton } from "../Buttons/IconButton";
import { Input } from "../Inputs";
import { NamedIcon } from "../NamedIcon";
import { Title } from "../Title";

interface InviteCodeFormProps {};

function InviteCodeForm({}: InviteCodeFormProps) {
  const router = useRouter();
  const [code, setCode] = useState("");
  
  const { user } = useUser();
  const { 
    addInputErrors, 
    removeInputError, 
    inputErrors 
  } = useInputErrors();

  const error = inputErrors["inviteCode"];

  function handleSubmit() {
    if(code) {
      Api.get(`/classrooms/${code}`).then(res => {
        console.log(res.data);
        router.push(`/app/${user.githubId}/classrooms`);
      }).catch(err => {
        addInputErrors({
          inviteCode: {
            message: err.response.data.message
          }
        });
      });
    };
  };

  return (
    <Stack
      spacing={5}
      alignItems={["center", "center", "flex-start"]}
    >
      <Title
        bgGradient="linear(to-r, primary.200, primary.600)"
        bgClip="text"
      >
        Use invite code
      </Title>
      <HStack 
        spacing={5}
        alignItems="flex-start"
      >
        <Input
          placeholder="Insert invite code..."
          name="inviteCode"
          iconName="qrcode"
          w={[250, 300]}
          onChange={(e) => {
            removeInputError("inviteCode");
            setCode(e.target.value);
          }}
          value={code}
        />
        <IconButton
          aria-label="submit-invite-code-form"
          icon={<NamedIcon name="submit"/>}
          name="left"
          theme={error? "red":"primary"}
          onClick={handleSubmit}
          isDisabled={!code}
        />
      </HStack>
    </Stack>
  );
};

export { InviteCodeForm };

