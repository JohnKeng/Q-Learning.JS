# Q-Learning.JS
Description: Q-Learning 演算法的實現 - 迷宮範例 

## Overview
This project implements a Q-Learning algorithm to solve a maze. Q-Learning is a model-free reinforcement learning algorithm used to find an optimal action-selection policy in a Markov decision process. This implementation generates a random maze and uses Q-Learning to teach a virtual agent to navigate from the start to the end of the maze.

## Features
Maze Generation: Randomized maze creation using depth-first search.
Q-Learning Implementation: Includes functions for state-action value estimation and policy improvement.
Maze Navigation: Uses the learned policy to navigate the agent through the maze.

## How to Use
- Generate a Maze:
Use generateMaze(width, height) to create a new maze.
- Render the Maze:
Call renderMaze(maze) to display the maze in the HTML document.
- Train the Agent:
Use qLearning(Q, maze, episodes) to train the agent over a specified number of episodes.
- Navigate the Maze:
After training, use walkMaze(Q, maze, callback, delay) to navigate the maze.

## Implementation Details
```javascript
// Example usage of generateMaze and renderMaze
const width = 10;
const height = 10;
let maze = generateMaze(width, height);
renderMaze(maze);

// Example usage of qLearning
let Q = generateQTable(width, height);
qLearning(Q, maze, 50); // Train for 50 episodes

// Example usage of walkMaze
walkMaze(Q, maze, (updatedMaze) => {
    renderMaze(updatedMaze);
});
```





