import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinus, faPause, faPlay, faPlus, faSync } from '@fortawesome/free-solid-svg-icons'
import React from 'react';

const audio = document.getElementById('beep');

class App extends React.Component {
  state = {
    breakCount: 5,
    sessionCount: 25,
    clockCount: 25 * 60,
    currentTimer: 'Session',
    isPlaying: false
  }

  constructor(props) {
    super(props);
    this.loop = undefined;
    this.audioRef = React.createRef();
  }

  componentWillUnmount() {
    clearInterval(this.loop);
  }

  handlePlayPause = () => {
    const { isPlaying } = this.state;

    if(isPlaying) {
      clearInterval(this.loop);
      this.setState({
        isPlaying: false
      });
    } else {
      this.setState({
        isPlaying: true
      });

      this.loop = setInterval(() => {
        const { 
          clockCount, 
          currentTimer, 
          breakCount, 
          sessionCount 
        } = this.state;

        if(clockCount === 0) {
          this.setState({
            currentTimer: (currentTimer === 'Session') ? 'Break' : 'Session',
            clockCount: (currentTimer === 'Session') ? (breakCount * 60) : (sessionCount * 60)
          });

          this.audioRef.current.play();
        } else {
          this.setState({
            clockCount: clockCount - 1
          });
        }
      }, 1000);
    }
  }

  handleReset = () => {
    this.setState ({
      breakCount: 5,
      sessionCount: 25,
      clockCount: 25 * 60,
      currentTimer: 'Session',
      isPlaying: false
    });

    clearInterval(this.loop);

    this.audioRef.current.pause();
    this.audioRef.current.currentTime = 0;
  }

  convertToTime = (count) => {
    let minutes = Math.floor(count / 60);
    let seconds = count % 60;

    minutes = minutes < 10 ? ('0'+minutes) : minutes;
    // if seconds are less than 10, add a leading zero
    seconds = seconds < 10 ? ('0'+seconds) : seconds;

    return `${minutes}:${seconds}`;
  }

  handleBreakDecrease = () => {
    const { breakCount } = this.state;

    if(breakCount > 1) {
      this.setState({
        breakCount: breakCount - 1
      });
    }
  }

  handleBreakIncrease = () => {
    const { breakCount } = this.state;

    if(breakCount < 60) {
      this.setState({
        breakCount: breakCount + 1
      });
    }
  }

  handleSessionDecrease = () => {
    const { sessionCount, clockCount } = this.state;

    if(sessionCount > 1) {
      this.setState({
        sessionCount: sessionCount - 1,
        clockCount: clockCount - (1 * 60)
      });
    }
  }

  handleSessionIncrease = () => {
    const { sessionCount, clockCount } = this.state;

    if(sessionCount < 60) {
      this.setState({
        sessionCount: sessionCount + 1,
        clockCount: clockCount + (1 * 60)
      });
    }
  }
  
  render() {
    const { 
      breakCount, 
      sessionCount, 
      clockCount, 
      currentTimer,
      isPlaying 
    } = this.state;

    const breakProps = {
      title: 'Break',
      count: breakCount,
      handleDecrease: this.handleBreakDecrease,
      handleIncrease: this.handleBreakIncrease
    }

    const sessionProps = {
      title: 'Session',
      count: sessionCount,
      handleDecrease: this.handleSessionDecrease,
      handleIncrease: this.handleSessionIncrease
    }

    return (
      <div>
          <div className='main-title'>
            Boho's Pomodoro Clock
          </div>
          <div className='flex'>
            <SetTimer {...breakProps} />
            <SetTimer {...sessionProps} />
          </div>

          <div className='clock-container'>
            <h1 id="timer-label">{currentTimer}</h1>
            <span id="time-left">{this.convertToTime(clockCount)}</span>

            <div className='flex'>
            <audio src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav" id="beep" ref={this.audioRef}></audio>
              <button id="start_stop" onClick={this.handlePlayPause}>
                {/* change icon for play or pause depending on whether the clock is running */}
                {isPlaying ? <FontAwesomeIcon icon={faPause} /> : <FontAwesomeIcon icon={faPlay} />}
              </button>
              <button id="reset" onClick={this.handleReset}>
                <FontAwesomeIcon icon={faSync} />
              </button>
            </div>
          </div>
      </div>);
  }
}

const SetTimer = (props) => {
  const id = props.title.toLowerCase();
  return (
    <div className='timer-container'>
      <h2 id={`${id}-label`}>
        {props.title} Length
      </h2>
      <div className='flex actions-wrapper'>
        <button id={`${id}-decrement`} onClick={props.handleDecrease}>
          <FontAwesomeIcon icon={faMinus} />
        </button>

        <span id={`${id}-length`}>{props.count}</span>
        
        <button id={`${id}-increment`} onClick={props.handleIncrease}>
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>
    </div>
  );
}

export default App;
