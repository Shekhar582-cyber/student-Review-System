export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'production'
    });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}