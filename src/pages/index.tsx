import { Box, HStack, Stack, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { Button } from "../components/Buttons/Button";
import { Link } from "../components/Link";
import { Logo } from "../components/Logo";

function LoginPage() {
  const router = useRouter();

  return (
    <>
      <Stack
        display="flex"
        spacing={4}
        p={8}
      >
        <Logo
          mt="-10px"
          mb="-18px"
          ml={[0, "-2px", "-3px", "-5px"]}
        />
        <Text
          data-testid="app-description"
          maxW={["90%", "80%", "70%", "60%", "50%"]}
          textAlign="left"
        >
          A simple Github repository monitoring system with tools to improve school environment. You can create a classroom, add developers or students, make a team, and monitoring they repositories. Problems with analyzing the productivity of the projects? Try it!
        </Text>
        <HStack>
          <Link href={`/api/login${router.query?.qrcode? `?qrcode=${router.query?.qrcode}`:""}`}>
            <Button
              theme="primary"
            >
              Sign-in
            </Button>
          </Link>
          <Button>
            Documentation
          </Button>
        </HStack>
      </Stack>
      <Box
        bgImage="/login_bg.jpg"
        bgPos={["0 100%", "0 20%"]}
        bgSize="cover"
        bgRepeat="no-repeat"
        bgColor="solid.100"
        h="full"
        w="100%"
      />
      <Link
        href="https://l-marcel.vercel.app" 
        position="absolute"
        bottom={0}
        m={8}
        borderRadius={8}
        bgColor="solid.50"
        py={1}
        px={3}
      >
        @l-marcel
      </Link>
    </>
  );
};

export default LoginPage;