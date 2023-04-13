import User from "../models/User";
import bcrypt from "bcrypt";
import session from "express-session";

export const getJoin = (req, res) => res.render("join", { pageTitle: "Join" });
export const postJoin = async (req, res) => {
  const { name, username, email, location, password, password2 } = req.body;
  const pageTitle = "Join";
  if(password !== password2){
    return res.status(400).render("join", { 
      pageTitle, 
      errorMessage:"Password confirmation does not match.", });
  }
  
  const exists = await User.exists({$or: [{username}, {email}]});
  if(exists){
    return res.status(400).render("join", { 
      pageTitle, 
      errorMessage:"This username/email is already taken.", });
  }
  try {
    await User.create({
      name,
      username,
      email,
      password,
      location,
    });
    return res.redirect("/login");
  } catch(error){
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: error._message,
    });
  };
};

export const getLogin = (req, res) => {
  res.render("login", {pageTitle:"Login"});
};
  
export const postLogin = async(req, res) => {
  const {username, password} = req.body;
  const pageTitle = "Login";
  const user = await User.findOne({ username });
  if(!user){
    return res
    .status(400)
    .render("login", {
      pageTitle,
      errorMessage: "An account with this username does now exists.",
    });
  };
  
  const ok = await bcrypt.compare(password, user.password);
  if(!ok) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "Wrong password",
    });
  }
  req.session.loggedIn = true;
  req.session.user = user;
  return res.redirect("/");
};

export const startGithubLogin = (req, res) => {
  const baseUrl = "http://github.com/login/oauth/authorize";
  const config = {
    client_id:"20ed91ed3c0e5fa2876e",
    allow_signup:false,
    scope:"read:user user:email"
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};

export const finishGithubLogin = (req, res) => {
  res.send("로그인됨!");
};

export const edit = (req, res) => res.send("Edit User");
export const remove = (req, res) => res.send("Remove User");
export const logout = (req, res) => res.send("Log out");
export const see = (req, res) => res.send("See User");