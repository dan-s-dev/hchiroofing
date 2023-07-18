
function scrollToTop() {
	window.scrollTo({ top: 0, behavior: 'smooth' });
}

function closeNav() {

  const navCheckbox = document.getElementById("nav-checkbox")

  navCheckbox.checked = false;


}




// get our elements
const sliders = document.querySelectorAll(".slider-container");
const indexArray = [];
const containerWidth = document.querySelector(".social-slider").offsetWidth;
console.log("conatiner width " + containerWidth);

let ytVidIDs = [];
let clickIndex = 0;

// set up our state
let isDragging = false,
  startPos = [],
  currentTranslate = [],
  prevTranslate = [],
  animationID;

sliders.forEach((slider, i) => {
  currentTranslate[i] = 0;
  prevTranslate[i] = 0;
  startPos[i] = 0;

  const slides = Array.from(slider.children);

  slider.style.width = `calc(100% * ${slides.length})`;
  indexArray[i] = 0;

  // add our event listeners
  slides.forEach((slide, index) => {
    const slideImage = slide.querySelector("img");

    setNextPrevCards();

    // disable default image drag
    slideImage.addEventListener("dragstart", (e) => e.preventDefault());
    slideImage.addEventListener("dragstart", (e) =>
      e.stopImmediatePropagation()
    );
    // touch events

    slide.addEventListener("touchstart", touchStart(index));
    slide.addEventListener("touchend", touchEnd);

    slide.addEventListener("touchmove", touchMove);
    // mouse events
    slide.addEventListener("mousedown", touchStart(index));
    slide.addEventListener("mouseup", touchEnd);

    slide.addEventListener("mousemove", touchMove);
    slide.addEventListener("mouseleave", touchEnd);


  });

  // make responsive to viewport changes
  window.addEventListener("resize", setPositionByIndex);

  // prevent menu popup on long press
  window.oncontextmenu = function (event) {
    event.preventDefault();
    event.stopPropagation();
    return false;
  };

  function getPositionX(event) {
    return event.type.includes("mouse")
      ? event.pageX
      : event.touches[0].clientX;
  }

  // use a HOF so we have index in a closure
  function touchStart(index) {
    return function (event) {
      indexArray[i] = index;
      clickIndex = index;
      startPos[i] = getPositionX(event);
      isDragging = true;
      animationID = requestAnimationFrame(animation);
      slider.classList.add("grabbing");
    };
  }

  function touchMove(event) {
    // console.log("current trans " + currentTranslate[i]);
    if (isDragging) {
      const currentPosition = getPositionX(event);
      currentTranslate[i] = prevTranslate[i] + currentPosition - startPos[i];
    }
  }

  function touchEnd() {
    // console.log("touch end ");
    cancelAnimationFrame(animationID);
    isDragging = false;

    const movedBy = currentTranslate[i] - prevTranslate[i];

    // if moved enough negative then snap to next slide if there is one
    if (movedBy < -100 && indexArray[i] < slides.length - 1) indexArray[i] += 1;

    // if moved enough positive then snap to previous slide if there is one
    if (movedBy > 100 && indexArray[i] > 0) indexArray[i] -= 1;

    setPositionByIndex();

    slider.classList.remove("grabbing");
    setNextPrevCards();
  }

  function animation() {
    setSliderPosition();
    if (isDragging) requestAnimationFrame(animation);
  }

  function setPositionByIndex() {
    currentTranslate[i] = indexArray[i] * -containerWidth;

    prevTranslate[i] = currentTranslate[i];
    setSliderPosition();
  }

  function setSliderPosition() {
    slider.style.transform = `translateX(${currentTranslate[i]}px)`;
  }

  function setNextPrevCards() {
    if (indexArray[i] < 1) {
      nextSwipeCard = slides[indexArray[i] + 1].querySelector("img");
      nextSwipeCard.classList.add("next-swipe-card");
      nextSwipeCard.classList.remove("cur-swipe-card");

      curSwipeCard = slides[indexArray[i]].querySelector("img");
      curSwipeCard.classList.add("cur-swipe-card");

      prevSwipeCard = slides[indexArray[i]].querySelector("img");
      prevSwipeCard.classList.remove("next-swipe-card");
      prevSwipeCard.classList.remove("prev-swipe-card");
    }
    if (indexArray[i] > 0 && indexArray[i] < slides.length) {
      try {
        // console.log("middle slide " + currentIndex);
        nextSwipeCard = slides[indexArray[i] + 1].querySelector("img");
        nextSwipeCard.classList.add("next-swipe-card");
        nextSwipeCard.classList.remove("cur-swipe-card");

        curSwipeCard = slides[indexArray[i]].querySelector("img");
        curSwipeCard.classList.remove("next-swipe-card");
        curSwipeCard.classList.remove("prev-swipe-card");
        curSwipeCard.classList.add("cur-swipe-card");

        prevSwipeCard = slides[indexArray[i] - 1].querySelector("img");
        prevSwipeCard.classList.remove("next-swipe-card");
        prevSwipeCard.classList.remove("cur-swipe-card");
        prevSwipeCard.classList.add("prev-swipe-card");
      } catch (err) {
        // console.log("last slide " + currentIndex);
        nextSwipeCard = slides[indexArray[i]].querySelector("img");

        curSwipeCard = nextSwipeCard;
        curSwipeCard.classList.add("cur-swipe-card");
        curSwipeCard.classList.remove("next-swipe-card");
        curSwipeCard.classList.remove("prev-swipe-card");

        prevSwipeCard = slides[indexArray[i] - 1].querySelector("img");
        prevSwipeCard.classList.remove("next-swipe-card");
        prevSwipeCard.classList.remove("cur-swipe-card");
        prevSwipeCard.classList.add("prev-swipe-card");
      }
    }
  }
});

//currentindex + 1 transform translateX

// console.log(mediaViewer);

// using open source API at https://yt.lemnoslife.com/

const ytSlider = document.getElementById("sliderYoutube");

let ytThumbs = Array.from(ytSlider.children);


