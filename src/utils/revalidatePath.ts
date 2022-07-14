import { NextApiResponse } from "next";

async function revalidatePath(res: NextApiResponse, path: string) {
  await res.revalidate(`/en-US${path}`).catch(() => {
    console.log(`Can't revalidate /${path}`);
  });

};

export { revalidatePath };

