import LoginHistory from '../models/LoginHistory.js';

export const getLoginHistory = async (req, res) => {
  try {
    const history = await LoginHistory.find(); // Adjust this query based on your schema and requirements
    res.json(history);
    // console.log('newest', history)
  } catch (error) {
    console.error('Error fetching login history:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
