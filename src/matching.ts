interface User {
  userId: string;
  peerId: string;
}

let waitUser: User | null;

export const serveMatching = async (
  req: Request,
): Promise<Response | null> => {
  const path = new URL(req.url).pathname;

  if (req.method === "POST" && path === "/api/matching/start") {
    const { userId, peerId } = await req.json();
    console.log({ waitUser, userId, peerId });

    if (waitUser) {
      const res = new Response(JSON.stringify(waitUser));
      waitUser = null;
      return res;
    } else {
      waitUser = { userId, peerId };
      return new Response("{}");
    }
  }

  if (req.method === "POST" && path === "/api/matching/cancel") {
    const { userId } = await req.json();
    waitUser?.userId === userId && (waitUser = null);
    return new Response("{}");
  }

  return null;
};
