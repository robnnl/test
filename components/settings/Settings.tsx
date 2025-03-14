import React, { useState, FormEvent, ChangeEvent } from 'react';
import { User } from '../../types';

interface FormState {
  email: string;
  currentPassword: string;
  newPassword: string;
  inviteEmail: string;
}

const Settings: React.FC = () => {
  const [formData, setFormData] = useState<FormState>({
    email: '',
    currentPassword: '',
    newPassword: '',
    inviteEmail: ''
  });
  const [users, setUsers] = useState<User[]>([
    { email: 'admin@bedrijf.nl', role: 'admin' },
    { email: 'gebruiker@bedrijf.nl', role: 'standard' }
  ]);

  const handleChange = (field: keyof FormState) => 
    (e: ChangeEvent<HTMLInputElement>) => {
      setFormData(prev => ({
        ...prev,
        [field]: e.target.value
      }));
    };

  const handlePasswordChange = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Implementeer wachtwoord wijziging
  };

  const handleInviteUser = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Implementeer gebruiker uitnodigen
  };

  const handleUserChange = (user: User) => {
    setUsers((prev: User[]) => prev.map((u: User) => 
      u.id === user.id ? user : u
    ));
  };

  const handleDeleteUser = (userId: string) => {
    setUsers((prev: User[]) => prev.filter((u: User) => u.id !== userId));
  };

  return (
    <div className="settings">
      <h1>Instellingen</h1>
      
      <section>
        <h2>Profiel Instellingen</h2>
        <form onSubmit={handlePasswordChange}>
          <div className="form-group">
            <label>E-mailadres</label>
            <input
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
            />
          </div>
          <div className="form-group">
            <label>Huidig Wachtwoord</label>
            <input
              type="password"
              value={formData.currentPassword}
              onChange={handleChange('currentPassword')}
            />
          </div>
          <div className="form-group">
            <label>Nieuw Wachtwoord</label>
            <input
              type="password"
              value={formData.newPassword}
              onChange={handleChange('newPassword')}
            />
          </div>
          <button type="submit">Wijzigingen Opslaan</button>
        </form>
      </section>

      <section>
        <h2>Gebruikersbeheer</h2>
        <form onSubmit={handleInviteUser}>
          <div className="form-group">
            <label>Uitnodigen via E-mail</label>
            <input
              type="email"
              value={formData.inviteEmail}
              onChange={handleChange('inviteEmail')}
            />
            <select>
              <option value="standard">Standaard Gebruiker</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
          <button type="submit">Gebruiker Uitnodigen</button>
        </form>

        <div className="users-list">
          <h3>Huidige Gebruikers</h3>
          <table>
            <thead>
              <tr>
                <th>E-mail</th>
                <th>Rol</th>
                <th>Acties</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user: User) => (
                <tr key={user.email}>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <button onClick={() => handleDeleteUser(user.id)}>
                      Verwijderen
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Settings; 