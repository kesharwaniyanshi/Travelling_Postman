import jwt from "jsonwebtoken";
import { parse } from "cookie";

export function parseCookies(req) {
  if (!req || !req.headers || !req.headers.cookie) {
    return {};
  }
  return parse(req.headers.cookie);
}


export default function withAuth(WrappedComponent) {
  const AuthenticatedComponent = (props) => {
    return <WrappedComponent {...props} />;
  };

  AuthenticatedComponent.getServerSideProps = async (context) => {
    const { req } = context;

    try {
      const cookies = cookie.parse(req.headers.cookie || "");
      const token = cookies.token;

      if (!token) {
        console.log("No token found, redirecting to login.");
        return {
          redirect: {
            destination: "/login",
            permanent: false,
          },
        };
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      return {
        props: {
          userId: decoded.userId,
        },
      };
    } catch (error) {
      console.error("Token verification failed or invalid request:", error);
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }
  };

  return AuthenticatedComponent;
}
