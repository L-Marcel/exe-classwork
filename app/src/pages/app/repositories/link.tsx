import { Alert, AlertIcon, Stack } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../../../components/Buttons/Button";
import { Select } from "../../../components/Inputs/Select";
import { Link } from "../../../components/Link";
import { Section } from "../../../components/Section";
import { Title } from "../../../components/Title";
import { useApiResult } from "../../../contexts/hooks/useApiResult";
import { useInputErrors } from "../../../contexts/hooks/useInputErrors";
import { useIsLoading } from "../../../contexts/hooks/useIsLoading";
import { Api } from "../../../services/api";
import { RepositoryFormValidations } from "../../../services/forms/validations/RepositoryFormValidations";
import { selectStyle } from "../../../theme/select/selectStyle";
import { WithUserProps } from "../../../utils/routes/WithUserProps";

type RepositoryData = {
  repository: Repository;
};

function LinkRepository() {
  const router = useRouter();

  const { data, isFetching: repositoriesIsLoading } = useApiResult<Repository>({
    queryTo: `/user/github/repositories?excludeNotLoaded=true`,
    initialData: []
  });

  const { 
    startLoading,
    stopLoading,
    isLoading
  } = useIsLoading();

  const { 
    addInputErrors, 
    resetInputErrors
  } = useInputErrors();

  const { 
    register, 
    handleSubmit,
    formState: { 
      errors
    }
  } = useForm({
    resolver: yupResolver(RepositoryFormValidations.create)
  });
  
  useEffect(() => {
    addInputErrors(errors as any);
  }, [errors]);

  function handleOnSubmit(data: RepositoryData) {
    resetInputErrors();
    startLoading();
    
    Api.post(`/user/repository`, {
      ...data.repository,
      owner: {
        id: data.repository.owner.id
      }
    }).then(() => {
      router.push("/app/repositories");
    }).catch((err) => {
      stopLoading();
    });
  };

  return (
    <Section
      isNeabyOfNavigation
    >
      <Stack
        as="form"
        onSubmit={handleSubmit(handleOnSubmit)}
        borderRadius={8}
        p={4}
        spacing={5}
      >
        <Link 
          href="/app/repositories"
          tabIndex={0}
        >
          {'<'}- return
        </Link>
        <Title>
          Link a new repository
        </Title>
        <Select
          register={register("repository")}
          placeholder="Select the repository..."
          isLoading={repositoriesIsLoading}
          w="100%"
          maxW="100%"
          options={[
            {
              value: null,
              label: "Repositories:",
              color: "var(--chakra-color-solid-200)",
              isFixed: true,
              isDisabled: true
            },
            ...data?.map(m => {
              return {
                value: m,
                label: m.fullname,
                color: "var(--chakra-color-solid-200)"
              };
            })
          ]}
          selectStyles={selectStyle(8)}
        />
        <Alert 
          status="warning"
          variant="left-accent"
          borderRadius={8}
          borderLeftWidth={2}
          w={[300, 350, 500]}
          maxW="80vw"
          alignItems="flex-start"
        >
          <AlertIcon/>
          New repositories are disabled in beta
        </Alert>
        <Button 
          theme="primary" 
          type="submit"
          disabled={isLoading}
          onClick={resetInputErrors}
        >Confirm</Button>
      </Stack>
    </Section>
  );
};

export default WithUserProps(LinkRepository);