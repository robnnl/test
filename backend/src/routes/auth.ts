import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../server';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { domain, email, password } = req.body;

  try {
    // Zoek organisatie
    const orgResult = await pool.query(
      'SELECT id FROM organizations WHERE domain = $1',
      [domain]
    );

    if (orgResult.rows.length === 0) {
      return res.status(401).json({ error: 'Ongeldige inloggegevens' });
    }

    const organizationId = orgResult.rows[0].id;

    // Zoek gebruiker
    const userResult = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND organization_id = $2',
      [email, organizationId]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Ongeldige inloggegevens' });
    }

    const user = userResult.rows[0];

    // Verifieer wachtwoord
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Ongeldige inloggegevens' });
    }

    // Genereer JWT token
    const token = jwt.sign(
      { 
        id: user.id,
        email: user.email,
        organizationId: user.organization_id,
        role: user.role
      },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    // Zet token in HTTP-only cookie
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 uur
    });

    res.json({
      success: true,
      user: {
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router; 