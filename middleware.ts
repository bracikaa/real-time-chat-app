import { withAuth } from "next-auth/middleware";

// checks if you are authenticated, if not, you're redirected to the signin page
export default withAuth({ pages: { signIn: "/" } });

export const config = {
  matcher: ["/users/:path*"],
};
