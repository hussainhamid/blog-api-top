async function logOut(req, res) {
  res.json({ loggedOut: true, message: "user logged out" });
}

module.exports = {
  logOut,
};
