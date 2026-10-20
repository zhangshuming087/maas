import "./style.css";

/** 滚动入场动画:元素进入视口时添加 .visible */
function setupReveal(): void {
  const items = document.querySelectorAll<HTMLElement>(".reveal");
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          // 同一容器内的元素按索引错开,形成级联效果
          const siblings = Array.from(el.parentElement?.children ?? []);
          const index = siblings.indexOf(el);
          el.style.transitionDelay = `${Math.min(index, 5) * 90}ms`;
          el.classList.add("visible");
          observer.unobserve(el);
        }
      }
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );
  items.forEach((el) => observer.observe(el));
}

/** 导航栏滚动后加投影 */
function setupNavbarShadow(): void {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;
  const update = (): void => {
    navbar.classList.toggle("scrolled", window.scrollY > 8);
  };
  window.addEventListener("scroll", update, { passive: true });
  update();
}

/** 移动端菜单开合 */
function setupMobileNav(): void {
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("mainNav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "关闭菜单" : "打开菜单");
  });

  nav.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    })
  );
}

/** 地球插画跟随鼠标轻微视差 */
function setupGlobeParallax(): void {
  const wrap = document.getElementById("globeWrap");
  if (!wrap || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  let raf = 0;
  const onMove = (e: MouseEvent): void => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      const rect = wrap.getBoundingClientRect();
      const dx = (e.clientX - (rect.left + rect.width / 2)) / rect.width;
      const dy = (e.clientY - (rect.top + rect.height / 2)) / rect.height;
      const tilt = 6;
      wrap.style.transform = `perspective(900px) rotateY(${dx * tilt}deg) rotateX(${-dy * tilt}deg)`;
    });
  };
  const onLeave = (): void => {
    cancelAnimationFrame(raf);
    wrap.style.transform = "perspective(900px) rotateY(0deg) rotateX(0deg)";
  };

  document.addEventListener("mousemove", onMove);
  document.addEventListener("mouseleave", onLeave);
  wrap.style.transition = "transform 0.35s ease";
}

/** 能力卡片 3D 悬停光效 */
function setupCardTilt(): void {
  const cards = document.querySelectorAll<HTMLElement>(".cap-item");
  cards.forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.background = `radial-gradient(240px circle at ${x}px ${y}px, rgba(52, 211, 153, 0.09), var(--bg-card) 65%)`;
    });
    card.addEventListener("pointerleave", () => {
      card.style.background = "";
    });
  });
}

/** 点击导航项切换激活态(原型内交互) */
function setupActiveNav(): void {
  const links = document.querySelectorAll<HTMLAnchorElement>(".nav-link");
  links.forEach((link) =>
    link.addEventListener("click", (e) => {
      if (link.getAttribute("href") === "#") e.preventDefault();
      links.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");
    })
  );
}

function main(): void {
  setupReveal();
  setupNavbarShadow();
  setupMobileNav();
  setupGlobeParallax();
  setupCardTilt();
  setupActiveNav();
}

main();
