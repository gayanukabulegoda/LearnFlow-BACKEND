# Contributing to LearnFlow BACKEND

Thank you for considering contributing to **LearnFlow BACKEND**! We value your input and contributions, whether it's through bug reports, feature requests, documentation improvements, or code contributions.

This document outlines the guidelines and best practices for contributing to the project.

---

## How to Contribute

### 1. Fork the Repository
1. Navigate to the [LearnFlow BACKEND repository](https://github.com/gayanukabulegoda/LearnFlow-BACKEND).
2. Click the **Fork** button in the top right corner of the page.
3. Clone your fork locally:
   ```bash
   git clone https://github.com/<your-username>/LearnFlow-BACKEND.git
   cd LearnFlow-BACKEND
   ```

### 2. Set Up the Project
1. Install project dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file based on the `.env.example` file:
   ```bash
   cp .env.example .env
   ```
   Update the environment variables according to your local setup.

3. Initialize the database:
   ```bash
   npx prisma migrate dev
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

---

## Submitting Changes

### 1. Create a Branch
Create a new branch for your changes:
```bash
  git checkout -b feature/your-feature-name
```

### 2. Make Changes and Test
- Write clean, well-documented code.
- Follow the existing coding style and linting rules:
   ```bash
   npm run lint
   ```
- Test your changes thoroughly:
   ```bash
   npm run test
   ```

### 3. Commit Your Changes
Follow the [Conventional Commits](https://www.conventionalcommits.org) standard for commit messages:
```bash
  git commit -m "feat(core): add new feature to improve user authentication"
```

### 4. Push to Your Fork
Push your branch to your forked repository:
```bash
  git push origin feature/your-feature-name
```

### 5. Create a Pull Request
1. Go to the original repository.
2. Open a **Pull Request** from your branch.
3. Provide a clear and descriptive title.
4. Include a summary of the changes and any relevant issue numbers.

---

## Code Style Guidelines
Please follow these guidelines to maintain consistency:

✅ **Use TypeScript** for type safety and scalability.  
✅ Keep the code clean and modular.  
✅ Use `async/await` for asynchronous operations.  
✅ Follow the project’s existing folder and file structure.  
✅ Ensure functions are small, focused, and reusable.

---

## Reporting Issues
If you encounter a bug or have a feature request, you can open an issue:

1. Navigate to the [Issues](https://github.com/gayanukabulegoda/LearnFlow-BACKEND/issues) tab.
2. Click **New Issue**.
3. Use a good template:
    - **Bug Report** – for reporting bugs.
    - **Feature Request** – for suggesting new features.

---

## Contributor Recognition
We value all contributions! After your pull request is merged, you will be listed in the project’s **Contributors** section.

---

## Thank You!
Thank you for improving **LearnFlow BACKEND**! Your contributions make this project better and help learners succeed. 🙌

---

_Last updated: March 10, 2025_