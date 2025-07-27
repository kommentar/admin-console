# Kommentar | Admin Console

The admin console is a dashboard of sorts, to help manage operations of your Kommentar instance.

Make sure to read the documentation for more information. [Documentation](https://docs.kommentar.dev)

## Running locally

To run the admin console locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/kommentar/admin-console.git
   ```

2. Install dependencies:
   ```bash
   cd admin-console
   pnpm install
   ```

3. Setup environment variables:
   ```bash
   cp .env.example .env
   # Edit .env file to set your environment variables
   ```

4. Start the server:
   ```bash
   pnpm start
   # OR
   pnpm dev
   ```
