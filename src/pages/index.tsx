import { Link as ChakraLink, HStack, Stack, Text } from "@chakra-ui/react";
import Link from "next/link";
import { Button } from "../components/Buttons/Button";
import { Layout } from "../components/Layout";
import { Logo } from "../components/Logo";

function Login() {
  return (
    <Layout
      bgImage="/mainpage.svg"
      bgRepeat="no-repeat"
      bgPos={[
        "70% calc(100% + 65px)",
        "70% calc(100% + 65px)",
        "70% calc(100% + 200px)",
        "calc(100% + 50px) calc(100% + 120px)",
        "90% calc(100% + 220px)"
      ]}
      bgSize={[
        "120% 60%",
        "160% 70%",
        "700px 700px"
      ]}
    >
      <Stack
        display="flex"
        spacing={4}
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
          <Link href="/api/login" passHref>
            <ChakraLink>
              <Button
                theme="primary"
              >
                Sign-in
              </Button>
            </ChakraLink>
          </Link>
          <Button>
            Documentation
          </Button>
        </HStack>
      </Stack>
      <Link href="https://l-marcel.vercel.app" passHref>
        <ChakraLink
          position="absolute"
          bottom={8}
          borderRadius={8}
          bgColor="solid.50"
          py={1}
          px={3}
        >
          @l-marcel
        </ChakraLink>
      </Link>
    </Layout>
  );
};

export default Login;