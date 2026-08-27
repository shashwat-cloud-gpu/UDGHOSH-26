import React from 'react'
import "./antique.css";
import Footer2 from "../Footer2/Footer2.jsx";
import Navbar2 from '../navbar/Navbar2.jsx';
const Antique = () => {
  return (
    <>
              <Navbar2/>
    
    <div className='all'>
      
    <div className='antiq'>
      <div className='topBackground'></div>
      <img src="https://live.staticflickr.com/65535/53237208035_48d580a227_b.jpg" className='antiq-back-img'/>
      
      <h3 className='headed'>Enduring Legacy</h3>
      <div className="contender">
        <ul>
        <li>
                <span className='titler'>
                The Colosseum's Conquest, 19th Edition
                </span>
                <p>
                Udghosh'23, themed “THE COLOSSEUM'S CONQUEST” is ready to take forward the legacy to be the flag bearer of intercollegiate sports and is all set to commence on October 6 amidst an electrifying buzz among the college community across the country.
             </p>
                <span className='circle'></span>
                <span className='date'>October, 2023</span>
            </li>
        <li>
                <span className='titler'>
                The Paladin's Imperium, 18th Edition
                </span>
                <p>
                The 2022 edition invited Dronacharya award recipient and formal chief national coach, Mr. Vimal Kumar, on the occasion of teacher’s day.Other fun events like Freestyle Football and MTV hustle graced by famous names such as Shlovij, KhullarG, and Prakhar Gupta. 
                EDM night by a renowned DJ to blend heart-pounding music with crazy dance moves.
             </p>
                <span className='circle'></span>
                <span className='date'>October, 2022</span>
            </li>

            <li>
                <span className='titler'>
                The Phoenix's Desideratum, 17th Edition
                </span>
                <p>
                The 2021 edition witnessed some great events and inspiring talks by even greater personalities such as Avadh Ojha, Prakash Padukone, Kiran Bedi, Sangeeta Sindhi Bahl, Sharad Kumar.
             </p>
                <span className='circle'></span>
                <span className='date'>April, 2021</span>
            </li>
            <li>
                <span className='titler'>
                   Morior Invictus, 16th Edition
                </span>
                <p>
                Udghosh 2019 organises 22 sports events with a huge participation of both boys and girls from over 200 colleges across the country. To provide talent the right push forward with elements of inspiration, Udghosh also plays host to some of the most renowned sports personalities. 
                </p>
                <span className='circle'></span>
                <span className='date'>September, 2019</span>
            </li>
            <li>
                <span className='titler'>
                    Chants Of Cachet, 15th Edition
                </span>
                <p>The 2018 edition of udghosh saw various mind-boggling performances, including standups by Nishant Tanwar and Aakash Gupta.
                </p>
                <span className='circle'></span>
                <span className='date'>October, 2018</span>
            </li>
            <li>
                <span className='titler'>
                  Mayhem For Victory, 14th Edition
                </span>
                <p>
                The 2017 edition was one of its kind, had registered great events and even greater personalities, such as an inspiring talk by Abhinav Bindra. Also had participation from Gaurav Taneja and sports personalities such as Nuzhat Parween.
                </p>

                <span className='circle'></span>
                <span className='date'>October, 2017</span>
            </li>
            
        </ul>
      </div>
    </div>
    <Footer2/>
     </div>

     </>
  )
}

export default Antique
