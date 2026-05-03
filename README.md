## Cipher Quest

Cipher Quest is a browser-based crypto escape room built with Next.js. Each level is a self-contained puzzle that tests classic security concepts (ciphers, modular arithmetic, brute force, and signature checks). A random question is selected when a level loads.

### Features

- 5-level escape room flow with gated progression
- 10-question bank per level, random question on load
- Dark hacker/terminal UI theme
- Progress tracker, timer, hints, and success screen

### Tech Stack

- Next.js (App Router)
- React + TypeScript
- Tailwind CSS (v4)
- Zustand (game state)
- Framer Motion (animations)
- CryptoJS (hashing)

### Project Structure

```
src/
	app/
		level-1/
		level-2/
		level-3/
		level-4/
		level-5/
		success/
	components/
	lib/
	store/
```

### How It Works

- Each level loads one random question from a 10-item bank.
- Solving the puzzle unlocks the next level.
- The game state starts fresh for every new session.