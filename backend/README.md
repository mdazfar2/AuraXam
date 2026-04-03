## Setup Instructions

1. **Install Dependencies**
   ```bash
   cd backend
   ```
   ```bash
   python -m venv .venv
   ```
   ```bash
   .\.venv\Scripts\activate
   ```
   ```bash
   pip install -r requirements.txt
   ```

2. **Configure Environment Variables**
   - Copy `.env.example` to `.env`


   - Configure [Google OAuth](https://www.youtube.com/watch?v=-vq32dsK_TI): `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`

   **Note**: For Gmail App Password: [Create App Pass](https://github.com/azfar-2/myself/blob/main/gmail_app_password.md).
   - Use that password in `.env`


   4. **Start the Backend Server**
   ```bash
   python app.py
   ```

   Backend Server will run on `http://localhost:8000`