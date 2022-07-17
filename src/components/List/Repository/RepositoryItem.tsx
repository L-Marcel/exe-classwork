import { Box, Heading, Progress, Text } from "@chakra-ui/react";
import { m } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useProgress } from "../../../contexts/hooks/useProgress";
import { scaleOnInteract } from "../../../theme/animations/motion";
import { IconButton } from "../../Buttons/IconButton";
import { Link } from "../../Link";
import { NamedIcon } from "../../NamedIcon";
import { TooltipOnHover } from "../../TooltipOnHover";

interface RepositoryItemProps {
  name: string;
  fullname: string;
  id: string;
  description?: string;
  subject?: string;
  status?: RepositoryStatus;
  alerts?: any[];
};

function RepositoryItem({ 
  name, 
  fullname, 
  description, 
  subject, 
  id, 
  status,
  alerts = [] 
}: RepositoryItemProps) {
  const router = useRouter();

  const [progress, setProgress] = useState<NamedProgress>({
    target: 0,
    value: 0,
    status: status || "NOT_REQUESTED",
    name: fullname
  });

  const { getProgressByName } = useProgress();

  const _progress = getProgressByName(fullname);

  const isLoading = progress?.status === "REQUESTED";
  const isLoaded = !isLoading && progress?.status === "LOADED";
  const canOpen = (!isLoading && isLoaded);
  const theme = canOpen? "primary.700":"orange.700";
  
  useEffect(() => {
    if(_progress && _progress !== progress) {
      setProgress(_progress);
    } else if(status && progress.status === "NOT_REQUESTED" && progress.status !== status) {
      setProgress(p => {
        return {
          ...p,
          status
        };
      });
    };
  }, [_progress, progress, setProgress]);

  return (
    <Box
      position="relative"
      w="fill"
      minW={["85%", "80%", "80%", "40%", "20%", "20.1%"]}
    >
      <Box
        as={m.button}
        bgColor="solid.100"
        w="100%"
        borderRadius={15}
        borderLeft="2px solid"
        borderColor={theme}
        p={[4, 6]}
        flexDir="column"
        position="relative"
        display="flex"
        alignItems="flex-start"
        justifyContent="flex-start"
        textAlign="start"
        opacity={(!isLoading && !isLoaded) && .3}
        onClick={() => canOpen && router.push(`/repositories/${fullname?.toLocaleLowerCase()}`)}
        cursor={isLoading? "progress":isLoaded? "pointer":"not-allowed"}
        {...scaleOnInteract}
      >
        <Box
          position="relative"
          display="flex"
          justifyContent="space-between"
          w="100%"
        >
          <Heading
            fontSize="1.4rem"
            color={theme}
            maxW={["65vw", "70vw", "80vw", 350, 220, 300]}
            pr={[0, 12]}
            mt={-1}
          >
            {name?.slice(0, 30)}{name?.length > 30 && "..."}
          </Heading>

        </Box>
        <Text
          mt={-1}
          fontSize=".9rem"
          maxW={["63vw", "77vw", "77vw", 330, 200, 280]}
        >
          {subject}
        </Text>
        {
          description && <Text 
            mt={3}
            fontSize="1rem"
            maxW={["68vw", "80vw", "80vw", "50vw", 220, 300]}
          >
            {description?.slice(0, 200)}{description?.length > 200 && "..."}
          </Text>
        }
        { isLoading && <Progress
          as={m.div}
          isIndeterminate={!progress?.value && !progress?.target}
          w="100%"
          mt={4}
          className="orange"
          borderRadius={8}
          value={(progress?.value/progress?.target) * 100}
          h={2}
        /> }
      </Box>
      <Box
        as={m.div}
        {...scaleOnInteract}
        position="absolute"
        top={-1}
        right={[-8, 0]}
        p={4}
        onClick={e => e.stopPropagation()}
      >
        <Link
          href={`/app/repositories/${id}/config?returnToList=true`}
        >
          <TooltipOnHover
            label="Repository configuration"
          >
            <IconButton
              justifyContent="center"
              borderRadius={15}
              alignItems="center"
              minW="28px"
              minH="28px"
              maxW="28px"
              maxH="28px"
              bgColor="solid.200"
              aria-label="repository-configuration-button"
              icon={<NamedIcon 
                name="cog"
                h="15px"
                w="15px"
                mt=".5px"
                maxW="15px"
                maxH="15px"
              />}
            />
          </TooltipOnHover>
        </Link>
      </Box>
    </Box>
  );
};

export { RepositoryItem };

