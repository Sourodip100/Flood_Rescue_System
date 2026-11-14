import jwt from "jsonwebtoken";

export function getUser(request){
    const token = request.cookies.get("token")?.value;
    if (!token) {
        return null;
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    }
    catch (error) {
        return null;
    }
}
export function setUser(userId, role, response){
    const token = jwt.sign({ userId, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
    response.cookies.set("token", token);
}