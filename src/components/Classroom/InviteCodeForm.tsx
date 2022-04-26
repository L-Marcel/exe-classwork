import { Heading, HStack, Stack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { useInputErrors } from "../../contexts/hooks/useInputErrors";
import { Api } from "../../services/api";
import { IconButton } from "../Buttons/IconButton";
import { Input } from "../Inputs";
import { NamedIcon } from "../NamedIcon";
import { Span } from "../Span";

interface InviteCodeFormProps {
  user: User;
};

function InviteCodeForm({ user }: InviteCodeFormProps) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const { addInputErrors, removeInputError, inputErrors } = useInputErrors();
  const haveError = inputErrors.some(err => err.name === "inviteCode");

  function handleSubmit() {
    if(code) {
      Api.get(`/classrooms/${code}`).then(res => {
        console.log(res.data);
        router.push(`/app/${user.githubId}/classrooms`);
      }).catch(err => {
        addInputErrors([{
          name: "inviteCode",
          message: err.response.data.message
        }]);
      });
    };
  };

  return (
    <Stack
      spacing={5}
      alignItems={["center", "center", "flex-start"]}
    >
      <Heading>
        <Span color="primary.600">U</Span><Span>se</Span> invite code
      </Heading>
      <HStack 
        spacing={5}
        alignItems="flex-start"
      >
        <Input
          placeholder="Insert invite code..."
          name="inviteCode"
          iconName="qrcode"
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
          theme={haveError? "red":"primary"}
          onClick={handleSubmit}
          isDisabled={!code}
        />
      </HStack>
    </Stack>
  );
};

export { InviteCodeForm };

