import React from 'react'
import './social.css';
import Footer2 from "../Footer2/Footer2.jsx";
import { useEffect } from 'react';
import Navbar2 from '../navbar/Navbar2.jsx';
const Social = () => {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
              <Navbar2/>
    <div  className='whole'>
     
        <div className="parrot">
        <div className="social">
         <img src="https://live.staticflickr.com/65535/54022686631_301b3336e4_h.jpg" alt="" />
        </div>
        </div>
        <div className='packed'>
       <div className="card">
      <div className="imgbox" >
        <img 
          src="https://live.staticflickr.com/65535/53225579402_da49bc827c_c.jpg"
        />
      </div>

      <div className="content">
        <p className='tit'>UDAAN</p >
       <p className='udaan'>
        UDAAN is a social initiative by UDGHOSH, to celebrate the differently-abled children of god. UDGHOSH reveres the spirit of the children by organizing various activities, talks, games and friendly sports competitions wherein the children can enjoy themselves and savor sportsmanship.
        </p>

      </div>
    </div>
    <div className="card">
      <div className="imgbox">
        <img
          src="https://live.staticflickr.com/65535/52398183996_f8cb83a0c5.jpg"
        />
      </div>

      <div className="content">
        <p className='tit'>MARATHON</p >
        <p>
        The Udghosh family's marathon unites Kanpur residents and locals, spreading awareness about women's empowerment and girl child education, engaging both the community and city in these vital causes.
     </p> 
      </div>
    </div>

    </div>
    <div className='packed'>
    <div className="card">
      <div className="imgbox">
        <img
          src="https://live.staticflickr.com/65535/52397672797_2a584fc67e.jpg"
        />
      </div>

      <div className="content">
        <p className='tit'>BLOOD DONATION CAMP</p>
        <p>
        This Gandhi Jayanti, Udghosh stands proud to organize “ Blood Donation Camp”, in collaboration with Raktarpan. Make a difference on this day to become the hero society needs. Battle fears, take a leap, and give someone a chance at life by voluntarily donating blood.
        </p>
      </div>
    </div>
    <div className="card">
      <div className="imgbox">
        <img
          src="https://live.staticflickr.com/65535/52398183966_610f96d4e1.jpg"
        />
      </div>

      <div className="content">
        <p className='tit'>PLANTATION FOR DONATION</p>
        <p>
        We are continuing the legacy of Udghosh's renowned social efforts. Udghosh, IIT Kanpur is hosting a tree-planting event on campus titled "Plantation for Donation" to battle challenges such as deforestation and global warming while improving the area's aesthetic appeal and ecological stability.
        </p>
      </div>
      </div>
   
    </div>
    </div>
    <Footer2/>
    </>
  )
  
}

export default Social;

{/* <div className="main">

<!--cards -->

<div className="card">

<div className="image">
  <img className= "poc"src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Gfp-missouri-st-louis-clubhouse-pond-and-scenery.jpg/1199px-Gfp-missouri-st-louis-clubhouse-pond-and-scenery.jpg">
</div>
<div className="title">
<h1>
Write title Here</h1>
</div>
<div className="des">
<p>You can Add Desccription Here...</p>
<button>Read More...</button>
</div>
</div>
<!--cards -->


<div className="card">

<div className="image">
  <img className= "poc"src="https://cdn.pixabay.com/photo/2018/01/09/03/49/the-natural-scenery-3070808_1280.jpg">
</div>
<div className="title">
<h1>
Write title Here</h1>
</div>
<div className="des">
<p>You can Add Desccription Here...</p>
<button>Read More...</button>
</div>
</div>
<!--cards -->


<div className="card">

<div className="image">
  <img className= "poc"src="https://cdn.pixabay.com/photo/2015/11/07/11/41/lake-1031405_1280.jpg">
</div>
<div className="title">
<h1>
Write title Here</h1>
</div>
<div className="des">
<p>You can Add Desccription Here...</p>
<button>Read More...</button>
</div>
</div>
<!--cards -->


<div className="card">

<div className="image">
  <img className= "poc"src="https://cdn.pixabay.com/photo/2018/01/09/03/49/the-natural-scenery-3070808_1280.jpg">
</div>
<div className="title">
<h1>
Write title Here</h1>
</div>
<div className="des">
<p>You can Add Desccription Here...</p>
<button>Read More...</button>
</div>
</div>
<!--cards -->


<div className="card">

<div className="image">
  <img className= "poc"src="https://cdn.pixabay.com/photo/2018/01/09/03/49/the-natural-scenery-3070808_1280.jpg">
</div>
<div className="title">
<h1>
Write title Here</h1>
</div>
<div className="des">
<p>You can Add Desccription Here...</p>
<button>Read More...</button>
</div>
</div>
<!--cards -->

<div className="card">

<div className="image">
  <img className= "poc"src="https://cdn.pixabay.com/photo/2018/01/09/03/49/the-natural-scenery-3070808_1280.jpg">
</div>
<div className="title">
<h1>
Write title Here</h1>
</div>
<div className="des">
<p>You can Add Desccription Here...</p>
<button>Read More...</button>
</div>
</div>
<!--cards -->

<div className="card">

<div className="image">
  <img className= "poc"src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Gfp-missouri-st-louis-clubhouse-pond-and-scenery.jpg/1199px-Gfp-missouri-st-louis-clubhouse-pond-and-scenery.jpg">
</div>
<div className="title">
<h1>
Write title Here</h1>
</div>
<div className="des">
<p>You can Add Desccription Here...</p>
<button>Read More...</button>

</div>
</div>
<!--cards -->


<div className="card">

<div className="image">
  <img className= "poc"src="https://cdn.pixabay.com/photo/2018/01/09/03/49/the-natural-scenery-3070808_1280.jpg">
</div>
<div className="title">
<h1>
Write title Here</h1>
</div>
<div className="des">
<p>You can Add Desccription Here...</p>
<button>Read More...</button>
</div>
</div>
<!--cards -->


<div className="card">

<div className="image">
  <img className= "poc"src="https://cdn.pixabay.com/photo/2015/11/07/11/41/lake-1031405_1280.jpg">
</div>
<div className="title">
<h1>
Write title Here</h1>
</div>
<div className="des">
<p>You can Add Desccription Here...</p>
<button>Read More...</button>
</div>
</div>
</div> */}