# Sisyphus

A stripped-down Nuxt 3 LeetCode-style practice app with local progress tracking.

## What this includes
- Problem list and detail pages
- Built-in JS runner for test cases
- Progress persistence via MongoDB (Mongoose)

## Getting started
1. Install dependencies: `npm install`
2. Create a `.env` file with:

```env
MONGODB_URI="mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<db>?retryWrites=true&w=majority"
MONGODB_DB="main"
```

3. Run dev server: `npm run dev`

## Data sources
This app expects problems in `data/problems.json`. You can transform datasets like:
- https://huggingface.co/datasets/kaysss/leetcode-problem-set
- https://github.com/liquidslr/leetcode-company-wise-problems

For now, a small sample is included. Replace it with your own expanded set.

## Storage
The app uses MongoDB for progress + submissions. Progress records live in the
`sisyphus` collection and submissions are stored in `submissions`.
