import User  from '../models/user.model.js';
import bcrypt from 'bcryptjs';


const signUpUser = async(req,res) => {
    const { username, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if(existingUser) {
            return res.status(400).json({ msg: 'User alredy exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });

        await newUser.save();
        res.status(201).json({ msg: 'User created successfully' });
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

const logInUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Send userId along with the success message
        res.json({ msg: 'Login successful', userId: user._id });

    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server error');
    }
};


// Logout function: Just return a success message, client-side will handle localStorage clearing
const logoutUser = (req, res) => {
    res.status(200).json({ message: 'Logout successful' });
};




export { signUpUser, logInUser, logoutUser};