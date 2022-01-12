export default (req, res) => {
  if (!req.session.passport.user._doc._id.equals(req.params._id)) {
    return res.status(400).json({ error: "Unauthorized" });
  }
};
