module.exports = async () => {
  // Set to UTC so timezone differences between local and CI environments don't cause problems
  process.env.TZ = "UTC"
}
