import { Text } from "@chakra-ui/react";
import { RepositoryBanner } from "../../../../components/Repository/RepositoryBanner";
import { Section } from "../../../../components/Section";

import {
  CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Title,
  Tooltip
} from "chart.js";

import { Line } from "react-chartjs-2";
import { WithRepositoryProps } from "../../../../utils/routes/WithRepositoryProps";
import { WithUserProps } from "../../../../utils/routes/WithUserProps";


interface RepositoryPageProps extends WithRepositoryProps {};

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'January', 'February', 'March', 'April', 'May', 'June', 'July'];

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function RepositoryPage({
  repository
}: RepositoryPageProps) {
  const { 
    name,
    fullname,
    gitUrl,
    sshUrl,
    description,
    homepage
  } = repository;

  return (
    <>
      <RepositoryBanner
        name={name}
        fullname={fullname}
        gitUrl={gitUrl}
        sshUrl={sshUrl}
        description={description}
        homepage={homepage}
      />
      <Section
        overflowX="auto"
        overflowY="hidden"
        h={550}
      >
        <Line
          options={{
            responsive: false,
            plugins: {
              legend: {
                position: "top" as const,
              },
              title: {
                display: true,
                text: "Repository Metrics Timeline [In Work]",

                font: {
                  size: 20,
                  weight: "700",
                  family: "'Manrope', sans-serif"
                }
              },
            },
          }}
          data={{
            labels,
            datasets: [
              {
                label: 'Complexity',
                data: [2, 3, 5, 10],
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
              },
              {
                label: 'Additions',
                data: [3, 4, 5, 15, 3, 4, 5, 15, 3, 4, 5, 15, 3, 4, 5, 15],
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
              },
              {
                label: 'Deletions',
                data: [3, 4, 5, 12],
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
              },
            ],
          }}
        />
      </Section>
      <Section>
        <Text textAlign="center">This page will still undergo many changes.</Text>
      </Section>
    </>
  );
};

export default WithUserProps(
  WithRepositoryProps(RepositoryPage)
);