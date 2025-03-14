import express from 'express';
import { pool } from '../server';
import { AuthRequest } from '../middleware/auth';
import { validateApiCredentials } from '../services/apiValidation';

const router = express.Router();

// API Credentials endpoints
router.post('/credentials', async (req: AuthRequest, res) => {
  const { platform, apiKey, apiSecret, accountName, extraFields } = req.body;
  const organizationId = req.user!.organizationId;

  try {
    const result = await pool.query(
      `INSERT INTO api_configurations 
       (organization_id, platform, api_key, api_secret, account_name, extra_fields)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [organizationId, platform, apiKey, apiSecret, accountName, extraFields]
    );

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('API credentials error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/validate-credentials', async (req: AuthRequest, res) => {
  const { platform, apiKey, apiSecret } = req.body;

  try {
    const isValid = await validateApiCredentials(platform, apiKey, apiSecret);
    res.json({ success: isValid });
  } catch (error) {
    res.status(400).json({ error: 'Ongeldige credentials' });
  }
});

export default router; 