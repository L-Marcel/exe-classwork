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
          A simple monitoring system for Github's repositories with tools to improve the school environment. You can create a classroom, add developers or students, make a team, and monitor their repositories. Problems with analyzing the productivity of the projects? Try it!
        </Text>
        <HStack>
          <Link href={`/api/login${router.query?.qrcode? `?qrcode=${router.query?.qrcode}`:""}`}>
            <Button
              theme="primary"
            >
              Sign-in
            </Button>
          </Link>
          <Button
            onClick={() => window.open("https://l-marcel.gitbook.io/classwork/", "_blank")}
          >
            Documentation
          </Button>
        </HStack>
      </Stack>
      <Box
        position="relative"
        bgImage="/login_bg.jpg"
        bgPos={["0 100%", "0 20%"]}
        bgSize="cover"
        bgRepeat="no-repeat"
        bgColor="solid.100"
        h="full"
        w="100%"
      >
        <Link
          href="https://l-marcel.vercel.app" 
          position="absolute"
          bottom={["auto", "auto", "auto", 0]}
          top={[0, 0, 0, "auto"]}
          m={8}
          ml={[-1, -1, -1, 8]}
          mt={[-4, -4, -4, 8]}
          borderRadius={8}
          bgColor={["solid.100", "solid.50"]}
          py={1}
          px={3}
        >
          @l-marcel
        </Link>
      </Box>
    </>
  );
};

export default LoginPage;