# AuraXam Contributing Guidelines

Welcome to the **AuraXam** project! We're excited to have you here. Whether you're a seasoned developer or just getting started, your contributions are valuable and appreciated.


Please take a moment to read the following guidelines before contributing:

> **⚠️IMPORTANT**
>
> **Pull Requests _having no issue associated_ with them _will not be accepted_. Firstly get an issue assigned, whether it's already opened or raised by you, and then create a Pull Request.**
>
> **An automated process has been implemented to ensure the timely management of Pull Requests (PRs) on this platform.**
>
> **PRs that have been open for a duration exceeding 45 days will be automatically closed, so please plan accordingly.**
>
>**Additionally, PRs that are improperly linted or have a failing build will not be merged. Ensure that your code passes linting checks and builds successfully before submitting your PR.**

## Prerequisites

- Open Source Etiquette: If you've never contributed to an open source project before, have a read of [Basic etiquette](https://developer.mozilla.org/en-US/docs/MDN/Community/Open_source_etiquette) for open source projects.

- Basic familiarity with Git and GitHub: If you are also new to these tools, visit [GitHub for complete beginners](https://developer.mozilla.org/en-US/docs/MDN/Contribute/GitHub_beginners) for a comprehensive introduction to them.

---

## 📁 Project Structure

- `frontend/` – Contains all the code related to the user interface and website design.  
- `backend/` – This folder will be added later to handle all server-side logic (e.g., user registration, payments, admin panel, etc.).

## How to contribute

To get started, look at the existing [**create a new issue**](https://github.com/mdazfar2/AuraXam/issues)!

### Set up guildines


> [!NOTE]
> This is [MERN Stack](https://www.geeksforgeeks.org/mern-stack/) project.
> You must have installed Node.js on your local macahine. If you don't have it installed yet,                                                             
  We will recommend a video for you that you can view from [here](https://www.youtube.com/watch?v=8UwTd15dK-E).
> Make sure to restart your PC/Laptop after installation before proceeding to the next step.


## 🚀 Run the Project Locally

To run the project locally and start contributing:

- Clone the repo

```bash
git clone https://github.com/your-username/AuraXam.git
```
- Navigate to the frontend directory

```bash
cd frontend
```

- Install dependencies

```bash
npm install
```
- Start the development server

```bash
npm run dev
```

  - `Open http://localhost:5173 with your browser to see the result.`

## Now Instruction for Backend

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


- Create a new branch to make your changes.

```bash
   git checkout -b <your_branch_name>
```

- Do whatever you want to change and then stage your changes and track as well

---

- Track and stage your changes.

```bash
   # Track the changes
   git status

   # Add changes to Index
   git add .
```

- Commit your changes.

```bash
   git commit -m "your_commit_message"
```
- Push your committed changes to the remote repo.

```bash
   git push origin <your_branch_name>
```

- Go to your forked repository on GitHub and click on `Compare & pull request`.

- Add an appropriate title and description to your pull request explaining your changes and efforts done.

- Click on `Create pull request`.

- Congrats! 🥳 You've made your first pull request to this project repo.

   - ***Now, wait. If the maintainer finds your pull request correct and useful, they will surely merge it. If any changes are needed, they will mention you, so make sure to pay attention to GitHub notifications to know what the project admin wants.***

---


# 🔧 Want to Contribute to Backend?

If you’re here to contribute to backend integration, we’re super excited to have you! 🎉

> 🛠️ Kindly create a folder named `backend/` in the root directory of the project.  
Inside this folder, feel free to structure your backend code however you'd like (e.g., using **Node.js**, **Express**, **Firebase**, **Stripe** etc.).

**Thank you in advance** for laying the foundation of our backend - your contribution is highly appreciated! 💙

---

> 🙌 First-time contributors are always welcome!

### Guidelines for good commit message

1. **Be Concise and Descriptive**: Summarize the change in a way that’s easy to understand at a glance.
2. **Use the Imperative Mood**: Write as if giving a command (e.g., `Add`, `Fix`, `Update`), which is a convention in many projects.
3. **Include Context**: Provide context or reason for the change if it’s not immediately obvious from the summary.
4. **Reference Issues and Pull Requests**: Include `issue numbers` or PR references if the commit addresses them.
5. **Issue reference** (Optional): Include the issue number associated with the commit (e.g., `#123`).

## Reporting Issues

- Before submitting an issue, please search to ensure it has not already been reported.

- When creating a new issue, provide as much detail as possible, including:

1. The steps to reproduce the issue
2. What was expected to happen and what actually happened
3. Screenshots or logs, if applicable
4. Information about your environment (OS, browser, etc.)

### Feature Requests

- Feel free to open an issue to request a new feature.
- Provide as much context and detail as possible. Why is the feature important? How do you envision it being used?
- Consider outlining how you think the feature could be implemented.

> **⚠️IMPORTANT**
>
> **Pull Requests _having no issue associated_ with them _will not be accepted_. Firstly get an issue assigned, whether > it's already opened or raised by you, and then create a Pull Request.**
>
> **An automated process has been implemented to ensure the timely management of Pull Requests (PRs) on this platform.**
>
> **PRs that have been open for a duration exceeding 45 days will be automatically closed, so please plan accordingly.**
>
>**Additionally, PRs that are improperly linted or have a failing build will not be merged. Ensure that your code passes linting checks and builds successfully before submitting your PR.**

### Updating Documentation

- If you make changes to the code, please update relevant documentation (README.md etc.).
- Keep documentation clear, concise, and up-to-date.
