import './App.css';
import { useState, useEffect} from 'react'
function App() {
  const { innerWidth: width, innerHeight: height } = window;
  const [board, setBoard] = useState(null);
  const [direction,setDirection] = useState('none');
  const [speed,setSpeed] = useState(30);
  const [started,setStarted] = useState(false);
  const [is_gameOver,gameOver] = useState(false);
  const snakeFirstPosition = [{x:5,y:4},{x:5,y:3},{x:5,y:2},{x:5,y:1}];
  const [snake,setSnake] = useState(snakeFirstPosition);
  const [food,setFood] = useState(null);
  const [maxScore,setMaxScore] = useState(0);
  const [currentScore,setCurrentScore] = useState(0);

  const boxSizePx = 20;
  const horizontalLimit = 1000/boxSizePx;
  const verticalLimit =  800/boxSizePx;

  const setup= () => {
    const boxes = [];
    for (let i = 0; i < horizontalLimit*verticalLimit; i++) {
      boxes.push({cls:'box', id: i});
    }

    snake.forEach( item => {
      const index = item.x * horizontalLimit + item.y;
      boxes[index].cls = 'box red';
    });
    setBoard(boxes);
  };

  const stopIfCollisionDetected=()=>{
    const x = snake[0].x
    const y = snake[0].y
    if(x>=verticalLimit || x<0  || y>=horizontalLimit || y<0) {
      setSnake(snakeFirstPosition);
      setStarted(false);
      gameOver(true);
      return true;
    }
    return false;
  }

  const move = () =>{
    if(!board || !started){
      return;
    }
    const boxess = [...board];
    const last_item = snake[snake.length-1];
    let index = last_item.x * horizontalLimit + last_item.y;
    if (index < 0 || index >= boxess.length) return;
    boxess[index].cls = 'box'; 
    
    for(let i=snake.length-1; i>0;i--) {
      snake[i] = {...snake[i-1]}
    }
    
    switch(direction){
      case "ArrowRight":
        snake[0] = {x: snake[0].x, y: snake[0].y + 1 };
        break;
      case "ArrowLeft":
        snake[0] = {x: snake[0].x, y: snake[0].y - 1 };
        break;
      case "ArrowUp":
        snake[0] = {x: snake[0].x - 1, y: snake[0].y };
        break;
      case "ArrowDown":
        snake[0] = {x: snake[0].x + 1, y: snake[0].y };
        break;
      default:
        break;
    }

    index = snake[0].x * horizontalLimit + snake[0].y;
    if(!stopIfCollisionDetected()) {
      boxess[index].cls = 'box red';
      if(index == food) {
         snake.push( {...snake[snake.length-1]});
         //setSnake(snake);
         setFood(null);
         feedSnake();
         setCurrentScore(currentScore+1);
      }
      setBoard(boxess);
    }
  };

  const handleDirectionChange = (event) => {
    const new_key = event.key;
    if(!started && !is_gameOver) setStarted(true);

    if(new_key == "ArrowRight" &&  direction == "ArrowLeft") return;
    if(new_key == "ArrowLeft" &&  direction == "ArrowRight") return;
    if(new_key == "ArrowUp" &&  direction == "ArrowDown") return;
    if(new_key == "ArrowDown" &&  direction == "ArrowUp") return;

    setDirection(event.key);
  };

  const feedSnake=()=>{
    if(!board) return;
    const index = Math.floor(Math.random() * board.length-5)+2;
    setFood(index);
  }

  useEffect(()=>{
    setup();
  },[]);

  
  useEffect(()=>{
    if(!food) return;
    board[food].cls = 'food box';
  },[food]);

  useEffect(()=>{
    if(is_gameOver){
      setDirection("none");
      setup();
      gameOver(false);
      if(currentScore>maxScore)
        setMaxScore(currentScore);
      setCurrentScore(0);
    }
  },[is_gameOver]);

  useEffect(()=>{
    feedSnake();
  },[started]);

  useEffect(()=>{
    window.addEventListener('keydown', handleDirectionChange);
    if(started)
      var intervalid = setInterval(() => {
        move();
      }, speed);

    return () => {
      clearInterval(intervalid);
      window.removeEventListener('keydown', handleDirectionChange);
    }
  },[speed,direction,board]);

  return (
    <div className="App" >
      <div className="board">
        <div className="box-container">
          {board && board.map((item) => <div className={item.cls} key={item.id} ></div> )}
        </div>
        <div className="scoreboard">
          <h1>SCORE BOARD</h1>
          <h2>Max score: {maxScore}</h2>
          <h2>Your score:{currentScore}</h2>
        </div>
      </div>
      
    </div>
  );
}

export default App;
