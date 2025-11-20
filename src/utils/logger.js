const logger = (req, res, next) => {
  const now = new Date().toISOString();
  console.log(
    `[${now}] ${req.originalUrl} \x1b[1m\x1b[94m${req.method}\x1b[0m`
  );
  next();
};

module.exports = logger;
