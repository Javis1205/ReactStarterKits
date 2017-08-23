export const connection = {
  dev: {
    username: "rudicaf",
    password: process.env.DB_PASS || "1qazxsw2",
    database: "datingapp",
    host: process.env.DB_SERVER || "127.0.0.1",
    autoIndex: false,
  },
  prod: {
    username: "rudicaf",
    password: process.env.DB_PASS,
    database: "rudicaf_datingapp",    
    host: process.env.DB_SERVER || "127.0.0.1",
    autoIndex: false,
  }
}
