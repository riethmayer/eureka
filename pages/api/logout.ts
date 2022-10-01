import Cookies from "cookies";

export default async (req, res) => {
  const cookies = new Cookies(req, res);
  cookies.set("stytch_session", "", {
    expires: new Date(0),
    maxAge: 0,
  });
};
