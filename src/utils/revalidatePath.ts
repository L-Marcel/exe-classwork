import { NextApiResponse } from "next";

async function revalidatePath(res: NextApiResponse, path: string) {
  await res.unstable_revalidate(`/en-US/${path}`).catch(() => {
    console.log(`[Github Webhook]: Can't revalidate /${path}`);
  });

  await res.unstable_revalidate(`/pt-BR/${path}`).catch(() => {
    console.log(`[Github Webhook]: Can't revalidate /pt-BR/${path}`);
  });
};

export { revalidatePath };