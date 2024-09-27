import Cookies from "cookies";

const Logout = async (req, res) => {
  const cookies = new Cookies(req, res);
  cookies.set("stytch_session", "", {
    expires: new Date(0),
    maxAge: 0,
  });
};

export default Logout;
