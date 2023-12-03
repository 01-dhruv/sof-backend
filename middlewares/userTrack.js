import useragent from 'useragent';
import LoginHistory from '../models/LoginHistory.js';
import jwt from 'jsonwebtoken'

const userTrack = async (req, res, next) => {
  console.log('Middleware is invoked');
  try {
    const { ip, headers } = req;
    // const { userId: _id } = req.params;
    const userId = req.userId || 'UnknownUser'; // Provide a default value

    // const userId = req.session.passport.user.id || 'UnknownUser'; // Check if session.passport.user exists

    // console.log('finally', userId);  
    // const userId = req.userId || 'UnknownUser'; // Use req.userId set in the login controller
    // const userId = req.headers.authorization ? jwt.decode(req.headers.authorization.split(' ')[1]).id : 'UnknownUser';
   
    // console.log(userId)
    // const userId = req.result.id || 'UnknownUser';
    

    const userAgent = req.headers['user-agent'];
    // console.log(req)

    // Parse user agent to get system info, browser info, and device type
    const useragentInfo = useragent.parse(userAgent);
    const systemInfo = useragentInfo.os ? useragentInfo.os.toString() : 'Unknown OS';
    const browserInfo = useragentInfo.browser ? useragentInfo.browser.toString() : 'Unknown Browser';
    const deviceType = useragentInfo.isMobile ? 'Mobile' : 'Desktop';

    // Save login history to the database
    const loginHistory = new LoginHistory({
      userId: userId, // Assuming you have a user object in the request
      ipAddress: ip,
      userAgent: userAgent,
      systemInfo,
      browserInfo,
      deviceType,
    });

    // console.log('History', loginHistory);

    // Save to the database and wait for the operation to complete
    await loginHistory.save();

    next();
  } catch (error) {
    console.log(error);
    next(error); // Pass the error to the next middleware/handler
  }
};

export default userTrack;
