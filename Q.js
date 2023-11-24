// Description: Q-Learning 演算法的實現



// 生成初始迷宮 函數
function generateMaze(width, height) {
    // 初始化迷宮，所有格子初始為牆壁
    let maze = Array(height).fill(null).map(() => Array(width).fill(0));

    // DFS生成迷宮
    function carve(x, y) {
        const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];
        // 洗牌方向以保證隨機性
        directions.sort(() => Math.random() - 0.5);

        // 標記當前格子為通路
        maze[y][x] = 1;

        // 遍歷所有方向
        for (let [dx, dy] of directions) {
            const newX = x + dx * 2, newY = y + dy * 2;
            if (newX >= 0 && newY >= 0 && newX < width && newY < height && maze[newY][newX] === 0) {
                // 標記中間的格子為通路
                maze[y + dy][x + dx] = 1;
                // 遞歸到新格子
                carve(newX, newY);
            }
        }
    }

    // 從左上角開始生成迷宮
    carve(0, 0);

    // 確保入口和出口
    maze[0][0] = 1; // 入口
    maze[height - 1][width - 1] = 1; // 出口
    // 手動打開一條到出口的路径

    if (Math.round(Math.random()) === 0) {
        //确保最下方行的右二格也是通路
        if (width > 1) {
            maze[height - 1][width - 2] = 1;
        }
    } else {
        // 确保右下角上方的格子也是通路
        if (height > 1) {
            maze[height - 2][width - 1] = 1;
        }
    }

    return maze;
}

// renderMaze函數
function renderMaze(maze) {
    const root = document.getElementById('root');
    root.innerHTML = ''; // 清空root內容
    const table = document.createElement('table');
    for (let rowIndex = 0; rowIndex < maze.length; rowIndex++) {
        const tr = document.createElement('tr');
        for (let cellIndex = 0; cellIndex < maze[rowIndex].length; cellIndex++) {
            const td = document.createElement('td');
            const cell = maze[rowIndex][cellIndex];
            if (cell === 2) {
                td.style.backgroundColor = 'yellow';
            } else {
                td.style.backgroundColor = cell === 1 ? 'white' : 'black';
            }
            // 標示起點
            if (rowIndex === 0 && cellIndex === 0) {
                td.textContent = '始';
                td.style.backgroundColor = 'red';
            }
            // 標示終點（出口）
            if (rowIndex === maze.length - 1 && cellIndex === maze[rowIndex].length - 1) {
                td.textContent = '終';
                td.style.backgroundColor = 'green';
            }
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    root.appendChild(table);
}

// 定義迷宮的寬度和高度
const width = 10;
const height = 10;

// 定義行為 有四個移動方向，"up", "down", "left", "right"
const actions = ["up", "down", "left", "right"];

// 定義行為函數
function takeAction(state, action, maze) {
    let newState = state;
    let width = maze[0].length;
    let height = maze.length;
    if (action === "right" && state % width < width - 1 && maze[Math.floor(state / width)][state % width + 1] !== 0) {
        newState = state + 1; // 向右移動
    } else if (action === "left" && state % width > 0 && maze[Math.floor(state / width)][state % width - 1] !== 0) {
        newState = state - 1; // 向左移動
    } else if (action === "up" && Math.floor(state / width) > 0 && maze[Math.floor(state / width) - 1][state % width] !== 0) {
        newState = state - width; // 向上移動
    } else if (action === "down" && Math.floor(state / width) < height - 1 && maze[Math.floor(state / width) + 1][state % width] !== 0) {
        newState = state + width; // 向下移動
    }
    let reward = (newState === width * height - 1) ? 10 : 0; // 只有在最右下角的狀態時才給予獎勵
    return { newState, reward };
}

// 生成初始Q函數
function generateQTable(width, height) {
    let Q = {};
    for (let i = 0; i < width * height; i++) {
        Q[i] = {};
        for (let action of actions) {
            Q[i][action] = 0; // 初始化Q值為0
        }
    }
    return Q;
}

// Q 學習過程
// logTraining 函數 用於在頁面上顯示訓練過程
function logTraining(message) {
    let logElement = document.querySelector('pre.log'); // 獲取log元素
    logElement.textContent += message + '\n'; // 添加新的日誌信息
}

function qLearning(Q, maze, episodes, alpha=0.1, gamma=0.9, epsilon=0.1, reward=10) {
    let width = maze[0].length;
    let height = maze.length;
    for (let episode = 0; episode < episodes; episode++) {
        let state = 0; // 初始狀態
        while (state !== width * height - 1) {
            let action;
            if (Math.random() < epsilon) {
                action = actions[Math.floor(Math.random() * actions.length)]; // 隨機選擇行動
            } else {
                action = Object.keys(Q[state]).reduce((a, b) => Q[state][a] > Q[state][b] ? a : b); // 選擇Q值較高的行動
            }
            let { newState, reward } = takeAction(state, action, maze); // 根據當前狀態和行動獲取新的狀態和獎勵
            let maxQ = Math.max(...Object.values(Q[newState])); // 獲取新狀態下所有行動的最大Q值
            Q[state][action] = Q[state][action] + alpha * (reward + gamma * maxQ - Q[state][action]); // 更新Q值
            state = newState; // 移動到新狀態
        }
        document.querySelector('.message').textContent = `Q 學習完成，共進行了 ${episodes} 輪訓練`;
        logTraining(`${JSON.stringify(Q[0])}`); // 輸出更新後的Q值
    }
}


// 生成初始Q表
let Q = generateQTable(width, height);


// 生成迷宮
let maze = generateMaze(width, height);



// 讓機器人走迷宮
function walkMaze(Q, maze, callback, delay = 50) {
    let width = maze[0].length;
    let height = maze.length;
    let state = 0; // 起點
    let visited = new Set([0]); // 訪問過的狀態集合

    function step() {
        if (state === width * height - 1) {
            callback(maze); // 完成時調用回調函數
            return;
        }

        let action = Object.keys(Q[state]).reduce((a, b) => Q[state][a] > Q[state][b] ? a : b);
        let { newState } = takeAction(state, action, maze);

        // 標記新狀態為已訪問並檢查是否是新狀態
        if (!visited.has(newState)) {
            visited.add(newState);
            maze[Math.floor(newState / width)][newState % width] = 2; 
            state = newState; // 移動到新狀態
            callback(maze); // 更新迷宮視圖
            setTimeout(step, delay); // 設定下一步的延時
        } else {
            // 如果沒有新狀態可去，則停止
            return;
        }
    }

    step();
}


renderMaze(maze);

// 點擊按鈕 button.qLearning 執行 qLearning
document.querySelector('button.qLearning').addEventListener('click', function() {
    document.querySelector('.message').textContent = 'Q 正在努力學習中...';
    qLearning(Q, maze, 50);
});

// 點擊按鈕 button.walkMaze 執行 walkMaze
document.querySelector('button.walkMaze').addEventListener('click', function() {
    walkMaze(Q, maze, (updatedMaze) => {
        renderMaze(updatedMaze); // 重新渲染迷宮
    });
    Q = {}
});
