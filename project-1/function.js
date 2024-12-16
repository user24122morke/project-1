export default async function handler(req, res) {
    const username = process.env.NEXT_PUBLIC_USERNAME;
    const password = process.env.NEXT_PUBLIC_PASSWORD;
  
    res.status(200).json({
      message: "Environment variables loaded successfully!",
      username,
      password,
    });
  }
  