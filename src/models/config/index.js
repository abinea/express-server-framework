import config from "../../config/index.js"
const { db } = config
export default { [process.env.NODE_ENV || "development"]: db }
