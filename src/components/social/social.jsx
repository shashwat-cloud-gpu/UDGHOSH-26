import React, { useEffect, useRef } from "react";
import Navbar2 from "../navbar/Navbar2.jsx";
import Footer2 from "../Footer2/Footer2.jsx";
import "./social.css";

const initiativesData = [
  {
    id: "udaan",
    title: "Udaan",
    image: "https://live.staticflickr.com/65535/53225579402_da49bc827c_b.jpg",
    description:
      "UDAAN is a social initiative by UDGHOSH, to celebrate the differently-abled children of god. UDGHOSH reveres the spirit of the children by organizing various activities, talks, games and friendly sports competitions wherein the children can enjoy themselves and savor sportsmanship.",
    aspectRatio: "700/525",
  },
  {
    id: "marathon",
    title: "Marathon",
    image: "https://live.staticflickr.com/65535/52398183996_f8cb83a0c5_b.jpg",
    description:
      "The Udghosh family's marathon unites Kanpur residents and locals, spreading awareness about women's empowerment and girl child education, engaging both the community and city in these vital causes.",
    aspectRatio: "700/460",
  },
  {
    id: "blood-donation",
    title: "Blood Donation",
    image: "https://live.staticflickr.com/65535/52397672797_2a584fc67e_b.jpg",
    description:
      "This Gandhi Jayanti, Udghosh stands proud to organize a Blood Donation Camp, in collaboration with Raktarpan. Make a difference on this day to become the hero society needs. Battle fears, take a leap, and give someone a chance at life.",
    aspectRatio: "600/450",
  },
  {
    id: "plantation",
    title: "Plantation",
    image: "https://live.staticflickr.com/65535/52398183966_610f96d4e1_b.jpg",
    description:
      "We are continuing the legacy of Udghosh's renowned social efforts. Udghosh, IIT Kanpur is hosting a tree-planting event on campus titled 'Plantation for Donation' to battle challenges such as deforestation and global warming.",
    aspectRatio: "600/500",
  },
];

const Social = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    // Math helpers
    const MathUtils = {
      map: (x, a, b, c, d) => ((x - a) * (d - c)) / (b - a) + c,
      lerp: (a, b, n) => (1 - n) * a + n * b,
      getRandomFloat: (min, max) => (Math.random() * (max - min) + min).toFixed(2),
    };

    let winsize = { width: window.innerWidth, height: window.innerHeight };
    const calcWinsize = () => (winsize = { width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", calcWinsize);

    let docScroll = window.pageYOffset || document.documentElement.scrollTop;
    let lastScroll = docScroll;
    let scrollingSpeed = 0;
    
    const getPageYScroll = () => {
      docScroll = window.pageYOffset || document.documentElement.scrollTop;
    };
    window.addEventListener("scroll", getPageYScroll);

    class Item {
      constructor(el) {
        this.DOM = { el: el };
        this.DOM.image = this.DOM.el.querySelector(".content__item-img");
        this.DOM.imageWrapper = this.DOM.image.parentNode;
        this.DOM.el.style.perspective = "1000px";
        this.DOM.imageWrapper.style.transformOrigin = "50% 100%";
        this.ry = MathUtils.getRandomFloat(-0.5, 0.5);
        this.rz = MathUtils.getRandomFloat(-0.5, 0.5);
        this.DOM.title = this.DOM.el.querySelector(".content__item-title");
        this.DOM.title.style.transform = "translate3d(0,0,200px)";
        
        this.renderedStyles = {
          innerTranslationY: {
            previous: 0,
            current: 0,
            ease: 0.1,
            setValue: () => {
              const toValue = parseInt(getComputedStyle(this.DOM.image).getPropertyValue("--overflow"), 10) || 40;
              const fromValue = -1 * toValue;
              return Math.max(
                Math.min(
                  MathUtils.map(this.props.top - docScroll, winsize.height, -1 * this.props.height, fromValue, toValue),
                  toValue
                ),
                fromValue
              );
            },
          },
          itemRotation: {
            previous: 0,
            current: 0,
            ease: 0.1,
            toValue: Number(MathUtils.getRandomFloat(-70, -50)),
            setValue: () => {
              const toValue = this.renderedStyles.itemRotation.toValue;
              const fromValue = toValue * -1;
              const val = MathUtils.map(
                this.props.top - docScroll,
                winsize.height * 1.5,
                -1 * this.props.height,
                fromValue,
                toValue
              );
              return Math.min(Math.max(val, toValue), fromValue);
            },
          },
        };

        this.getSize();
        this.update();

        this.observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => (this.isVisible = entry.intersectionRatio > 0));
        });
        this.observer.observe(this.DOM.el);
      }

      update() {
        for (const key in this.renderedStyles) {
          this.renderedStyles[key].current = this.renderedStyles[key].previous = this.renderedStyles[key].setValue();
        }
        this.layout();
      }

      getSize() {
        const rect = this.DOM.el.getBoundingClientRect();
        this.props = {
          height: rect.height,
          top: docScroll + rect.top,
        };
      }

      resize() {
        this.getSize();
        this.update();
      }

      render() {
        for (const key in this.renderedStyles) {
          this.renderedStyles[key].current = this.renderedStyles[key].setValue();
          this.renderedStyles[key].previous = MathUtils.lerp(
            this.renderedStyles[key].previous,
            this.renderedStyles[key].current,
            this.renderedStyles[key].ease
          );
        }
        this.layout();
      }

      layout() {
        this.DOM.image.style.transform = `translate3d(0,${this.renderedStyles.innerTranslationY.previous}px,0)`;
        this.DOM.imageWrapper.style.transform = `rotate3d(1,${this.ry},${this.rz},${this.renderedStyles.itemRotation.previous}deg)`;
      }
    }

    class SmoothScroll {
      constructor(container) {
        this.DOM = { main: container };
        this.DOM.scrollable = this.DOM.main.querySelector("div[data-scroll]");
        this.items = [];
        this.DOM.content = this.DOM.main.querySelector(".content");
        if (this.DOM.content) {
          [...this.DOM.content.querySelectorAll(".content__item")].forEach((item) =>
            this.items.push(new Item(item))
          );
        }

        this.renderedStyles = {
          translationY: {
            previous: 0,
            current: 0,
            ease: 0.1,
            setValue: () => docScroll,
          },
        };

        this.setSize();
        this.update();
        this.style();
        this.initEvents();
        this.rAF = requestAnimationFrame(() => this.render());
      }

      update() {
        for (const key in this.renderedStyles) {
          this.renderedStyles[key].current = this.renderedStyles[key].previous = this.renderedStyles[key].setValue();
        }
        this.layout();
      }

      layout() {
        this.DOM.scrollable.style.transform = `translate3d(0,${-1 * this.renderedStyles.translationY.previous}px,0)`;
      }

      setSize() {
        if (this.DOM.scrollable) {
           document.body.style.height = `${this.DOM.scrollable.scrollHeight}px`;
        }
      }

      style() {
        this.DOM.main.style.position = "fixed";
        this.DOM.main.style.width = "100%";
        this.DOM.main.style.height = "100%";
        this.DOM.main.style.top = "0";
        this.DOM.main.style.left = "0";
        this.DOM.main.style.overflow = "hidden";
        // To allow the background image to remain behind, make main transparent
        this.DOM.main.style.background = "transparent";
      }

      initEvents() {
        this.onResize = () => this.setSize();
        window.addEventListener("resize", this.onResize);
      }

      render() {
        scrollingSpeed = Math.abs(docScroll - lastScroll);
        lastScroll = docScroll;

        for (const key in this.renderedStyles) {
          this.renderedStyles[key].current = this.renderedStyles[key].setValue();
          this.renderedStyles[key].previous = MathUtils.lerp(
            this.renderedStyles[key].previous,
            this.renderedStyles[key].current,
            this.renderedStyles[key].ease
          );
        }

        this.layout();

        for (const item of this.items) {
          if (item.isVisible) {
            if (item.insideViewport) {
              item.render();
            } else {
              item.insideViewport = true;
              item.update();
            }
          } else {
            item.insideViewport = false;
          }
        }

        this.rAF = requestAnimationFrame(() => this.render());
      }
      
      destroy() {
        window.removeEventListener("resize", this.onResize);
        cancelAnimationFrame(this.rAF);
        this.items.forEach(item => {
           if (item.observer) item.observer.disconnect();
        });
      }
    }

    let scrollInstance = null;
    
    // Slight delay to allow DOM/images to paint before calculating heights
    const initTimer = setTimeout(() => {
       scrollInstance = new SmoothScroll(containerRef.current);
    }, 100);

    return () => {
      clearTimeout(initTimer);
      if (scrollInstance) scrollInstance.destroy();
      window.removeEventListener("resize", calcWinsize);
      window.removeEventListener("scroll", getPageYScroll);
      document.body.style.height = "";
    };
  }, []);

  return (
    <>
      <Navbar2 />
      
      {/* Background Image preserved */}
      <div
        className="social-bg"
        style={{
          backgroundImage: "url('/images/social_bg.jpg')",
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "fixed",
          inset: 0,
          zIndex: 0,
        }}
      />
      <div className="social-vignette" />

      {/* Main scrolling container */}
      <main ref={containerRef} className="social-main">
        <div data-scroll className="page page--layout-2">
          <h1 className="page__title">Social Initiatives</h1>

          <div className="content content--alternate content--padded">
            {initiativesData.map((item, index) => (
              <div
                key={item.id}
                className="content__item content__item--expand"
                style={{ "--aspect-ratio": item.aspectRatio }}
              >
                <div className="content__item-imgwrap">
                  <div
                    className="content__item-img"
                    style={{ backgroundImage: `url(${item.image})` }}
                  />
                </div>
                <h2 className="content__item-title">{item.title}</h2>
                <p className="content__item-description">{item.description}</p>
              </div>
            ))}
          </div>
          
          <div style={{ height: "100px" }}></div>
        </div>
      </main>

      {/* Keep Footer out of the smooth scroll so it can be handled properly, or just add some space */}
    </>
  );
};

export default Social;
