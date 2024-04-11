export const configLoad = () => {
  return {
    port: process.env.PORT,
    database_url: process.env.DATABASE_URL,
    jwt_secret: process.env.JWT_SECRET,
    client_url: process.env.CLIENT_URL,
    api_url: process.env.API_URL,
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      secret: process.env.GOOGLE_CLIENT_SECRET,
    },
  };
};