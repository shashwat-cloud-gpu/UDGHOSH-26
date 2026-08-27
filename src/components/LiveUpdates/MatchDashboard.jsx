import React, { useState, useEffect ,useRef} from 'react';
import axios from 'axios';
import './Arena.css';
import Navbar2 from '../navbar/Navbar2.jsx';
import Particles from './Particles/Particles.jsx'
// Sport icon Cloudinary URLs
const cricketIcon = 'https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/src/components/LiveUpdates/assets/icons/cricket';
const footballIcon = 'https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/src/components/LiveUpdates/assets/icons/football';
const badmintonIcon = 'https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/src/components/LiveUpdates/assets/icons/badminton';
const basketballIcon = 'https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/src/components/LiveUpdates/assets/icons/basketball';
const volleyballIcon = 'https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/src/components/LiveUpdates/assets/icons/volleyball';
const tabletennisIcon = 'https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/src/components/LiveUpdates/assets/icons/tabletennis';
const lawntennisIcon = 'https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/src/components/LiveUpdates/assets/icons/lawntennis';
const squashIcon = 'https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/src/components/LiveUpdates/assets/icons/squash';
const hockeyIcon = 'https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/src/components/LiveUpdates/assets/icons/hockey';
const kabaddiIcon = 'https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/src/components/LiveUpdates/assets/icons/kabaddi';
const khokhoIcon = 'https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/src/components/LiveUpdates/assets/icons/khokho';
const taekwondoIcon = 'https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/src/components/LiveUpdates/assets/icons/taekwondo';
const chessIcon = 'https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/src/components/LiveUpdates/assets/icons/chess';
const frisbeeIcon = 'https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/src/components/LiveUpdates/assets/icons/frisbee';



const SPORTS = [
  { value: 'cricket', label: 'Cricket', icon: cricketIcon },
  { value: 'football', label: 'Football', icon: footballIcon },
  { value: 'badminton', label: 'Badminton', icon: badmintonIcon },
  { value: 'basketball', label: 'Basketball', icon: basketballIcon },
  { value: 'volleyball', label: 'Volleyball', icon: volleyballIcon },
  { value: 'tabletennis', label: 'Table Tennis', icon: tabletennisIcon },
  { value: 'lawntennis', label: 'Lawn Tennis', icon: lawntennisIcon },
  { value: 'squash', label: 'Squash', icon: squashIcon },
  { value: 'hockey', label: 'Hockey', icon: hockeyIcon },
  { value: 'kabaddi', label: 'Kabaddi', icon: kabaddiIcon },
  { value: 'khokho', label: 'Kho Kho', icon: khokhoIcon },
  { value: 'taekwondo', label: 'Taekwondo', icon: taekwondoIcon },
  { value: 'chess', label: 'Chess', icon: chessIcon },
  { value: 'ultimatefrisbee', label: 'Frisbee', icon: frisbeeIcon }
];



const TABS = [
  { value: 'live', label: 'Live' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'timeline', label: 'Timeline' }
];



const normalizeSport = s =>
  s.toLowerCase().replace(/\s/g, '').replace(/-/g, '');



const API_URL = 'https://api.udghosh.org.in/api';



function formatDate(date) {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}



function formatTime(time) {
  return time?.slice(0, 5); // HH:mm
}



export default function MatchDashboard() {
  const [selectedSport, setSelectedSport] = useState('football');
  const [activeTab, setActiveTab] = useState('upcoming');
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const arenaWrapperRef=useRef(null);



  // Scrollbar drag-to-scroll feature (optional)
  useEffect(() => {
    const el = document.querySelector('.sport-scroll');
    let isDown = false, startX, scrollLeft;
    if (!el) return;
    el.addEventListener('mousedown', (e) => {
      isDown = true; el.classList.add('dragging');
      startX = e.pageX - el.offsetLeft;
      scrollLeft = el.scrollLeft;
    });
    el.addEventListener('mouseleave', () => { isDown = false; el.classList.remove('dragging'); });
    el.addEventListener('mouseup', () => { isDown = false; el.classList.remove('dragging'); });
    el.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      const walk = (x - startX) * 2;
      el.scrollLeft = scrollLeft - walk;
    });
    return () => {};
  }, []);



  // Pointer background glow effect
  useEffect(() => {
    const glow = document.getElementById('pointer-bg-glow');
    function moveBgGlow(e) {
      if (glow) {
        glow.style.left = `${e.clientX}px`;
        glow.style.top = `${e.clientY}px`;
      }
    }
    window.addEventListener('mousemove', moveBgGlow);
    return () => window.removeEventListener('mousemove', moveBgGlow);
  }, []);



  async function fetchMatches() {
    setLoading(true);
    try {
      let endpoint =
        activeTab === 'live'
          ? '/getLiveMatches'
          : activeTab === 'timeline'
          ? '/getCompletedMatches'
          : '/matches';
      const response = await axios.get(`${API_URL}${endpoint}`, {
        params: { sportTableName: normalizeSport(selectedSport), page: 1, limit: 20 }
      });
      setMatches(response.data.matches || []);
    } catch (error) {
      setMatches([]);
    } finally {
      setLoading(false);
    }
  }



  useEffect(() => { fetchMatches(); }, [selectedSport, activeTab]);



  // FOOTBALL/HOCKEY MATCH CARD (uses team1_goals and team2_goals)
  const renderGoalsBasedCard = (match) => (
    <div className="match-c" key={match.matchId}>
      <div className="match-c-top">
        <span className={`status-chip ${match.status?.toLowerCase()}`}>
          <span className={`status-dot ${match.status?.toLowerCase()}-dot`}></span> {match.status?.toUpperCase() || 'UPCOMING'}
        </span>
        <span className="comp-chip">{match.competition || match.category}</span>
      </div>
      <div className="match-c-center">
        <div className="team team-left">{splitLines(match.team1)}</div>
        <div className="mid-score-blk">
          {match.status === 'upcoming' ? (
            <>
              <span className="cricket-vs">vs</span>
              <div className="mid-time">{formatTime(match.time)}</div>
            </>
          ) : (
            <>
              <div className="mid-score">{match.team1_goals ?? 0} - {match.team2_goals ?? 0}</div>
              <div className="mid-time">{formatTime(match.time)}</div>
            </>
          )}
        </div>
        <div className="team team-right">{splitLines(match.team2)}</div>
      </div>
      <div className="match-c-bottom">
        <span className="venue-info">{match.venue}</span>
        <span className="date-box">{formatDate(match.date)}</span>
      </div>
      {activeTab === 'timeline' && match.winner && (
        <div className="winner-banner">Winner: {match.winner === 1 ? match.team1 : match.team2}</div>
      )}
    </div>
  );


  // BASKETBALL MATCH CARD (uses team1_score and team2_score)
  const renderBasketballCard = (match) => (
    <div className="match-c" key={match.matchId}>
      <div className="match-c-top">
        <span className={`status-chip ${match.status?.toLowerCase()}`}>
          <span className={`status-dot ${match.status?.toLowerCase()}-dot`}></span> {match.status?.toUpperCase() || 'UPCOMING'}
        </span>
        <span className="comp-chip">{match.competition || match.category}</span>
      </div>
      <div className="match-c-center">
        <div className="team team-left">{splitLines(match.team1)}</div>
        <div className="mid-score-blk">
          {match.status === 'upcoming' ? (
            <>
              <span className="cricket-vs">vs</span>
              <div className="mid-time">{formatTime(match.time)}</div>
            </>
          ) : (
            <>
              <div className="mid-score">{match.team1_score ?? 0} - {match.team2_score ?? 0}</div>
              <div className="mid-time">{formatTime(match.time)}</div>
            </>
          )}
        </div>
        <div className="team team-right">{splitLines(match.team2)}</div>
      </div>
      <div className="match-c-bottom">
        <span className="venue-info">{match.venue}</span>
        <span className="date-box">{formatDate(match.date)}</span>
      </div>
      {activeTab === 'timeline' && match.winner && (
        <div className="winner-banner">Winner: {match.winner === 1 ? match.team1 : match.team2}</div>
      )}
    </div>
  );



  // CRICKET MATCH CARD
  const renderCricketCard = (match) => (
    <div className="match-c" key={match.matchId}>
      <div className="match-c-top">
        <span className={`status-chip ${match.status?.toLowerCase()}`}>
          <span className={`status-dot ${match.status?.toLowerCase()}-dot`}></span> {match.status?.toUpperCase()}
        </span>
        <span className="comp-chip">{match.competition || match.category || "Series"}</span>
      </div>
      <div className="match-c-center cricket">
        <div className="cricket-team">{splitLines(match.team1)}</div>
        <div className="cricket-scorebox">
          {match.status === 'upcoming' ? (
            <>
              <span className="cricket-vs">vs</span>
            </>
          ) : (
            <>
              <div>
                {(match.team1_score ?? 0)}/{match.team1_wickets ?? 0}
                {match.team1_overs && <div className="cricket-overs">({match.team1_overs})</div>}
              </div>
              <span className="cricket-vs">vs</span>
              <div>
                {(match.team2_score ?? 0)}/{match.team2_wickets ?? 0}
                {match.team2_overs && <div className="cricket-overs">({match.team2_overs})</div>}
              </div>
            </>
          )}
        </div>
        <div className="cricket-team">{splitLines(match.team2)}</div>
      </div>
      <div className="match-c-bottom">
        <span className="venue-info">{match.venue}</span>
        <span className="date-box">{formatDate(match.date)}</span>
      </div>
      {activeTab === 'timeline' && match.winner && (
        <div className="winner-banner">Winner: {match.winner === 1 ? match.team1 : match.team2}</div>
      )}
    </div>
  );



  // SET-BASED SPORTS CARD (Volleyball, Table Tennis, Badminton, Lawn Tennis, Squash)
  const renderSetBasedCard = (match) => {
    const getActiveSets = () => {
      const sets = [];
      for (let i = 1; i <= 5; i++) {
        const score1 = match[`set${i}_score1`];
        const score2 = match[`set${i}_score2`];
        if (score1 !== 0 || score2 !== 0) {
          sets.push({ setNum: i, score1, score2 });
        }
      }
      return sets;
    };


    const activeSets = getActiveSets();
    const latestSet = match.active ? activeSets[match.active - 1] : activeSets[activeSets.length - 1];
    const teamOrPlayer1 = match.team1 || match.player1;
    const teamOrPlayer2 = match.team2 || match.player2;


    return (
      <div className="match-c" key={match.matchId}>
        <div className="match-c-top">
          <span className={`status-chip ${match.status?.toLowerCase()}`}>
            <span className={`status-dot ${match.status?.toLowerCase()}-dot`}></span> {match.status?.toUpperCase()}
          </span>
          <span className="comp-chip">{match.competition || match.category}</span>
        </div>
        <div className="match-c-center">
          <div className="team team-left">{splitLines(teamOrPlayer1)}</div>
          <div className="mid-score-blk">
            {match.status === 'upcoming' ? (
              <>
                <span className="cricket-vs">vs</span>
                <div className="mid-time">{formatTime(match.time)}</div>
              </>
            ) : activeTab === 'timeline' && activeSets.length > 0 ? (
              <div className="set-scores">
                {activeSets.map((set) => (
                  <div key={set.setNum} className="set-score-line">
                    Set {set.setNum}: {set.score1} - {set.score2}
                  </div>
                ))}
              </div>
            ) : latestSet ? (
              <>
                <div className="mid-score">
                  Set {latestSet.setNum}: {latestSet.score1} - {latestSet.score2}
                </div>
                <div className="mid-time">{formatTime(match.time)}</div>
              </>
            ) : (
              <>
                <div className="mid-score">0 - 0</div>
                <div className="mid-time">{formatTime(match.time)}</div>
              </>
            )}
          </div>
          <div className="team team-right">{splitLines(teamOrPlayer2)}</div>
        </div>
        <div className="match-c-bottom">
          <span className="venue-info">{match.venue}</span>
          <span className="date-box">{formatDate(match.date)}</span>
        </div>
        {activeTab === 'timeline' && match.winner && (
          <div className="winner-banner">Winner: {match.winner === 1 ? teamOrPlayer1 : teamOrPlayer2}</div>
        )}
      </div>
    );
  };


  // CHESS MATCH CARD
  const renderChessCard = (match) => {
    const player1 = match.player1 || match.team1;
    const player2 = match.player2 || match.team2;


    return (
      <div className="match-c" key={match.matchId}>
        <div className="match-c-top">
          <span className={`status-chip ${match.status?.toLowerCase()}`}>
            <span className={`status-dot ${match.status?.toLowerCase()}-dot`}></span> {match.status?.toUpperCase()}
          </span>
          <span className="comp-chip">{match.competition || match.category}</span>
        </div>
        <div className="match-c-center">
          <div className="team team-left">{splitLines(player1)}</div>
          <div className="mid-score-blk">
            <span className="cricket-vs">vs</span>
            <div className="mid-time">{formatTime(match.time)}</div>
          </div>
          <div className="team team-right">{splitLines(player2)}</div>
        </div>
        <div className="match-c-bottom">
          <span className="venue-info">{match.venue}</span>
          <span className="date-box">{formatDate(match.date)}</span>
        </div>
        {activeTab === 'timeline' && match.winner && (
          <div className="winner-banner">Winner: {match.winner === 1 ? player1 : player2}</div>
        )}
      </div>
    );
  };


  // TAEKWONDO MATCH CARD (uses player1_points and player2_points)
  const renderTaekwondoCard = (match) => {
    const player1 = match.player1 || match.team1;
    const player2 = match.player2 || match.team2;

    return (
      <div className="match-c" key={match.matchId}>
        <div className="match-c-top">
          <span className={`status-chip ${match.status?.toLowerCase()}`}>
            <span className={`status-dot ${match.status?.toLowerCase()}-dot`}></span> {match.status?.toUpperCase()}
          </span>
          <span className="comp-chip">{match.competition || match.category}</span>
        </div>
        <div className="match-c-center">
          <div className="team team-left">{splitLines(player1)}</div>
          <div className="mid-score-blk">
            {match.status === 'upcoming' ? (
              <>
                <span className="cricket-vs">vs</span>
                <div className="mid-time">{formatTime(match.time)}</div>
              </>
            ) : (
              <>
                <div className="mid-score">{match.player1_points ?? 0} - {match.player2_points ?? 0}</div>
                <div className="mid-time">{formatTime(match.time)}</div>
              </>
            )}
          </div>
          <div className="team team-right">{splitLines(player2)}</div>
        </div>
        <div className="match-c-bottom">
          <span className="venue-info">{match.venue}</span>
          <span className="date-box">{formatDate(match.date)}</span>
        </div>
        {activeTab === 'timeline' && match.winner && (
          <div className="winner-banner">Winner: {match.winner === 1 ? player1 : player2}</div>
        )}
      </div>
    );
  };


  // POINTS-BASED SPORTS CARD (Ultimate Frisbee, Kabaddi, Kho Kho) - uses team1_points and team2_points
  const renderPointsBasedCard = (match) => (
    <div className="match-c" key={match.matchId}>
      <div className="match-c-top">
        <span className={`status-chip ${match.status?.toLowerCase()}`}>
          <span className={`status-dot ${match.status?.toLowerCase()}-dot`}></span> {match.status?.toUpperCase()}
        </span>
        <span className="comp-chip">{match.competition || match.category}</span>
      </div>
      <div className="match-c-center">
        <div className="team team-left">{splitLines(match.team1)}</div>
        <div className="mid-score-blk">
          {match.status === 'upcoming' ? (
            <>
              <span className="cricket-vs">vs</span>
              <div className="mid-time">{formatTime(match.time)}</div>
            </>
          ) : (
            <>
              <div className="mid-score">{match.team1_points ?? 0} - {match.team2_points ?? 0}</div>
              <div className="mid-time">{formatTime(match.time)}</div>
            </>
          )}
        </div>
        <div className="team team-right">{splitLines(match.team2)}</div>
      </div>
      <div className="match-c-bottom">
        <span className="venue-info">{match.venue}</span>
        <span className="date-box">{formatDate(match.date)}</span>
      </div>
      {activeTab === 'timeline' && match.winner && (
        <div className="winner-banner">Winner: {match.winner === 1 ? match.team1 : match.team2}</div>
      )}
    </div>
  );



  // Helper: multiline names
  function splitLines(name) {
    if (!name) return "TBA";
    return name.split(' ').map((n,i) => <span key={i}>{n}<br/></span>);
  }



  // Choose card type
  const renderCard = (match) => {
    const sport = normalizeSport(selectedSport);
    switch (sport) {
      case "cricket":   
        return renderCricketCard(match);
      case "football":
      case "hockey":
        return renderGoalsBasedCard(match);
      case "basketball":
        return renderBasketballCard(match);
      case "volleyball":
      case "tabletennis":
      case "badminton":
      case "lawntennis":
      case "squash":
        return renderSetBasedCard(match);
      case "chess":
        return renderChessCard(match);
      case "taekwondo":
        return renderTaekwondoCard(match);
      case "ultimatefrisbee":
      case "kabaddi":
      case "khokho":
        return renderPointsBasedCard(match);
      default:          
        return renderBasketballCard(match);
    }
  };



  return (
    <div className="arena-wrapper" ref={arenaWrapperRef}>
    <div className="arena-root">
      <div className='particles-bg'>
        <Particles 
         particleColors={['#ED9B1C','#ED9B1C']}
         particleCount={2000}
            particleSpread={10}
            speed={0.2}
            particleBaseSize={100}
            moveParticlesOnHover={true}
            alphaParticles={false}
            disableRotation={false}
            mouseTarget={arenaWrapperRef.current}
          />
      </div>
      {/* Pointer-following background glow */}
      {/* <div className="pointer-bg-glow" id="pointer-bg-glow"></div> */}
      <div><Navbar2 /></div>
      {/* ---- Scrollable Sport Navbar ---- */}
      <div className="sport-navbar">
        <div className="sport-scroll">
          {SPORTS.map(({ value, label, icon }) => (
            <button
              key={value}
              className={`sport-nav-btn ${selectedSport === value ? 'active' : ''}`}
              onClick={() => setSelectedSport(value)}
            >
              <img src={icon} alt={label} className="sport-icon-img"/>
              <span className="sport-name">{label}</span>
            </button>
          ))}
        </div>
      </div>
      {/* ---- Tabs ---- */}
      <div className="center-tabs">
        <div className="tab-group">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              className={`center-tab-btn ${activeTab === tab.value ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.value)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      {/* ---- Matches ---- */}
      <div className="matches-section">
        {loading ? (
          <div className="loading">Loading matches...</div>
        ) : matches.length === 0 ? (
          <div className="no-matches-card">No matches found</div>
        ) : (
          <div className="matches-grid">
            {matches.map((match) => renderCard(match))}
          </div>
        )}
      </div>
    </div>
    </div>
  );
}
