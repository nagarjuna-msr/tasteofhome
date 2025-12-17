# Task: Deploy TasteOfHome V0 Storefront to Render

**Context:**
We are deploying the "TasteOfHome" V0 storefront. The codebase has been refactored to be **standalone** (Serverless). It does NOT require a Medusa backend connection. It relies on a Google Apps Script Webhook for lead collection.

**Objective:**
Deploy the `/storefront` directory to Render as a **Static Site** or **Node Service**.

## Deployment Steps (for Cursor Agent)

1.  **Repo Structure Check:**
    *   Verify you are in the root directory.
    *   The target directory to deploy is `storefront`.

2.  **Render Configuration:**
    *   **Service Type:** Web Service (Node.js) or Static Site (Next.js export).
    *   **Build Command:** `cd storefront && npm install && npm run build`
    *   **Start Command:** `cd storefront && npm run start`
    *   **Plan:** Free

3.  **Environment Variables (CRITICAL):**
    *   `NEXT_PUBLIC_GHEE_VIDEO_URL`: `/videos/ghee_video.mp4` (Ensure assets are copied).
    *   `NEXT_PUBLIC_GOOGLE_SCRIPT_URL`: `https://script.google.com/macros/s/AKfycbzZx3RhMuMcHn3DxMn8ueBRlThjvuKEg7cN5gtiQ-PgZ7ZtCWD2XjG6iduTucT0z8lh/exec`

4.  **Action:**
    *   Use your Render MCP tools to create/deploy this service.
    *   If Render MCP is not available, guide the user to push this repo to GitHub and connect it to Render manually.

**Note:** The backend (Medusa) is NOT required for this deployment. Ignore the `backend` folder.
