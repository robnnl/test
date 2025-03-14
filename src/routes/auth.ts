import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../server';
import { cookieOptions } from '../middleware/auth';

const router = Router();

router.post('/login', async (req, res) => {
  try {
    const { domain, email, password } = req.body;
    
    // Valideer input
    if (!domain || !email || !password) {
      return res.status(400).json({ error: 'Alle velden zijn verplicht' });
    }

    // Zoek gebruiker in database
    const userResult = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND domain = $2',
      [email, domain]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Ongeldige inloggegevens' });
    }

    const user = userResult.rows[0];

    // Controleer wachtwoord
    const validPassword = await bcrypt.compare(password, user.password);
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

    // Stuur token als cookie
    res.cookie('jwt', token, cookieOptions);
    
    // Stuur gebruikersgegevens terug (zonder wachtwoord)
    const { password: _, ...userWithoutPassword } = user;
    return res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

export default router; 