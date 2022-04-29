const fadeLayout = {
  initial: "hidden",
  animate: "visible",
  variants: {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: .3,
        staggerChildren: .2
      }
    }
  }
};

const fadeToTop = {
  variants: {
    hidden: {
      opacity: 0,
      y: 5
    },
    visible: {
      opacity: 1,
      y: 0
    }
  }
};

const fadeToTopOnScroll = {
  initial: "hidden",
  viewport: { 
    once: true
  },
  whileInView: "inView",
  variants: {
    hidden: {
      opacity: 0,
      y: 5
    },
    inView: {
      opacity: 1,
      y: 0,
      transition: {
        delay: .2,
        duration: .2
      }
    }
  }
};

const scaleOnInteract = {
  whileHover: {
    scale: .98
  },
  whileTap: {
    scale: .95
  }
};


export {
  fadeToTop,
  fadeLayout,
  fadeToTopOnScroll,
  scaleOnInteract
};
