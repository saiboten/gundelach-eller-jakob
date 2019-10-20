import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { Howl } from 'howler';

const gunSounds = [];
const jakobSounds = [];

for(let i=1; i<=34;i++) {
  gunSounds.push(new Howl({
    src: [`gun${i}.mp3`],
    preload: false
  }));
  jakobSounds.push(new Howl({
    src: [`jakob${i}.mp3`],
    preload: false
  }));
}

const GlobalStyle = createGlobalStyle`

    @font-face {
        font-family: 'super_plumber_brothersregular';
        src: url('super_plumber_brothers.woff2') format('woff2'),
            url('super_plumber_brothers.woff') format('woff');
        font-weight: normal;
        font-style: normal;
    }

    html {
      background-color: #6F86FF;
      color: white;
      font-family: 'super_plumber_brothersregular', Arial, sans-serif;
      font-size: 2.8rem;
    }

    button {
      border: none;
      margin: 0;
      padding: 0;
      width: auto;
      overflow: visible;
      background: transparent;
      color: inherit;
      font: inherit;
      line-height: normal;
      -webkit-font-smoothing: inherit;
      -moz-osx-font-smoothing: inherit;
      -webkit-appearance: none;
    }
`

const ImageContainer = styled('div')`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr;
  grid-column-gap: 1rem;
`;

const Image = styled('img')`
  width: 100%;
  height: 100%;
`;

const ImageButton = styled('button')`
  transform: ${props => !props.isSelected || "scale(10)"};
  opacity: ${props => !props.isSelected || "0"};
  -webkit-shape-outside: circle(50% at 50% 50%);
  shape-outside: circle(50% at 50% 50%);
  clip-path: circle(50% at 50% 50%);

  transition: 0.3s all;

  &:hover {
    transform: ${props => !props.isSelected ? "scale(1.1)" : "scale(10)"};
  }
`;

const Wrapper = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const Header = styled.header`
  font-size: 1.6rem;
  text-align: center;
  margin-bottom: 1rem;
  margin-top: 1rem;
`;

const AnswerWrapper = styled.div`
  transition: all .6s;
  opacity: ${({ isSelected }) => isSelected ? '1': '0'};
  z-index: ${({ isSelected }) => isSelected ? '5': '-1'};
  position: fixed;
  height: 100vh;
  width: 100vw;
  top: 0;
  left: 0;
  background-color: #6F86FF;
`;

const Answer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  text-align: center;
`;

const StartGameButton = styled.button`
  transition: all .5s;
  border: 5px solid black;
  border-radius: 20px;
  padding: 0.3rem;

  &:hover {
    color: yellow;
    transform: scale(1.1);
    
  }
`;

function App() {

  const [gundelach, setGundelach] = useState(false);
  const [jakob, setJakob] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [heardQuiz, setHeardQuiz] = useState(false);
  const [answer, setAnswer] = useState(undefined);
  const [audio, setAudio] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [quizCounter, setQuizCounter] = useState(0);
  const [correctCounter, setCorrectCounter] = useState(0);

  function setupNewQuiz() {
    const who = Math.floor(Math.random()*2);
    if(who === 0) {
      setAnswer("gun");
      setAudio(gunSounds[Math.floor(Math.random()*gunSounds.length)]);
      
    } else {
      setAnswer("jakob");
      setAudio(jakobSounds[Math.floor(Math.random()*jakobSounds.length)]);
    }
  }

  useEffect(() => {
    setupNewQuiz();
  }, []);

  function playAudio() {
    if(playing) {
      return;
    }

    setLoading(true);
    setPlaying(true);
    setHeardQuiz(true);
    audio.load();
    audio.play(); 
    audio.on('load', () => {
      setLoading(false)
    });

    audio.on('end', function(){
      setPlaying(false);
    });
  }
  
  function giveAnswer(isGundelach) {
    if(!heardQuiz) return;
    
    isGundelach ? setGundelach(true) : setJakob(true);
    if((answer === "gun" && isGundelach) || (answer === "jakob" && !isGundelach)) {
      setCorrectCounter(correctCounter+1);
    }
    setQuizCounter(quizCounter+1);
    setPlaying(false);
    audio.stop();
  }
  
  
  function resetState() {
    setGundelach(false);
    setJakob(false);
    setAnswer(undefined);
    setHeardQuiz(false);
    setupNewQuiz();
  }

  return (
    <Wrapper>
      <GlobalStyle />
      <AnswerWrapper isSelected={gundelach || jakob}>
        <Answer>
          <div style={{ marginBottom: "1rem", padding: "0 0.5rem" }}>{ (answer === "gun" && gundelach) && <div>Ja, det var Gundelach!</div> }
          { (answer === "gun" && jakob) && <div>Beklager, det var Gundelach!</div> }
          { (answer === "jakob" && jakob) && <div>Ja, det var Jakob!</div> }
          { (answer === "jakob" && gundelach) && <div>Beklager, det var Jakob!</div> }
          </div>
          <StartGameButton onClick={resetState}>Ny quiz</StartGameButton>
        </Answer>
      </AnswerWrapper>
      <Header>
        Gundelach eller Jakob?
      </Header>
      <section>
      <ImageContainer>
        <ImageButton isSelected={gundelach} onClick={() => giveAnswer(true)}>
          <Image src="/gundelach.png" alt="Gundelach" />
        </ImageButton>
        <ImageButton isSelected={jakob}  onClick={() => giveAnswer(false)}>
          <Image src="/jakob.png" alt="Jakob" />
          </ImageButton>
        </ImageContainer>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center"}}>
          <StartGameButton onClick={playAudio}>{ loading ? 'Laster ' : 'Spill'}</StartGameButton>
        </div>
      </section>
      {quizCounter > 0 && <div>Score: {correctCounter}/{quizCounter}</div>}
    </Wrapper>
  );
}

export default App;
