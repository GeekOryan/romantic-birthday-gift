import React, { useState, useEffect, useRef } from 'react';
import { MarshmallowData } from './MarshmallowData.jsx';
import './App.css';

function App() {
  const [currentStage, setCurrentStage] = useState('welcome');
  const [inputName, setInputName] = useState('');
  const [quizQuestionIndex, setQuizQuestionIndex] = useState(0);
  const [qualityCardIndex, setQualityCardIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [showFwMeQuestion, setShowFwMeQuestion] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
  const [wrongButtonClicks, setWrongButtonClicks] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const audioRef = useRef(null);

  // Start romantic music when page loads - ONE SOUNDTRACK ONLY
  useEffect(() => {
    const romanticMusic = "./music/Rema- Soundgasm (official audio).mp3"; // Single soundtrack
    if (audioRef.current) {
      audioRef.current.src = romanticMusic;
      audioRef.current.volume = 0.7;
      audioRef.current.play()
        .then(() => setIsMusicPlaying(true))
        .catch(error => {
          console.log("Auto-play prevented, user will start manually");
        });
    }
  }, []);

  // Add keyboard support for quality cards
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (currentStage === 'qualities') {
        if (e.key === 'ArrowRight' && qualityCardIndex < MarshmallowData.positiveQualities.length - 1) {
          handleNextQuality();
        }
        
        if (e.key === 'ArrowLeft' && qualityCardIndex > 0) {
          setQualityCardIndex(prev => prev - 1);
        }
        
        if (e.key === ' ' || e.key === 'Enter') {
          handleCardFlip();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStage, qualityCardIndex, isFlipped]);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    
    if (isMusicPlaying) {
      audioRef.current.pause();
      setIsMusicPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsMusicPlaying(true))
        .catch(error => {
          console.log("Play failed:", error);
        });
    }
  };

  const handleNameSubmit = (e) => {
    e.preventDefault();
    const normalizedInput = inputName.trim().toLowerCase();
    
    if (normalizedInput === "marshmallow" || 
        normalizedInput === "marshmellow" ||
        normalizedInput.includes("marshmallow") ||
        normalizedInput.includes("marshmellow")) {
      setCurrentStage('quizIntro');
    } else {
      alert("Try again, my love. Remember the sweet name I call you by... 💖");
      setInputName('');
    }
  };

  const startQuiz = () => {
    setCurrentStage('quiz');
  };

  const handleQuizAnswer = (selectedIndex) => {
    if (selectedIndex === MarshmallowData.quizQuestions[quizQuestionIndex].correctAnswer) {
      setQuizScore(prev => prev + 1);
    }

    if (quizQuestionIndex < MarshmallowData.quizQuestions.length - 1) {
      setQuizQuestionIndex(prev => prev + 1);
    } else {
      setQuizCompleted(true);
      setTimeout(() => {
        setShowFwMeQuestion(true);
      }, 2000);
    }
  };

  const handleWrongButtonClick = () => {
    setWrongButtonClicks(prev => prev + 1);
    const randomX = Math.random() * 300 - 150;
    const randomY = Math.random() * 200 - 100;
    setButtonPosition({ x: randomX, y: randomY });
  };

  const handleCorrectButtonClick = () => {
    setShowFwMeQuestion(false);
    setCurrentStage('qualities');
  };

  const handleCardFlip = () => {
    if (isFlipping) return;
    setIsFlipping(true);
    setIsFlipped(!isFlipped);
    setTimeout(() => {
      setIsFlipping(false);
    }, 600);
  };

  const handleNextQuality = () => {
    if (isFlipping) return;
    
    setIsFlipping(true);
    
    // Always flip back to front first
    setIsFlipped(false);
    
    // Wait for flip animation to complete, then advance
    setTimeout(() => {
      if (qualityCardIndex < MarshmallowData.positiveQualities.length - 1) {
        setQualityCardIndex(prev => prev + 1);
      } else {
        setCurrentStage('finale');
      }
      setIsFlipping(false);
    }, 600);
  };

  const handleDotNavigation = (index) => {
    if (isFlipping) return;
    setQualityCardIndex(index);
    // Always reset to front when navigating via dots
    if (isFlipped) {
      setIsFlipped(false);
    }
  };

  const restartExperience = () => {
    setCurrentStage('welcome');
    setInputName('');
    setQuizQuestionIndex(0);
    setQualityCardIndex(0);
    setQuizScore(0);
    setQuizCompleted(false);
    setShowFwMeQuestion(false);
    setWrongButtonClicks(0);
    setButtonPosition({ x: 0, y: 0 });
    setIsFlipping(false);
    setIsFlipped(false);
    
    if (audioRef.current) {
      audioRef.current.currentTime = 0; // Restart from beginning
      audioRef.current.play().catch(console.log);
    }
  };

  return (
    <div className="App">
      <audio
        ref={audioRef}
        loop
        onEnded={() => setIsMusicPlaying(false)}
        onPause={() => setIsMusicPlaying(false)}
      />

      {/* Music Controls - Simplified */}
      <div className="global-music-controls">
        <button onClick={toggleMusic} className="music-btn">
          {isMusicPlaying ? '⏸️ Pause Music' : '▶️ Play Music'}
        </button>
        <span className="music-status">
          {isMusicPlaying ? '🎵 Music playing' : '⏸️ Music paused'}
        </span>
      </div>

      {/* STAGE 1: Romantic Welcome */}
      {currentStage === 'welcome' && (
        <div className="welcome-container slide-in">
          <div className="welcome-content">
            <div className="welcome-hero">
              <img 
                src="/marshmallow-photos/IMG-20251101-WA0009.jpg" 
                alt="Beautiful Marshmallow" 
                className="welcome-hero-image"
              />
              <div className="welcome-hero-overlay">
                <h1 className="romantic-title">A Birthday Journey Just For You 💖</h1>
                <p className="romantic-subtitle">My beautiful love...My Soft Marshmallow, get ready for a special adventure made just for your heart</p>
              </div>
            </div>
            
            <div className="love-features">
              <div className="love-feature">
                <span className="feature-emoji">🎵</span>
                <span>Romantic music playing in the background</span>
              </div>
              <div className="love-feature">
                <span className="feature-emoji">💭</span>
                <span>Mind-reading challenge</span>
              </div>
              <div className="love-feature">
                <span className="feature-emoji">🌸</span>
                <span>10 reasons my heart is yours</span>
              </div>
              <div className="love-feature">
                <span className="feature-emoji">🎂</span>
                <span>Your birthday surprise</span>
              </div>
            </div>
            <button onClick={() => setCurrentStage('nameInput')} className="romantic-btn">
              Begin Our Journey →
            </button>
          </div>
        </div>
      )}

      {/* STAGE 2: Name Verification */}
      {currentStage === 'nameInput' && (
        <div className="name-container slide-in">
          <div className="name-content">
            <h2>First things first My Love...Happy Birthday, I wish you so many more years to come. 
              May you live a prosperous and fruitful life, filled with happiness, 
              good health, great wealth and a sense of fulfilment in every single thing that you set your mind out to do.💞🎉🎂🥳</h2>
            <p>Now...I will need you to enter the sweet name that I call you by:</p>
            <form onSubmit={handleNameSubmit}>
              <input
                type="text"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                placeholder="Type the name I call you..."
                autoFocus
                className="romantic-input"
              />
              <button type="submit" className="romantic-btn">
                This Is Me!!! 💖
              </button>
            </form>
          </div>
        </div>
      )}

      {/* STAGE 3: Quiz Introduction */}
      {currentStage === 'quizIntro' && (
        <div className="quiz-intro-container slide-in">
          <div className="quiz-intro-content">
            <h1>Let's See How Well We Know Each Other's Hearts 💭</h1>
            <p>Our romantic music continues while we test our connection</p>
            <div className="quiz-rules">
              <p>🎯 10 questions about what you think I think</p>
              <p>💫 No pressure, just for fun my love</p>
              <p>🎵 Romantic music playing in the background</p>
            </div>
            <button onClick={startQuiz} className="romantic-btn">
              Start Our Mind-Reading Challenge 💖
            </button>
          </div>
        </div>
      )}

      {/* STAGE 4: Quiz */}
      {currentStage === 'quiz' && (
        <div className="quiz-container slide-in">
          <div className="quiz-header">
            <h2>Our Mind Connection Test 💫</h2>
            <p>What do you think I would say about you?</p>
            <div className="quiz-progress">
              <span>Question {quizQuestionIndex + 1} of {MarshmallowData.quizQuestions.length}</span>
              <span>Score: {quizScore} / {MarshmallowData.quizQuestions.length}</span>
            </div>
          </div>

          {!quizCompleted ? (
            <div className="question-container">
              <h3>{MarshmallowData.quizQuestions[quizQuestionIndex].question}</h3>
              <div className="options-grid">
                {MarshmallowData.quizQuestions[quizQuestionIndex].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuizAnswer(index)}
                    className="option-btn"
                    data-option={String.fromCharCode(65 + index)}
                  >
                    <span className="option-text">{option}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="quiz-result">
              {quizScore >= 7 ? (
                <div className="quiz-pass">
                  <h1>🎉 We're So Connected! 🎉</h1>
                  <p>You got {quizScore} out of {MarshmallowData.quizQuestions.length} correct!</p>
                  <p>Our hearts are definitely in sync, my love 💖</p>
                  <div className="loading-spinner"></div>
                  <p className="transition-text">Preparing something special for your heart...</p>
                </div>
              ) : (
                <div className="quiz-fail">
                  <h1>😱 Babe, Seriously?! 😱</h1>
                  <p>You only got {quizScore} out of {MarshmallowData.quizQuestions.length} correct... </p>
                  <p>Do you even pay attention when I'm talking about you? 🙄</p>
                  <div style={{margin: '20px 0', fontSize: '1.2em'}}>
                    <p>Don't worry, I still love you... even if you don't know me that well! 😂</p>
                  </div>
                  <div className="loading-spinner"></div>
                  <p className="transition-text">Moving on to show you what I REALLY think about you...</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* "You FW Me" Question Section */}
      {showFwMeQuestion && (
        <div className="fw-me-question-container">
          <div className="fw-me-content">
            <h2>Wait... Before We Continue... 🧐</h2>
            <p>Am I the sweetest boyfriend on planet Earth😭</p>
            
            <div className="fw-me-buttons">
              <button 
                className="correct-fw-btn romantic-btn"
                onClick={handleCorrectButtonClick}
              >
                Of course, you are! 💖
              </button>
              
              <button 
                className="wrong-fw-btn"
                onClick={handleWrongButtonClick}
                style={{
                  transform: `translate(${buttonPosition.x}px, ${buttonPosition.y}px)`,
                  transition: 'transform 0.5s ease'
                }}
              >
                Mmmmh, Maybe, Maybe not😭
              </button>
            </div>
            
            {wrongButtonClicks > 0 && (
              <div className="teasing-message">
                <p>😂 Really? After {wrongButtonClicks} tries you still don't think I am?</p>
                <p>Just click the other button, my love! 💕</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* STAGE 5: Flip Animation Quality Cards */}
      {currentStage === 'qualities' && (
        <div className="qualities-container">
          <div className="qualities-progress">
            <span>Reason {qualityCardIndex + 1} of {MarshmallowData.positiveQualities.length}</span>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${((qualityCardIndex + 1) / MarshmallowData.positiveQualities.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Navigation Dots */}
          <div className="quality-dots">
            {MarshmallowData.positiveQualities.map((_, index) => (
              <div
                key={index}
                className={`quality-dot ${index === qualityCardIndex ? 'active' : ''} ${index < qualityCardIndex ? 'visited' : ''}`}
                onClick={() => handleDotNavigation(index)}
              />
            ))}
          </div>

          {/* Flip Animation Card */}
          <div className="flip-card-container">
            <div 
              className={`flip-card ${isFlipped ? 'flipped' : ''}`}
              onClick={handleCardFlip}
            >
              <div className="flip-card-inner">
                {/* FRONT SIDE */}
                <div className="flip-card-front">
                  <div className="card-image-container">
                    <img 
                      src="/marshmallow-photos/IMG-20251101-WA0009.jpg" 
                      alt={MarshmallowData.positiveQualities[qualityCardIndex].title}
                      className="card-hero-image"
                      onError={(e) => {
                        e.target.src = "/marshmallow-photos/IMG-20251101-WA0009.jpg";
                      }}
                    />
                  </div>
                  <div className="flip-card-content">
                    <div className="quality-number">
                      Reason {qualityCardIndex + 1} of {MarshmallowData.positiveQualities.length}
                    </div>
                    <div className="quality-emoji-front">
                      {MarshmallowData.positiveQualities[qualityCardIndex].emoji}
                    </div>
                    <h2 className="quality-title-front">
                      {MarshmallowData.positiveQualities[qualityCardIndex].title}
                    </h2>
                    <div className="quality-description">
                      {MarshmallowData.positiveQualities[qualityCardIndex].description}
                    </div>
                    <div className="tap-hint">
                      💫 Tap to see something sweet about this quality →
                    </div>
                  </div>
                </div>

                {/* BACK SIDE */}
                <div className="flip-card-back">
                  <div className="card-image-container">
                    <img 
                      src="/marshmallow-photos/IMG-20251101-WA0009.jpg" 
                      alt={MarshmallowData.positiveQualities[qualityCardIndex].title}
                      className="card-hero-image"
                      onError={(e) => {
                        e.target.src = "/marshmallow-photos/IMG-20251101-WA0009.jpg";
                      }}
                    />
                  </div>
                  <div className="flip-card-content">
                    <div className="quality-emoji-back">
                      {MarshmallowData.positiveQualities[qualityCardIndex].backEmoji}
                    </div>
                    <h3 className="quality-title-back">
                      Even More Beautiful...
                    </h3>
                    <div className="quality-back-content">
                      {MarshmallowData.positiveQualities[qualityCardIndex].backContent}
                    </div>
                    <button 
                      className="next-quality-hint" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNextQuality();
                      }}
                    >
                      {qualityCardIndex < MarshmallowData.positiveQualities.length - 1 
                        ? 'See Next Beautiful Quality →' 
                        : 'See Your Final Surprise →'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="qualities-instruction">
            <p>💖 Tap card to flip and see sweet compliments</p>
            <p>🌸 Use dots above to navigate between qualities</p>
            <p>🎵 Romantic music playing in the background</p>
          </div>
        </div>
      )}

      {/* STAGE 6: Final Birthday Message */}
      {currentStage === 'finale' && (
        <div className="finale-container slide-in">
          <div className="finale-content">
            <div className="birthday-header">
              <h1>🎂 Happy Birthday, My Beautiful Marshmallow! 🎂</h1>
              <div className="heart-rain">💖🌸💖🌸💖</div>
            </div>

            <div className="all-qualities-summary">
              <h3>Your 10 Magical Qualities That Stole My Heart:</h3>
              <div className="qualities-grid">
                {MarshmallowData.positiveQualities.map((quality, index) => (
                  <div key={index} className="quality-badge">
                    <span className="badge-emoji">{quality.emoji}</span>
                    <span className="badge-title">{quality.title}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="final-love-note">
              <p>Thank you for being the amazing woman you are.</p>
              <p>You are kind and you give me grace in ways that remind me what real love looks like even on my rough days. You meet me with understanding instead of judgment. I'm proud of you. Proud of the kind of woman you are becoming. Watching you continue to grow into this beautiful and admirable woman is something special. The way you handle challenges, keep faith and never stop trying to better yourself is simply inspirational. It is crazy how you don't even realize how much light you bring into my world. I am grateful for you every single day.</p>
              <p className="signature">Forever Yours and Happy Birthday My Love.💖</p>
            </div>

            <button onClick={restartExperience} className="romantic-btn">
              Relive Our Journey Again 💫
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;