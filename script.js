const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const sectionLinks = document.querySelectorAll(".nav-links a[href^='#']");
const sections = [...document.querySelectorAll("main section[id]")];
const revealNodes = document.querySelectorAll(".reveal");
const typedSummary = document.querySelector(".hero-summary[data-type-text]");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = document.body.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      document.body.classList.remove("nav-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

if (typedSummary instanceof HTMLElement) {
  const fullText = typedSummary.dataset.typeText?.trim();
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (fullText && !reduceMotion) {
    let index = 0;

    typedSummary.setAttribute("aria-label", fullText);
    typedSummary.textContent = "";
    typedSummary.classList.add("is-typing");

    const typeNext = () => {
      if (index >= fullText.length) {
        typedSummary.textContent = fullText;
        typedSummary.classList.remove("is-typing");
        return;
      }

      const currentChar = fullText[index];
      index += 1;
      typedSummary.textContent = fullText.slice(0, index);

      let delay = 46;

      if (currentChar === "," || currentChar === ";") {
        delay = 175;
      } else if (currentChar === ".") {
        delay = 320;
      } else if (currentChar === " ") {
        delay = 22;
      }

      window.setTimeout(typeNext, delay);
    };

    window.setTimeout(typeNext, 620);
  }
}

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.14,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  revealNodes.forEach((node) => revealObserver.observe(node));

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const currentId = entry.target.getAttribute("id");
        sectionLinks.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === `#${currentId}`);
        });
      });
    },
    {
      threshold: 0.4,
      rootMargin: "-15% 0px -35% 0px",
    }
  );

  sections.forEach((section) => sectionObserver.observe(section));
} else {
  revealNodes.forEach((node) => node.classList.add("is-visible"));
}
