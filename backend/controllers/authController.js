exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Create admin user if it's the special email
    const role = email === 'vijaykarthik2512@gmail.com' ? 'admin' : 'user';
    
    const user = new User({
      email,
      password,
      role
    });
    
    await user.save();
    
    // Generate token for immediate login if needed
    const token = generateToken(user);
    
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};