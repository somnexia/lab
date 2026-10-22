# AGENTS.md

## Cursor Cloud specific instructions

### Architecture

This is a two-package monorepo (no monorepo tooling):

| Package | Path | Port | Stack |
|---------|------|------|-------|
| **Backend** | `server/` | 3000 | Express, Sequelize (MySQL), JWT auth |
| **Frontend** | `client/` | 3001 | React 18, Webpack, Bootstrap 5, SCSS |

### Database

- MySQL 8 required; database name is `lab`.
- Sequelize models connect via `server/config/config.json` using `root` with no password on `127.0.0.1`.
- The `.env` in `server/` defines `labuser`/`123456` but that is only checked by `validateEnv.js`; Sequelize models use `config.json` directly.
- The SQL dump at `server/config/lab.sql` is the most reliable way to seed the full schema + data. The Sequelize migrations have a known case-sensitivity bug (`Inventories` vs `inventories`) and the dump already has all migration tables pre-applied.
- The `logs` table is NOT in the SQL dump but is required by the app (user login/logout logging). Create it manually after importing the dump:

```sql
CREATE TABLE IF NOT EXISTS logs (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  action VARCHAR(255) NOT NULL,
  user_id INT DEFAULT NULL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  resource_type VARCHAR(255) DEFAULT NULL,
  resource_id INT DEFAULT NULL,
  description TEXT DEFAULT NULL,
  ip_address VARCHAR(255) DEFAULT NULL,
  user_agent VARCHAR(255) DEFAULT NULL,
  session_id VARCHAR(255) DEFAULT NULL,
  status VARCHAR(255) DEFAULT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL
);
```

### Starting MySQL

MySQL must be started manually in the Cloud VM (no systemd):

```bash
sudo mysqld --user=mysql --datadir=/var/lib/mysql --socket=/var/run/mysqld/mysqld.sock --pid-file=/var/run/mysqld/mysqld.pid &
```

Wait a few seconds, then verify with `sudo mysql -u root -e "SELECT 1;"`.

### Running the services

- **Backend**: `cd server && npm run dev` (runs `validateEnv.js` then `nodemon app.js`)
- **Frontend**: `cd client && npm run dev` (runs `webpack serve` on port 3001)

Both should run in separate terminals (use tmux sessions).

### Linting

- **Server**: No ESLint config exists; `npm run lint` will fail with "couldn't find a configuration file".
- **Client**: `npm run lint` works; uses `react-app` ESLint config from `package.json`. Expect ~170 pre-existing warnings (mostly `jsx-a11y/anchor-is-valid`), 1 pre-existing error.

### Building

- **Client**: `npm run build` runs `webpack --mode production` and outputs to `client/dist/`.
- **Server**: `npm run build` is a no-op placeholder (`echo`).

### Test accounts (from seed data)

- Email: `john.doe@example.com` — passwords are bcrypt-hashed in the dump; register a new account for testing instead.
- Registration endpoint: `POST /api/users` with `{name, email, password}`.
- Login endpoint: `POST /api/users/login` with `{email, password}`.

### Gotchas

- The `server/data/db.js` file creates a legacy MySQL pool pointing at database `courses` with `root`/`null`. This is loaded by `app.js` but only used by the legacy Handlebars SSR routes (`/courses`, `/card`, etc.), not by the React SPA API routes. It will produce harmless connection warnings if no `courses` database exists.
- The `client/.env` file is malformed (starts with `UBLIC_URL=/` instead of `PUBLIC_URL=/`). This doesn't affect webpack dev server since `publicPath` is set in `webpack.config.js`.
- The webpack dev server config has `open: true`; in a headless environment this will attempt to open a browser but fail silently.
