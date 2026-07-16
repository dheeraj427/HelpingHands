const adminLogin = (req, res) => {
  const { username, password } = req.body;

  // Check the credentials we defined
  if (username === 'admin' && password === 'Viit@123') {
    return res.status(200).json({ success: true, message: 'Login successful' });
  }

  // If wrong, send an error
  return res.status(401).json({ success: false, message: '❌ Incorrect credentials. Try again.' });
};

module.exports = { adminLogin };