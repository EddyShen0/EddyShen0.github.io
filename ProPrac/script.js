const year = document.querySelector("#year");
year.textContent = new Date().getFullYear();

const preloader = document.querySelector("#preloader");
const loadingStartedAt = performance.now();
window.addEventListener("load", () => {
  const remaining = Math.max(1150 - (performance.now() - loadingStartedAt), 0);
  window.setTimeout(() => {
    preloader.classList.add("is-exiting");
    document.documentElement.classList.remove("is-loading");
    document.body.classList.add("is-loaded");
    window.setTimeout(() => preloader.remove(), 750);
  }, remaining);
});

const experience = document.querySelector(".experience-scroll");
const scenes = [...document.querySelectorAll(".experience-slide")];
const dots = [...document.querySelectorAll(".scene-progress span")];
const thresholds = [0, 0.125, 0.425, 0.7125, 1];
let framePending = false;

function updateExperience() {
  const distance = experience.offsetHeight - window.innerHeight;
  const progress = Math.min(Math.max(-experience.getBoundingClientRect().top / distance, 0), 1);
  let activeScene = 0;
  thresholds.forEach((threshold, index) => {
    if (progress >= threshold) activeScene = index;
  });

  scenes.forEach((scene, index) => {
    scene.classList.toggle("is-current", index === activeScene);
    scene.classList.toggle("is-past", index < activeScene);
  });
  dots.forEach((dot, index) => dot.classList.toggle("is-current", index === activeScene));
  document.body.dataset.scene = String(activeScene);
  framePending = false;
}

function requestExperienceUpdate() {
  if (!framePending) {
    framePending = true;
    window.requestAnimationFrame(updateExperience);
  }
}

window.addEventListener("scroll", requestExperienceUpdate, { passive: true });
window.addEventListener("resize", requestExperienceUpdate);
updateExperience();

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const precisePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

if (!reducedMotion.matches && precisePointer.matches) {
  document.querySelectorAll(".shape-stage").forEach((stage) => {
    const shape = stage.querySelector(".story-shape");
    if (!shape) return;

    stage.addEventListener("pointermove", (event) => {
      const bounds = stage.getBoundingClientRect();
      const x = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1));
      const y = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1));

      stage.classList.add("is-tilting");
      shape.style.setProperty("--tilt-x", `${-y * 11}deg`);
      shape.style.setProperty("--tilt-y", `${x * 14}deg`);
      shape.style.setProperty("--shift-x", `${x * 12}px`);
      shape.style.setProperty("--shift-y", `${y * 9}px`);
    });

    stage.addEventListener("pointerleave", () => {
      shape.style.setProperty("--tilt-x", "0deg");
      shape.style.setProperty("--tilt-y", "0deg");
      shape.style.setProperty("--shift-x", "0px");
      shape.style.setProperty("--shift-y", "0px");
      stage.classList.remove("is-tilting");
    });
  });
}

const typeComposition = document.querySelector("#type-composition");

function initializeLetterRepulsion(svg) {
  if (!svg || svg.dataset.repulsionReady) return;

  svg.dataset.repulsionReady = "true";
  svg.style.overflow = "visible";

  const candidates = [...svg.querySelectorAll(":scope > path, :scope > text, :scope > circle")]
    .filter((element) => element.tagName !== "text" || element.textContent.trim());

  const screenMatrix = svg.getScreenCTM();
  if (!screenMatrix) return;
  const inverseMatrix = screenMatrix.inverse();

  const toSvgPoint = (clientX, clientY) =>
    new DOMPoint(clientX, clientY).matrixTransform(inverseMatrix);

  function createCollisionParts(index, width, height) {
    if (index === 4) {
      const rightExtension = 4;
      return [{
        x: rightExtension / 2,
        y: 0,
        width: width + rightExtension,
        height
      }];
    }

    if (index === 11) {
      return [
        { x: 0, y: -height * 0.29, width, height: height * 0.42 },
        { x: -width * 0.34, y: 0, width: width * 0.32, height }
      ];
    }

    if (index === 14) {
      return [
        { x: 0, y: height * 0.29, width, height: height * 0.42 },
        { x: width * 0.34, y: 0, width: width * 0.32, height }
      ];
    }

    return [{ x: 0, y: 0, width, height }];
  }

  const letters = candidates.map((element, index) => {
    const rect = element.getBoundingClientRect();
    const topLeft = toSvgPoint(rect.left, rect.top);
    const bottomRight = toSvgPoint(rect.right, rect.bottom);
    const centerX = (topLeft.x + bottomRight.x) / 2;
    const centerY = (topLeft.y + bottomRight.y) / 2;

    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    group.classList.add("repel-letter");
    group.dataset.letterIndex = String(index);
    element.parentNode.insertBefore(group, element);
    group.appendChild(element);

    const width = Math.abs(bottomRight.x - topLeft.x);
    const height = Math.abs(bottomRight.y - topLeft.y);

    if (index === 11) group.dataset.collider = "axe-down";
    if (index === 14) group.dataset.collider = "axe-up";
    if (element.tagName === "circle") group.dataset.collider = "circle";

    return {
      group,
      homeX: centerX,
      homeY: centerY,
      width,
      height,
      collisionParts: createCollisionParts(index, width, height),
      x: 0,
      y: 0,
      velocityX: 0,
      velocityY: 0
    };
  });

  const viewBox = svg.viewBox.baseVal;
  const pointer = { x: -1000, y: -1000, active: false };

  svg.addEventListener("pointermove", (event) => {
    const matrix = svg.getScreenCTM();
    if (!matrix) return;
    const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse());
    pointer.x = point.x;
    pointer.y = point.y;
    pointer.active = true;
  });

  svg.addEventListener("pointerleave", () => {
    pointer.active = false;
  });

  function separateLetters(first, second) {
    let resolution = null;

    first.collisionParts.forEach((firstPart) => {
      second.collisionParts.forEach((secondPart) => {
        const firstX = first.homeX + first.x + firstPart.x;
        const firstY = first.homeY + first.y + firstPart.y;
        const secondX = second.homeX + second.x + secondPart.x;
        const secondY = second.homeY + second.y + secondPart.y;
        const deltaX = secondX - firstX;
        const deltaY = secondY - firstY;
        const overlapX = (firstPart.width + secondPart.width) / 2 + 2 - Math.abs(deltaX);
        const overlapY = (firstPart.height + secondPart.height) / 2 + 2 - Math.abs(deltaY);

        if (overlapX <= 0 || overlapY <= 0) return;

        const candidate = overlapX < overlapY
          ? { axis: "x", amount: overlapX, direction: deltaX < 0 ? -1 : 1 }
          : { axis: "y", amount: overlapY, direction: deltaY < 0 ? -1 : 1 };

        if (!resolution || candidate.amount < resolution.amount) resolution = candidate;
      });
    });

    if (!resolution) return;

    if (resolution.axis === "x") {
      const correction = resolution.amount * 0.5 * resolution.direction;
      first.x -= correction;
      second.x += correction;
      first.velocityX -= correction * 0.04;
      second.velocityX += correction * 0.04;
    } else {
      const correction = resolution.amount * 0.5 * resolution.direction;
      first.y -= correction;
      second.y += correction;
      first.velocityY -= correction * 0.04;
      second.velocityY += correction * 0.04;
    }
  }

  function animateLetters() {
    letters.forEach((letter) => {
      const centerX = letter.homeX + letter.x;
      const centerY = letter.homeY + letter.y;
      const deltaX = centerX - pointer.x;
      const deltaY = centerY - pointer.y;
      const distance = Math.hypot(deltaX, deltaY) || 0.001;
      const radius = 62;

      if (pointer.active && distance < radius) {
        const force = (1 - distance / radius) * 2.8;
        letter.velocityX += (deltaX / distance) * force;
        letter.velocityY += (deltaY / distance) * force;
      }

      letter.velocityX += -letter.x * 0.028;
      letter.velocityY += -letter.y * 0.028;
      letter.velocityX *= 0.82;
      letter.velocityY *= 0.82;
      letter.x += letter.velocityX;
      letter.y += letter.velocityY;

      const halfWidth = letter.width / 2;
      const halfHeight = letter.height / 2;
      letter.x = Math.max(
        viewBox.x + halfWidth - letter.homeX,
        Math.min(viewBox.x + viewBox.width - halfWidth - letter.homeX, letter.x)
      );
      letter.y = Math.max(
        viewBox.y + halfHeight - letter.homeY,
        Math.min(viewBox.y + viewBox.height - halfHeight - letter.homeY, letter.y)
      );
    });

    for (let pass = 0; pass < 3; pass += 1) {
      for (let first = 0; first < letters.length; first += 1) {
        for (let second = first + 1; second < letters.length; second += 1) {
          separateLetters(letters[first], letters[second]);
        }
      }
    }

    letters.forEach((letter) => {
      letter.group.setAttribute("transform", `translate(${letter.x} ${letter.y})`);
    });

    window.requestAnimationFrame(animateLetters);
  }

  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    animateLetters();
  }
}

async function loadTypeComposition() {
  if (!typeComposition) return;

  try {
    const response = await fetch(typeComposition.dataset.svgSource);
    if (!response.ok) throw new Error(`SVG request failed: ${response.status}`);
    typeComposition.innerHTML = await response.text();
    const svg = typeComposition.querySelector("svg");
    if (svg) initializeLetterRepulsion(svg);
  } catch (error) {
    console.error("Unable to load the typography SVG.", error);
  }
}

loadTypeComposition();
