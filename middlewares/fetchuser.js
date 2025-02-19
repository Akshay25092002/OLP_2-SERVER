import jwt from 'jsonwebtoken';
//const JWT_SECRET = process.env.JWT_SECRET;

const fetchuser = (req, res, next) => {
    const JWT_SECRET = process.env.JWT_SECRET;
    //get the userId data from jwt token- verify it, & add userId data to the req obj.

    const token = req.header('auth-token');

    if (!token) {
        return res.status(401).send({ error: "Pleaase add the autheticate token." });
    }

    try {
        const data = jwt.verify(token, JWT_SECRET); // we get data
        req.user = data.user; // we get userId data

        next();

    } catch (error) {
        return res.status(401).send({ error: "Please autheticate using valid token." });
    }

}

export default fetchuser;

export const isInstructor = (req, res, next) => {
    try {
        if (req.user.role !== "Instructor")
            return res.status(403).json({ message: "You are not an Instructor." })

        next();
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server error occured.")
    }
}

export const isAdmin = (req, res, next) => {
    try {

        if (req.user.role !== "admin")
            return res.status(403).json({ message: "You are not an admin." });

        next();
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server error occured.");
    }
}

