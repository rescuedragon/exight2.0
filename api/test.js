module.exports = async function handler(req, res) {
  res.json({
    message: 'Test function working',
    timestamp: new Date().toISOString(),
    method: req.method
  });
} 