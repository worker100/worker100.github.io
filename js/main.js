// AI探索者个人网站 - 主JavaScript文件

// 全局配置
const CONFIG = {
  LOADING_DURATION: 2000,
  PARTICLE_COUNT: 50,
  THEME_STORAGE_KEY: 'ai-explorer-theme',
  CACHE_VERSION: '1.0.0',
  PERFORMANCE_MONITORING: true
};

// GSAP动画管理器
const AnimationManager = {
  // 初始化GSAP
  init() {
    // 注册GSAP插件
    gsap.registerPlugin(ScrollTrigger, TextPlugin);
    
    // 设置默认动画配置
    gsap.defaults({
      duration: 0.8,
      ease: "power2.out"
    });

    // 初始化各种动画
    this.initPageTransitions();
    this.initScrollAnimations();
    this.initTextAnimations();
    this.initParallaxEffects();
    this.initHoverAnimations();
    this.initLoadingAnimations();
  },

  // 页面转场动画
  initPageTransitions() {
    const pageTransition = document.getElementById('page-transition');
    
    // 页面进入动画
    this.pageEnterAnimation = gsap.timeline({ paused: true })
      .set(pageTransition, { display: 'block' })
      .to(pageTransition.querySelector('div'), {
        scaleX: 1,
        duration: 0.6,
        ease: "power2.inOut"
      })
      .to(pageTransition.querySelector('div'), {
        scaleX: 0,
        transformOrigin: "right center",
        duration: 0.6,
        ease: "power2.inOut"
      })
      .set(pageTransition, { display: 'none' });
  },

  // 滚动动画
  initScrollAnimations() {
    // 元素淡入动画
    gsap.utils.toArray('.animate-on-scroll').forEach(element => {
      gsap.fromTo(element, 
        {
          opacity: 0,
          y: 50
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: element,
            start: "top 85%",
            end: "bottom 15%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    // 技能条动画
    gsap.utils.toArray('.skill-bar').forEach(bar => {
      const progress = bar.dataset.progress || '0%';
      gsap.fromTo(bar.querySelector('.skill-progress'), 
        { width: '0%' },
        {
          width: progress,
          duration: 1.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: bar,
            start: "top 80%"
          }
        }
      );
    });

    // 数字计数动画
    gsap.utils.toArray('.counter').forEach(counter => {
      const target = parseInt(counter.dataset.target) || 0;
      gsap.fromTo(counter, 
        { textContent: 0 },
        {
          textContent: target,
          duration: 2,
          ease: "power2.out",
          snap: { textContent: 1 },
          scrollTrigger: {
            trigger: counter,
            start: "top 80%"
          }
        }
      );
    });
  },

  // 文字动画
  initTextAnimations() {
    // 打字机效果
    const typewriterElements = document.querySelectorAll('.typewriter-text');
    typewriterElements.forEach(element => {
      const text = element.textContent;
      element.textContent = '';
      
      gsap.to(element, {
        text: {
          value: text,
          delimiter: ""
        },
        duration: text.length * 0.05,
        ease: "none",
        scrollTrigger: {
          trigger: element,
          start: "top 80%"
        }
      });
    });

    // 文字逐个显示
    gsap.utils.toArray('.text-reveal').forEach(element => {
      const words = element.textContent.split(' ');
      element.innerHTML = words.map(word => `<span class="word">${word}</span>`).join(' ');
      
      gsap.fromTo(element.querySelectorAll('.word'), 
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          scrollTrigger: {
            trigger: element,
            start: "top 85%"
          }
        }
      );
    });
  },

  // 视差效果
  initParallaxEffects() {
    // 背景视差
    gsap.utils.toArray('.parallax-bg').forEach(bg => {
      gsap.to(bg, {
        yPercent: -50,
        ease: "none",
        scrollTrigger: {
          trigger: bg,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
    });

    // 元素浮动效果
    gsap.utils.toArray('.floating-element').forEach(element => {
      gsap.to(element, {
        y: -20,
        duration: 2,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1
      });
    });
  },

  // 悬停动画
  initHoverAnimations() {
    // 卡片悬停效果
    gsap.utils.toArray('.hover-card').forEach(card => {
      const tl = gsap.timeline({ paused: true });
      tl.to(card, {
        y: -10,
        scale: 1.02,
        duration: 0.3,
        ease: "power2.out"
      });

      card.addEventListener('mouseenter', () => tl.play());
      card.addEventListener('mouseleave', () => tl.reverse());
    });

    // 按钮悬停效果
    gsap.utils.toArray('.hover-button').forEach(button => {
      const tl = gsap.timeline({ paused: true });
      tl.to(button, {
        scale: 1.05,
        duration: 0.2,
        ease: "back.out(1.7)"
      });

      button.addEventListener('mouseenter', () => tl.play());
      button.addEventListener('mouseleave', () => tl.reverse());
    });
  },

  // 加载动画
  initLoadingAnimations() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      // 加载完成后的退出动画
      const exitAnimation = gsap.timeline({ paused: true });
      exitAnimation
        .to(loadingScreen.querySelector('svg'), {
          scale: 1.2,
          rotation: 360,
          duration: 0.5
        })
        .to(loadingScreen, {
          opacity: 0,
          duration: 0.5,
          onComplete: () => {
            loadingScreen.style.display = 'none';
          }
        });

      // 2秒后执行退出动画
      setTimeout(() => {
        exitAnimation.play();
      }, CONFIG.LOADING_DURATION);
    }
  },

  // 触发页面转场
  triggerPageTransition(callback) {
    if (this.pageEnterAnimation) {
      this.pageEnterAnimation.restart();
      if (callback) {
        setTimeout(callback, 600);
      }
    }
  },

  // 创建自定义动画时间线
  createTimeline(options = {}) {
    return gsap.timeline(options);
  },

  // 动画工具方法
  utils: {
    // 淡入动画
    fadeIn(element, duration = 0.5) {
      return gsap.fromTo(element, 
        { opacity: 0 }, 
        { opacity: 1, duration }
      );
    },

    // 淡出动画
    fadeOut(element, duration = 0.5) {
      return gsap.to(element, { opacity: 0, duration });
    },

    // 滑入动画
    slideIn(element, direction = 'up', distance = 50, duration = 0.5) {
      const from = {};
      const to = {};
      
      switch(direction) {
        case 'up': from.y = distance; to.y = 0; break;
        case 'down': from.y = -distance; to.y = 0; break;
        case 'left': from.x = distance; to.x = 0; break;
        case 'right': from.x = -distance; to.x = 0; break;
      }
      
      from.opacity = 0;
      to.opacity = 1;
      to.duration = duration;
      
      return gsap.fromTo(element, from, to);
    },

    // 弹性动画
    bounce(element, scale = 1.1, duration = 0.3) {
      return gsap.to(element, {
        scale: scale,
        duration: duration,
        ease: "back.out(1.7)",
        yoyo: true,
        repeat: 1
      });
    }
  }
};

// 主题管理
const ThemeManager = {
  init() {
    this.loadTheme();
    this.bindEvents();
  },

  loadTheme() {
    const savedTheme = localStorage.getItem(CONFIG.THEME_STORAGE_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    
    this.setTheme(isDark ? 'dark' : 'light');
  },

  setTheme(theme) {
    const html = document.documentElement;
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');

    if (theme === 'dark') {
      html.classList.add('dark');
      sunIcon?.classList.remove('hidden');
      moonIcon?.classList.add('hidden');
    } else {
      html.classList.remove('dark');
      sunIcon?.classList.add('hidden');
      moonIcon?.classList.remove('hidden');
    }

    localStorage.setItem(CONFIG.THEME_STORAGE_KEY, theme);
  },

  toggle() {
    const isDark = document.documentElement.classList.contains('dark');
    this.setTheme(isDark ? 'light' : 'dark');
  },

  bindEvents() {
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle?.addEventListener('click', () => this.toggle());
  }
};

// 加载动画管理（已集成到AnimationManager中）
const LoadingManager = {
  init() {
    // 现在使用AnimationManager中的加载动画
    // 保持向后兼容性
    console.log('LoadingManager: 使用GSAP动画系统');
  }
};

// 导航管理
const NavigationManager = {
  init() {
    this.bindMobileMenu();
    this.bindSmoothScroll();
    this.setupMobileOptimizations();
    this.setupTouchGestures();
  },

  bindMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    mobileMenuButton?.addEventListener('click', () => {
      mobileMenu?.classList.toggle('show');
      mobileMenu?.classList.toggle('hidden');
    });
  },

  bindSmoothScroll() {
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const target = document.querySelector(targetId);
        
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          
          // 关闭移动端菜单
          const mobileMenu = document.getElementById('mobile-menu');
          mobileMenu?.classList.add('hidden');
          mobileMenu?.classList.remove('show');
        }
      });
    });
  },

  setupMobileOptimizations() {
    // 检测移动设备
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      document.body.classList.add('mobile-device');
      
      // 优化移动端滚动性能
      document.addEventListener('touchstart', this.handleTouchStart, { passive: true });
      document.addEventListener('touchmove', this.handleTouchMove, { passive: true });
      
      // 防止iOS双击缩放
      let lastTouchEnd = 0;
      document.addEventListener('touchend', (event) => {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
          event.preventDefault();
        }
        lastTouchEnd = now;
      }, false);
      
      // 优化视口设置
      this.optimizeViewport();
    }
    
    // 响应式断点检测
    this.setupBreakpointDetection();
  },

  setupTouchGestures() {
    let touchStartX = 0;
    let touchStartY = 0;
    
    document.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });
    
    document.addEventListener('touchend', (e) => {
      if (!touchStartX || !touchStartY) return;
      
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      
      const diffX = touchStartX - touchEndX;
      const diffY = touchStartY - touchEndY;
      
      // 检测水平滑动手势
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        if (diffX > 0) {
          // 向左滑动 - 可以用于切换到下一个section
          this.handleSwipeLeft();
        } else {
          // 向右滑动 - 可以用于切换到上一个section
          this.handleSwipeRight();
        }
      }
      
      touchStartX = 0;
      touchStartY = 0;
    }, { passive: true });
  },

  handleSwipeLeft() {
    // 实现向左滑动逻辑，比如切换到下一个section
    const sections = ['home', 'about', 'projects', 'blog', 'games', 'contact'];
    const currentSection = this.getCurrentSection();
    const currentIndex = sections.indexOf(currentSection);
    
    if (currentIndex < sections.length - 1) {
      const nextSection = sections[currentIndex + 1];
      document.getElementById(nextSection)?.scrollIntoView({ behavior: 'smooth' });
    }
  },

  handleSwipeRight() {
    // 实现向右滑动逻辑，比如切换到上一个section
    const sections = ['home', 'about', 'projects', 'blog', 'games', 'contact'];
    const currentSection = this.getCurrentSection();
    const currentIndex = sections.indexOf(currentSection);
    
    if (currentIndex > 0) {
      const prevSection = sections[currentIndex - 1];
      document.getElementById(prevSection)?.scrollIntoView({ behavior: 'smooth' });
    }
  },

  getCurrentSection() {
    const sections = document.querySelectorAll('section[id]');
    let currentSection = 'home';
    
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 100 && rect.bottom >= 100) {
        currentSection = section.id;
      }
    });
    
    return currentSection;
  },

  optimizeViewport() {
    // 动态调整视口设置
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute('content', 
        'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
      );
    }
  },

  setupBreakpointDetection() {
    // 监听窗口大小变化
    const mediaQueries = {
      mobile: window.matchMedia('(max-width: 768px)'),
      tablet: window.matchMedia('(min-width: 769px) and (max-width: 1024px)'),
      desktop: window.matchMedia('(min-width: 1025px)')
    };
    
    Object.entries(mediaQueries).forEach(([breakpoint, mq]) => {
      mq.addEventListener('change', (e) => {
        if (e.matches) {
          document.body.classList.remove('is-mobile', 'is-tablet', 'is-desktop');
          document.body.classList.add(`is-${breakpoint}`);
          
          // 触发布局优化
          this.optimizeLayoutForBreakpoint(breakpoint);
        }
      });
      
      // 初始化检测
      if (mq.matches) {
        document.body.classList.add(`is-${breakpoint}`);
        this.optimizeLayoutForBreakpoint(breakpoint);
      }
    });
  },

  optimizeLayoutForBreakpoint(breakpoint) {
    switch (breakpoint) {
      case 'mobile':
        this.optimizeForMobile();
        break;
      case 'tablet':
        this.optimizeForTablet();
        break;
      case 'desktop':
        this.optimizeForDesktop();
        break;
    }
  },

  optimizeForMobile() {
    // 减少动画复杂度
    document.querySelectorAll('.particle').forEach(p => p.style.display = 'none');
    
    // 优化图片加载
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      if (!img.loading) img.loading = 'lazy';
    });
    
    // 优化字体大小
    document.body.style.fontSize = '16px';
  },

  optimizeForTablet() {
    // 平板特定优化
    document.body.classList.add('tablet-layout');
  },

  optimizeForDesktop() {
    // 桌面端优化
    document.body.classList.add('desktop-layout');
    
    // 重新启用粒子效果
    document.querySelectorAll('.particle').forEach(p => p.style.display = 'block');
  },

  handleTouchStart(e) {
    // 处理触摸开始事件 - 优化滚动性能
  },

  handleTouchMove(e) {
    // 处理触摸移动事件 - 优化滚动性能
  }
};

// 粒子效果管理
const ParticleManager = {
  particles: [],

  init() {
    const container = document.getElementById('particles-container');
    if (!container || window.innerWidth <= 768) return;

    this.createParticles(container);
    this.animate();
  },

  createParticles(container) {
    for (let i = 0; i < CONFIG.PARTICLE_COUNT; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      const size = Math.random() * 2 + 1;
      
      particle.style.left = x + 'px';
      particle.style.top = y + 'px';
      particle.style.width = size + 'px';
      particle.style.height = size + 'px';
      
      container.appendChild(particle);
      
      this.particles.push({
        element: particle,
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5
      });
    }
  },

  animate() {
    this.particles.forEach(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x < 0 || particle.x > window.innerWidth) particle.vx *= -1;
      if (particle.y < 0 || particle.y > window.innerHeight) particle.vy *= -1;

      particle.element.style.left = particle.x + 'px';
      particle.element.style.top = particle.y + 'px';
    });

    requestAnimationFrame(() => this.animate());
  }
};

// 滚动动画管理
const ScrollAnimationManager = {
  init() {
    this.setupIntersectionObserver();
    this.setupSkillBars();
    this.setupLazyLoading();
  },

  setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    const animatedElements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right');
    animatedElements.forEach(el => observer.observe(el));
  },

  setupLazyLoading() {
    // 图片懒加载
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.dataset.src || img.src;
          
          // 创建新图片对象预加载
          const newImg = new Image();
          newImg.onload = () => {
            img.src = src;
            img.classList.add('loaded');
            img.classList.remove('loading');
          };
          newImg.onerror = () => {
            img.classList.add('error');
            img.classList.remove('loading');
          };
          newImg.src = src;
          
          imageObserver.unobserve(img);
        }
      });
    }, { 
      threshold: 0.1, 
      rootMargin: '50px 0px 50px 0px' 
    });

    // 观察所有带有loading="lazy"的图片
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    lazyImages.forEach(img => {
      img.classList.add('loading');
      imageObserver.observe(img);
    });
  },

  setupSkillBars() {
    const skillBars = document.querySelectorAll('.skill-bar');
    const skillObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const width = bar.getAttribute('data-width');
          setTimeout(() => {
            bar.style.width = width + '%';
          }, 200);
        }
      });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => skillObserver.observe(bar));
  }
};

// 模态框管理
const ModalManager = {
  init() {
    this.bindSubscribeModal();
    this.bindWechatModal();
    this.bindGlobalClose();
  },

  bindSubscribeModal() {
    const subscribeBtn = document.getElementById('subscribe-btn');
    const subscribeModal = document.getElementById('subscribe-modal');
    const closeBtn = document.getElementById('close-modal');

    subscribeBtn?.addEventListener('click', () => {
      subscribeModal?.classList.remove('hidden');
      subscribeModal?.classList.add('flex');
    });

    closeBtn?.addEventListener('click', () => {
      subscribeModal?.classList.add('hidden');
      subscribeModal?.classList.remove('flex');
    });
  },

  bindWechatModal() {
    const wechatBtn = document.getElementById('wechat-btn');
    const wechatModal = document.getElementById('wechat-modal');
    const closeBtn = document.getElementById('close-wechat-modal');

    wechatBtn?.addEventListener('click', () => {
      wechatModal?.classList.remove('hidden');
      wechatModal?.classList.add('flex');
    });

    closeBtn?.addEventListener('click', () => {
      wechatModal?.classList.add('hidden');
      wechatModal?.classList.remove('flex');
    });
  },

  bindGlobalClose() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const modals = document.querySelectorAll('[id$="-modal"]');
        modals.forEach(modal => {
          modal.classList.add('hidden');
          modal.classList.remove('flex');
        });
      }
    });

    // 点击背景关闭
    const modals = document.querySelectorAll('[id$="-modal"]');
    modals.forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.add('hidden');
          modal.classList.remove('flex');
        }
      });
    });
  }
};

// 表单管理
const FormManager = {
  init() {
    this.bindContactForm();
    this.bindSubscribeForm();
    this.setupValidation();
  },

  bindContactForm() {
    const contactForm = document.getElementById('contact-form');
    contactForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // 模拟表单提交
      this.showNotification('消息发送成功！我会尽快回复您。', 'success');
      contactForm.reset();
    });
  },

  bindSubscribeForm() {
    const subscribeForm = document.getElementById('subscribe-form');
    subscribeForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // 模拟订阅
      this.showNotification('订阅成功！欢迎加入AI探索者社区。', 'success');
      
      // 关闭模态框
      const modal = document.getElementById('subscribe-modal');
      modal?.classList.add('hidden');
      modal?.classList.remove('flex');
      
      subscribeForm.reset();
    });
  },

  showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
    
    notification.className = `fixed top-4 right-4 z-50 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg transform translate-x-full transition-transform duration-300`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.remove('translate-x-full');
    }, 100);
    
    setTimeout(() => {
      notification.classList.add('translate-x-full');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  },

  setupValidation() {
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
    });
  },

  validateField(field) {
    const value = field.value.trim();
    let isValid = true;

    if (field.hasAttribute('required') && !value) {
      isValid = false;
    } else if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
      }
    }

    if (isValid) {
      field.classList.remove('border-red-500');
    } else {
      field.classList.add('border-red-500');
    }

    return isValid;
  }
};

// 小游戏管理
const GameManager = {
  init() {
    this.initGuessGame();
    this.initRPSGame();
    this.initPuzzleGame();
  },

  // 猜数字游戏
  initGuessGame() {
    let targetNumber = Math.floor(Math.random() * 100) + 1;
    let attempts = 0;
    
    const input = document.getElementById('guess-input');
    const button = document.getElementById('guess-btn');
    const result = document.getElementById('guess-result');
    const attemptsDisplay = document.getElementById('guess-attempts');
    
    const resetGame = () => {
      targetNumber = Math.floor(Math.random() * 100) + 1;
      attempts = 0;
      result.textContent = '';
      attemptsDisplay.textContent = '';
      input.value = '';
      input.disabled = false;
      button.textContent = '猜一猜！';
      button.disabled = false;
    };
    
    const makeGuess = () => {
      const guess = parseInt(input.value);
      if (!guess || guess < 1 || guess > 100) {
        result.textContent = '请输入1-100之间的数字！';
        result.className = 'text-center text-sm font-medium text-red-500';
        return;
      }
      
      attempts++;
      
      if (guess === targetNumber) {
        result.textContent = `🎉 恭喜你猜对了！数字就是 ${targetNumber}`;
        result.className = 'text-center text-sm font-medium text-green-500';
        attemptsDisplay.textContent = `你用了 ${attempts} 次就猜中了！`;
        button.textContent = '再来一局';
        button.onclick = resetGame;
      } else if (guess < targetNumber) {
        result.textContent = '📈 太小了，再大一点！';
        result.className = 'text-center text-sm font-medium text-blue-500';
        attemptsDisplay.textContent = `已尝试 ${attempts} 次`;
      } else {
        result.textContent = '📉 太大了，再小一点！';
        result.className = 'text-center text-sm font-medium text-orange-500';
        attemptsDisplay.textContent = `已尝试 ${attempts} 次`;
      }
      
      input.value = '';
    };
    
    button?.addEventListener('click', makeGuess);
    input?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') makeGuess();
    });
  },

  // 石头剪刀布游戏
  initRPSGame() {
    const choices = ['rock', 'paper', 'scissors'];
    const emojis = { rock: '🪨', paper: '📄', scissors: '✂️' };
    const names = { rock: '石头', paper: '布', scissors: '剪刀' };
    
    let playerScore = 0;
    let aiScore = 0;
    
    const buttons = document.querySelectorAll('.rps-btn');
    const result = document.getElementById('rps-result');
    const score = document.getElementById('rps-score');
    
    const getWinner = (player, ai) => {
      if (player === ai) return 'tie';
      if (
        (player === 'rock' && ai === 'scissors') ||
        (player === 'paper' && ai === 'rock') ||
        (player === 'scissors' && ai === 'paper')
      ) {
        return 'player';
      }
      return 'ai';
    };
    
    const updateScore = () => {
      score.textContent = `你: ${playerScore} | AI: ${aiScore}`;
    };
    
    buttons.forEach(button => {
      button.addEventListener('click', () => {
        const playerChoice = button.dataset.choice;
        const aiChoice = choices[Math.floor(Math.random() * choices.length)];
        const winner = getWinner(playerChoice, aiChoice);
        
        // 添加点击动画
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
          button.style.transform = 'scale(1)';
        }, 150);
        
        let resultText = `你: ${emojis[playerChoice]} ${names[playerChoice]} | AI: ${emojis[aiChoice]} ${names[aiChoice]}<br/>`;
        
        if (winner === 'player') {
          playerScore++;
          resultText += '<span class="text-green-500 font-bold">🎉 你赢了！</span>';
          AudioManager.play('game_win');
          
          // 添加庆祝动画效果
          AnimationManager.createParticleExplosion(
            button.getBoundingClientRect().left + button.offsetWidth / 2,
            button.getBoundingClientRect().top + button.offsetHeight / 2,
            '#10b981'
          );
        } else if (winner === 'ai') {
          aiScore++;
          resultText += '<span class="text-red-500 font-bold">😅 AI赢了！</span>';
          AudioManager.play('game_lose');
        } else {
          resultText += '<span class="text-yellow-500 font-bold">🤝 平局！</span>';
          AudioManager.play('notification');
        }
        
        result.innerHTML = resultText;
        updateScore();
        
        // 为屏幕阅读器用户通知游戏结果
        const accessibleResultText = `你选择了${names[playerChoice]}，AI选择了${names[aiChoice]}，${winner === 'player' ? '你赢了' : winner === 'ai' ? 'AI赢了' : '平局'}！当前比分：你${playerScore}分，AI${aiScore}分`;
        AccessibilityManager.announceToScreenReader(accessibleResultText);
      });
    });
  },

  // 数字拼图游戏
  initPuzzleGame() {
    const grid = document.getElementById('puzzle-grid');
    const shuffleBtn = document.getElementById('puzzle-shuffle');
    const resetBtn = document.getElementById('puzzle-reset');
    const movesDisplay = document.getElementById('puzzle-moves');
    
    let tiles = [];
    let moves = 0;
    
    const createTiles = () => {
      grid.innerHTML = '';
      tiles = [];
      
      // 创建1-8的数字和一个空格
      for (let i = 1; i <= 9; i++) {
        const tile = document.createElement('div');
        tile.className = 'puzzle-tile flex items-center justify-center bg-light-primary dark:bg-dark-primary rounded text-lg font-bold cursor-pointer transition-all duration-300 hover:bg-accent-blue hover:text-white';
        
        if (i === 9) {
          tile.textContent = '';
          tile.className += ' opacity-0 pointer-events-none';
          tile.dataset.value = '0';
        } else {
          tile.textContent = i;
          tile.dataset.value = i.toString();
        }
        
        tile.addEventListener('click', () => moveTile(i - 1));
        grid.appendChild(tile);
        tiles.push(tile);
      }
    };
    
    const moveTile = (index) => {
      const emptyIndex = tiles.findIndex(tile => tile.dataset.value === '0');
      const validMoves = getValidMoves(emptyIndex);
      
      if (validMoves.includes(index)) {
        // 交换瓷砖
        const temp = tiles[index].dataset.value;
        const tempText = tiles[index].textContent;
        const tempClass = tiles[index].className;
        
        tiles[index].dataset.value = tiles[emptyIndex].dataset.value;
        tiles[index].textContent = tiles[emptyIndex].textContent;
        tiles[index].className = tiles[emptyIndex].className;
        
        tiles[emptyIndex].dataset.value = temp;
        tiles[emptyIndex].textContent = tempText;
        tiles[emptyIndex].className = tempClass;
        
        moves++;
        movesDisplay.textContent = `步数: ${moves}`;
        
        if (checkWin()) {
          setTimeout(() => {
            alert('🎉 恭喜你完成了拼图！');
          }, 300);
        }
      }
    };
    
    const getValidMoves = (emptyIndex) => {
      const validMoves = [];
      const row = Math.floor(emptyIndex / 3);
      const col = emptyIndex % 3;
      
      // 上
      if (row > 0) validMoves.push(emptyIndex - 3);
      // 下
      if (row < 2) validMoves.push(emptyIndex + 3);
      // 左
      if (col > 0) validMoves.push(emptyIndex - 1);
      // 右
      if (col < 2) validMoves.push(emptyIndex + 1);
      
      return validMoves;
    };
    
    const checkWin = () => {
      for (let i = 0; i < 8; i++) {
        if (tiles[i].dataset.value !== (i + 1).toString()) {
          return false;
        }
      }
      return tiles[8].dataset.value === '0';
    };
    
    const shuffle = () => {
      // 简单的随机交换方法
      for (let i = 0; i < 100; i++) {
        const emptyIndex = tiles.findIndex(tile => tile.dataset.value === '0');
        const validMoves = getValidMoves(emptyIndex);
        const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
        moveTile(randomMove);
      }
      moves = 0;
      movesDisplay.textContent = `步数: ${moves}`;
    };
    
    const reset = () => {
      createTiles();
      moves = 0;
      movesDisplay.textContent = `步数: ${moves}`;
    };
    
    shuffleBtn?.addEventListener('click', shuffle);
    resetBtn?.addEventListener('click', reset);
    
    // 初始化
    createTiles();
  }
};

// 性能监控管理
const PerformanceManager = {
  init() {
    if (!CONFIG.PERFORMANCE_MONITORING) return;
    
    this.measureLoadTime();
    this.setupResourceMonitoring();
    this.setupErrorTracking();
  },

  measureLoadTime() {
    window.addEventListener('load', () => {
      if ('performance' in window) {
        const perfData = performance.getEntriesByType('navigation')[0];
        const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
        const domContentLoaded = perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart;
        
        console.log('📊 性能数据:');
        console.log(`  页面加载时间: ${loadTime}ms`);
        console.log(`  DOM解析时间: ${domContentLoaded}ms`);
        console.log(`  首次内容绘制: ${this.getFirstContentfulPaint()}ms`);
        
        // 存储性能数据
        this.storePerformanceData({
          loadTime,
          domContentLoaded,
          fcp: this.getFirstContentfulPaint(),
          timestamp: Date.now()
        });
      }
    });
  },

  getFirstContentfulPaint() {
    const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0];
    return fcpEntry ? Math.round(fcpEntry.startTime) : 0;
  },

  setupResourceMonitoring() {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach(entry => {
        if (entry.transferSize > 500000) { // 大于500KB的资源
          console.warn(`⚠️ 大资源警告: ${entry.name} (${(entry.transferSize / 1024).toFixed(2)}KB)`);
        }
      });
    });
    observer.observe({ entryTypes: ['resource'] });
  },

  setupErrorTracking() {
    window.addEventListener('error', (event) => {
      console.error('❌ JavaScript错误:', {
        message: event.message,
        source: event.filename,
        line: event.lineno,
        column: event.colno
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      console.error('❌ Promise错误:', event.reason);
    });
  },

  storePerformanceData(data) {
    const key = 'ai-explorer-performance';
    const stored = JSON.parse(localStorage.getItem(key) || '[]');
    stored.push(data);
    
    // 只保留最近10次记录
    if (stored.length > 10) {
      stored.shift();
    }
    
    localStorage.setItem(key, JSON.stringify(stored));
  }
};

// 音效管理器
const AudioManager = {
  sounds: {},
  enabled: true,
  
  init() {
    this.createSounds();
    this.bindAudioControls();
    this.loadUserPreference();
  },
  
  createSounds() {
    // 使用Web Audio API创建音效
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // 创建不同类型的音效
    this.sounds = {
      click: this.createTone(800, 0.1, 'sine'),
      success: this.createTone(1000, 0.3, 'sine'),
      error: this.createTone(300, 0.2, 'sawtooth'),
      notification: this.createTone(600, 0.2, 'triangle'),
      game_win: this.createChord([523, 659, 784], 0.5),
      game_lose: this.createChord([220, 277, 330], 0.3),
      hover: this.createTone(400, 0.05, 'sine')
    };
  },
  
  createTone(frequency, duration, type = 'sine') {
    return () => {
      if (!this.enabled || !this.audioContext) return;
      
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = type;
      
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration);
    };
  },
  
  createChord(frequencies, duration) {
    return () => {
      if (!this.enabled || !this.audioContext) return;
      
      frequencies.forEach(freq => {
        this.createTone(freq, duration)();
      });
    };
  },
  
  play(soundName) {
    if (this.sounds[soundName] && this.enabled) {
      try {
        this.sounds[soundName]();
      } catch (error) {
        console.warn('音效播放失败:', error);
      }
    }
  },
  
  toggle() {
    this.enabled = !this.enabled;
    localStorage.setItem('audio_enabled', this.enabled.toString());
    
    // 更新UI指示器
    const audioToggle = document.getElementById('audio-toggle');
    if (audioToggle) {
      audioToggle.textContent = this.enabled ? '🔊' : '🔇';
      audioToggle.setAttribute('aria-label', this.enabled ? '关闭音效' : '开启音效');
    }
    
    return this.enabled;
  },
  
  bindAudioControls() {
    // 为所有按钮添加点击音效
    document.addEventListener('click', (e) => {
      if (e.target.tagName === 'BUTTON' || e.target.classList.contains('btn')) {
        this.play('click');
      }
    });
    
    // 为链接添加悬停音效
    document.addEventListener('mouseover', (e) => {
      if (e.target.tagName === 'A' || e.target.classList.contains('nav-link')) {
        this.play('hover');
      }
    });
  },
  
  loadUserPreference() {
    const savedPreference = localStorage.getItem('audio_enabled');
    if (savedPreference !== null) {
      this.enabled = savedPreference === 'true';
    }
    
    // 创建音效切换按钮
    this.createAudioToggle();
  },
  
  createAudioToggle() {
    const audioToggle = document.createElement('button');
    audioToggle.id = 'audio-toggle';
    audioToggle.className = 'fixed bottom-4 left-4 w-12 h-12 bg-accent-blue text-white rounded-full shadow-lg hover:bg-blue-600 transition-all duration-300 z-40';
    audioToggle.textContent = this.enabled ? '🔊' : '🔇';
    audioToggle.setAttribute('aria-label', this.enabled ? '关闭音效' : '开启音效');
    audioToggle.addEventListener('click', () => {
      this.toggle();
      this.play('click');
    });
    
    document.body.appendChild(audioToggle);
  }
};

// 动画增强管理器
const AnimationManager = {
  init() {
    this.setupAdvancedAnimations();
    this.setupParallaxEffects();
    this.setupMicroInteractions();
    this.setupLoadingAnimations();
  },
  
  setupAdvancedAnimations() {
    // 为卡片添加更丰富的动画
    const cards = document.querySelectorAll('.project-card, .blog-card, .game-card');
    cards.forEach((card, index) => {
      card.style.animationDelay = `${index * 0.1}s`;
      
      card.addEventListener('mouseenter', () => {
        this.addRippleEffect(card);
      });
    });
  },
  
  addRippleEffect(element) {
    const ripple = document.createElement('span');
    ripple.className = 'absolute inset-0 bg-white bg-opacity-20 rounded-lg transform scale-0 transition-transform duration-500';
    ripple.style.animation = 'ripple-effect 0.6s ease-out';
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  },
  
  setupParallaxEffects() {
    // 添加视差滚动效果
    const parallaxElements = document.querySelectorAll('.parallax');
    
    if (parallaxElements.length > 0) {
      window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        
        parallaxElements.forEach(element => {
          const rate = scrollTop * -0.5;
          element.style.transform = `translateY(${rate}px)`;
        });
      }, { passive: true });
    }
  },
  
  setupMicroInteractions() {
    // 添加微交互动画
    const interactiveElements = document.querySelectorAll('button, .btn, .nav-link');
    
    interactiveElements.forEach(element => {
      element.addEventListener('mousedown', () => {
        element.style.transform = 'scale(0.95)';
      });
      
      element.addEventListener('mouseup', () => {
        element.style.transform = 'scale(1)';
      });
      
      element.addEventListener('mouseleave', () => {
        element.style.transform = 'scale(1)';
      });
    });
  },
  
  setupLoadingAnimations() {
    // 为内容加载添加骨架屏动画
    const loadingElements = document.querySelectorAll('.loading-skeleton');
    
    loadingElements.forEach(element => {
      element.innerHTML = `
        <div class="animate-pulse">
          <div class="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div class="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
          <div class="h-4 bg-gray-300 rounded w-5/6"></div>
        </div>
      `;
    });
  },
  
  // 创建打字机效果
  typeWriter(element, text, speed = 50) {
    element.textContent = '';
    let i = 0;
    
    const type = () => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      }
    };
    
    type();
  },
  
  // 创建数字递增动画
  animateNumber(element, start, end, duration = 1000) {
    const range = end - start;
    const minTimer = 50;
    const stepTime = Math.abs(Math.floor(duration / range));
    const timer = stepTime < minTimer ? minTimer : stepTime;
    
    const startTime = new Date().getTime();
    const endTime = startTime + duration;
    
    const run = () => {
      const now = new Date().getTime();
      const remaining = Math.max((endTime - now) / duration, 0);
      const value = Math.round(end - (remaining * range));
      
      element.textContent = value;
      
      if (value !== end) {
        setTimeout(run, timer);
      }
    };
    
    run();
  },
  
  // 创建粒子爆炸效果
  createParticleExplosion(x, y, color = '#3b82f6') {
    const particleCount = 12;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'fixed w-2 h-2 rounded-full pointer-events-none z-50';
      particle.style.backgroundColor = color;
      particle.style.left = x + 'px';
      particle.style.top = y + 'px';
      
      const angle = (i / particleCount) * Math.PI * 2;
      const velocity = 100 + Math.random() * 50;
      const vx = Math.cos(angle) * velocity;
      const vy = Math.sin(angle) * velocity;
      
      document.body.appendChild(particle);
      
      // 动画粒子
      particle.animate([
        {
          transform: 'translate(0, 0) scale(1)',
          opacity: 1
        },
        {
          transform: `translate(${vx}px, ${vy}px) scale(0)`,
          opacity: 0
        }
      ], {
        duration: 800,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      }).onfinish = () => {
        particle.remove();
      };
    }
  }
};

// 无障碍访问管理
const AccessibilityManager = {
  init() {
    this.setupKeyboardNavigation();
    this.setupScreenReaderSupport();
    this.setupFocusManagement();
    this.setupSkipLinks();
    this.setupReducedMotion();
  },

  setupKeyboardNavigation() {
    // 添加键盘导航支持
    document.addEventListener('keydown', (e) => {
      // ESC键关闭模态框
      if (e.key === 'Escape') {
        const openModals = document.querySelectorAll('[id$="-modal"]:not(.hidden)');
        openModals.forEach(modal => {
          modal.classList.add('hidden');
          modal.classList.remove('flex');
        });
      }
      
      // Tab键焦点管理
      if (e.key === 'Tab') {
        this.handleTabNavigation(e);
      }
      
      // 空格键和回车键激活按钮
      if (e.key === ' ' || e.key === 'Enter') {
        const target = e.target;
        if (target.role === 'button' || target.classList.contains('btn-like')) {
          e.preventDefault();
          target.click();
        }
      }
    });
  },

  setupScreenReaderSupport() {
    // 为动态内容添加aria-live区域
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.id = 'live-region';
    document.body.appendChild(liveRegion);

    // 为交互元素添加适当的ARIA标签
    this.addAriaLabels();
  },

  addAriaLabels() {
    // 导航链接
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    navLinks.forEach(link => {
      const text = link.textContent.trim();
      link.setAttribute('aria-label', `导航到${text}页面`);
    });

    // 社交链接
    const socialLinks = document.querySelectorAll('.social-icon');
    socialLinks.forEach((link, index) => {
      const platforms = ['GitHub', 'Twitter', '微信'];
      link.setAttribute('aria-label', `访问我的${platforms[index] || '社交'}主页`);
    });

    // 游戏按钮
    const gameButtons = document.querySelectorAll('.rps-btn');
    const choices = ['石头', '布', '剪刀'];
    gameButtons.forEach((btn, index) => {
      btn.setAttribute('aria-label', `选择${choices[index]}`);
      btn.setAttribute('role', 'button');
    });

    // 表单标签
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      const label = document.querySelector(`label[for="${input.id}"]`);
      if (label && !input.getAttribute('aria-label')) {
        input.setAttribute('aria-describedby', input.id + '-desc');
      }
    });
  },

  setupFocusManagement() {
    // 添加焦点可见性指示器
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-navigation');
    });

    // 模态框焦点陷阱
    this.setupModalFocusTrap();
  },

  setupModalFocusTrap() {
    const modals = document.querySelectorAll('[id$="-modal"]');
    modals.forEach(modal => {
      modal.addEventListener('keydown', (e) => {
        if (e.key === 'Tab' && !modal.classList.contains('hidden')) {
          this.trapFocus(e, modal);
        }
      });
    });
  },

  trapFocus(e, container) {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  },

  setupSkipLinks() {
    // 添加跳转链接
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = '跳转到主要内容';
    skipLink.className = 'skip-link absolute top-0 left-0 bg-accent-blue text-white px-4 py-2 transform -translate-y-full focus:translate-y-0 z-50 transition-transform';
    skipLink.setAttribute('tabindex', '1');
    
    document.body.insertBefore(skipLink, document.body.firstChild);

    // 为主要内容区域添加ID
    const heroSection = document.getElementById('home');
    if (heroSection) {
      heroSection.id = 'main-content';
      heroSection.setAttribute('tabindex', '-1');
    }
  },

  setupReducedMotion() {
    // 检测用户的动画偏好
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
      document.body.classList.add('reduced-motion');
    }

    prefersReducedMotion.addEventListener('change', (e) => {
      if (e.matches) {
        document.body.classList.add('reduced-motion');
      } else {
        document.body.classList.remove('reduced-motion');
      }
    });
  },

  announceToScreenReader(message) {
    const liveRegion = document.getElementById('live-region');
    if (liveRegion) {
      liveRegion.textContent = message;
      setTimeout(() => {
        liveRegion.textContent = '';
      }, 1000);
    }
  },

  handleTabNavigation(e) {
    // 确保焦点在可见区域内
    setTimeout(() => {
      const focused = document.activeElement;
      if (focused) {
        focused.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        });
      }
    }, 0);
  }
};

// 内容管理系统
const ContentManager = {
  isEditMode: false,
  
  init() {
    this.createEditToggle();
    this.setupEditableContent();
    this.loadSavedContent();
  },
  
  createEditToggle() {
    const editToggle = document.createElement('button');
    editToggle.id = 'edit-toggle';
    editToggle.className = 'fixed bottom-4 right-4 w-12 h-12 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-all duration-300 z-40';
    editToggle.innerHTML = '✏️';
    editToggle.setAttribute('aria-label', '编辑模式开关');
    editToggle.addEventListener('click', () => {
      this.toggleEditMode();
    });
    
    document.body.appendChild(editToggle);
  },
  
  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
    const editToggle = document.getElementById('edit-toggle');
    
    if (this.isEditMode) {
      this.enableEditMode();
      editToggle.innerHTML = '💾';
      editToggle.setAttribute('aria-label', '保存并退出编辑模式');
      editToggle.classList.remove('bg-purple-600', 'hover:bg-purple-700');
      editToggle.classList.add('bg-green-600', 'hover:bg-green-700');
      
      AudioManager.play('success');
      AccessibilityManager.announceToScreenReader('已进入编辑模式');
    } else {
      this.disableEditMode();
      this.saveAllContent();
      editToggle.innerHTML = '✏️';
      editToggle.setAttribute('aria-label', '编辑模式开关');
      editToggle.classList.remove('bg-green-600', 'hover:bg-green-700');
      editToggle.classList.add('bg-purple-600', 'hover:bg-purple-700');
      
      AudioManager.play('notification');
      AccessibilityManager.announceToScreenReader('已退出编辑模式，内容已保存');
    }
  },
  
  enableEditMode() {
    // 使可编辑元素可编辑
    const editableElements = document.querySelectorAll('[data-editable]');
    editableElements.forEach(element => {
      element.contentEditable = true;
      element.classList.add('editable-active');
      element.style.border = '2px dashed #8b5cf6';
      element.style.padding = '0.5rem';
      element.style.borderRadius = '4px';
      
      // 添加编辑提示
      const hint = document.createElement('div');
      hint.className = 'edit-hint absolute -top-6 left-0 text-xs text-purple-600 bg-white px-2 py-1 rounded shadow z-10';
      hint.textContent = '点击编辑';
      element.style.position = 'relative';
      element.appendChild(hint);
    });
    
    document.body.classList.add('edit-mode');
  },
  
  disableEditMode() {
    // 禁用编辑
    const editableElements = document.querySelectorAll('[data-editable]');
    editableElements.forEach(element => {
      element.contentEditable = false;
      element.classList.remove('editable-active');
      element.style.border = '';
      element.style.padding = '';
      element.style.borderRadius = '';
      
      // 移除编辑提示
      const hint = element.querySelector('.edit-hint');
      if (hint) hint.remove();
    });
    
    document.body.classList.remove('edit-mode');
  },
  
  setupEditableContent() {
    // 标记可编辑的内容区域
    const editableSelectors = [
      '.hero-gradient-text',
      '.hero-section p',
      '.about-section p',
      '.project-card h3',
      '.project-card p',
      '.blog-card h3',
      '.blog-card p'
    ];
    
    editableSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        element.setAttribute('data-editable', 'true');
        element.setAttribute('data-content-key', this.generateContentKey(element));
      });
    });
  },
  
  generateContentKey(element) {
    // 生成内容键用于保存
    const section = element.closest('section')?.id || 'general';
    const tagName = element.tagName.toLowerCase();
    const index = Array.from(element.parentElement.children).indexOf(element);
    return `${section}-${tagName}-${index}`;
  },
  
  saveAllContent() {
    const editableElements = document.querySelectorAll('[data-editable]');
    const contentData = {};
    
    editableElements.forEach(element => {
      const key = element.getAttribute('data-content-key');
      contentData[key] = element.innerHTML;
    });
    
    localStorage.setItem('website_content', JSON.stringify(contentData));
    
    // 显示保存成功提示
    this.showSaveNotification();
  },
  
  loadSavedContent() {
    const savedContent = localStorage.getItem('website_content');
    if (savedContent) {
      try {
        const contentData = JSON.parse(savedContent);
        
        Object.entries(contentData).forEach(([key, content]) => {
          const element = document.querySelector(`[data-content-key="${key}"]`);
          if (element) {
            element.innerHTML = content;
          }
        });
      } catch (error) {
        console.warn('加载保存的内容失败:', error);
      }
    }
  },
  
  showSaveNotification() {
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
    notification.innerHTML = '✅ 内容已保存';
    
    document.body.appendChild(notification);
    
    // 动画显示
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    // 3秒后自动隐藏
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  },
  
  exportContent() {
    const editableElements = document.querySelectorAll('[data-editable]');
    const contentData = {};
    
    editableElements.forEach(element => {
      const key = element.getAttribute('data-content-key');
      contentData[key] = {
        content: element.innerHTML,
        textContent: element.textContent,
        timestamp: new Date().toISOString()
      };
    });
    
    const dataStr = JSON.stringify(contentData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'website-content-backup.json';
    link.click();
    
    AudioManager.play('success');
  },
  
  importContent(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const contentData = JSON.parse(e.target.result);
        
        Object.entries(contentData).forEach(([key, data]) => {
          const element = document.querySelector(`[data-content-key="${key}"]`);
          if (element && data.content) {
            element.innerHTML = data.content;
          }
        });
        
        this.saveAllContent();
        AudioManager.play('success');
        AccessibilityManager.announceToScreenReader('内容导入成功');
        
      } catch (error) {
        console.error('导入内容失败:', error);
        AudioManager.play('error');
        AccessibilityManager.announceToScreenReader('内容导入失败');
      }
    };
    
    reader.readAsText(file);
  }
};

// 缓存管理
const CacheManager = {
  init() {
    this.setupServiceWorker();
    this.manageLocalStorage();
  },

  setupServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('✅ Service Worker 注册成功');
        })
        .catch(error => {
          console.log('❌ Service Worker 注册失败:', error);
        });
    }
  },

  manageLocalStorage() {
    // 清理过期的缓存数据
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('ai-explorer-cache-')) {
        try {
          const data = JSON.parse(localStorage.getItem(key));
          if (data.expiry && Date.now() > data.expiry) {
            localStorage.removeItem(key);
          }
        } catch (e) {
          localStorage.removeItem(key);
        }
      }
    });
  },

  setCache(key, data, expiry = 24 * 60 * 60 * 1000) { // 默认24小时过期
    const cacheData = {
      data,
      expiry: Date.now() + expiry,
      version: CONFIG.CACHE_VERSION
    };
    localStorage.setItem(`ai-explorer-cache-${key}`, JSON.stringify(cacheData));
  },

  getCache(key) {
    try {
      const cached = localStorage.getItem(`ai-explorer-cache-${key}`);
      if (!cached) return null;
      
      const data = JSON.parse(cached);
      if (data.expiry && Date.now() > data.expiry) {
        localStorage.removeItem(`ai-explorer-cache-${key}`);
        return null;
      }
      
      if (data.version !== CONFIG.CACHE_VERSION) {
        localStorage.removeItem(`ai-explorer-cache-${key}`);
        return null;
      }
      
      return data.data;
    } catch (e) {
      return null;
    }
  }
};

// 留言板管理
const GuestbookManager = {
  messages: [],
  
  init() {
    this.bindForm();
    this.bindInteractions();
  },
  
  bindForm() {
    const form = document.getElementById('guestbook-form');
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('guest-name').value.trim();
      const email = document.getElementById('guest-email').value.trim();
      const message = document.getElementById('guest-message').value.trim();
      
      if (!name || !message) {
        this.showNotification('请填写昵称和留言内容！', 'error');
        return;
      }
      
      this.addMessage({ name, email, message });
      form.reset();
      this.showNotification('留言发表成功！感谢您的分享 🎉', 'success');
    });
  },
  
  addMessage({ name, email, message }) {
    const now = new Date();
    const timeStr = now.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    const newMessage = {
      id: Date.now(),
      name,
      email,
      message,
      time: timeStr,
      likes: 0
    };
    
    this.messages.unshift(newMessage);
    this.renderMessage(newMessage, true);
    this.updateMessageCount();
  },
  
  renderMessage(messageData, isNew = false) {
    const container = document.getElementById('messages-container');
    const messageEl = document.createElement('div');
    
    const avatar = messageData.name.charAt(0).toUpperCase();
    const colors = [
      'from-blue-400 to-purple-500',
      'from-green-400 to-blue-500',
      'from-purple-400 to-pink-500',
      'from-yellow-400 to-red-500',
      'from-indigo-400 to-purple-500'
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    messageEl.className = 'message-item bg-light-primary dark:bg-dark-primary rounded-2xl p-6 shadow-lg transform hover:-translate-y-1 transition-all duration-300';
    if (isNew) {
      messageEl.className += ' opacity-0 -translate-y-4';
    }
    
    messageEl.innerHTML = `
      <div class="flex items-start space-x-4">
        <div class="flex-shrink-0">
          <div class="w-12 h-12 bg-gradient-to-r ${randomColor} rounded-full flex items-center justify-center text-white font-bold text-lg">
            ${avatar}
          </div>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between mb-2">
            <h4 class="text-lg font-semibold text-light-text dark:text-dark-text">${messageData.name}</h4>
            <span class="text-sm text-light-text-secondary dark:text-dark-text-secondary">${messageData.time}</span>
          </div>
          <p class="text-light-text-secondary dark:text-dark-text-secondary leading-relaxed">
            ${messageData.message}
          </p>
          <div class="flex items-center space-x-4 mt-4">
            <button class="like-btn flex items-center text-light-text-secondary dark:text-dark-text-secondary hover:text-red-500 transition-colors duration-300" data-id="${messageData.id}">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
              <span class="like-count">${messageData.likes}</span>
            </button>
            <button class="reply-btn text-light-text-secondary dark:text-dark-text-secondary hover:text-accent-blue transition-colors duration-300">
              <svg class="w-4 h-4 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path>
              </svg>
              回复
            </button>
          </div>
        </div>
      </div>
    `;
    
    if (isNew) {
      container.insertBefore(messageEl, container.firstChild);
      // 触发动画
      setTimeout(() => {
        messageEl.classList.remove('opacity-0', '-translate-y-4');
      }, 100);
    } else {
      container.appendChild(messageEl);
    }
  },
  
  bindInteractions() {
    document.addEventListener('click', (e) => {
      if (e.target.closest('.like-btn')) {
        const btn = e.target.closest('.like-btn');
        const messageId = parseInt(btn.dataset.id);
        const likeCount = btn.querySelector('.like-count');
        
        // 增加点赞数
        const currentLikes = parseInt(likeCount.textContent);
        likeCount.textContent = currentLikes + 1;
        
        // 添加点赞动画
        btn.style.transform = 'scale(1.2)';
        btn.style.color = '#ef4444';
        setTimeout(() => {
          btn.style.transform = 'scale(1)';
        }, 200);
        
        this.showNotification('👍 点赞成功！', 'success');
      }
      
      if (e.target.closest('.reply-btn')) {
        this.showNotification('💬 回复功能开发中，敬请期待！', 'info');
      }
    });
  },
  
  updateMessageCount() {
    const countEl = document.getElementById('message-count');
    const totalMessages = this.messages.length + 3; // 包括示例留言
    countEl.textContent = `(${totalMessages})`;
  },
  
  showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    const bgColors = {
      success: 'bg-green-500',
      error: 'bg-red-500',
      info: 'bg-blue-500'
    };
    
    notification.className = `fixed top-4 right-4 z-50 ${bgColors[type]} text-white px-6 py-3 rounded-lg shadow-lg transform translate-x-full transition-transform duration-300`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.remove('translate-x-full');
    }, 100);
    
    setTimeout(() => {
      notification.classList.add('translate-x-full');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }
};

// 主应用初始化
class AIExplorerApp {
  init() {
    // 等待DOM加载完成
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initializeApp());
    } else {
      this.initializeApp();
    }
  }

  initializeApp() {
    try {
      // 初始化性能监控和缓存管理
      PerformanceManager.init();
      CacheManager.init();
      AccessibilityManager.init();
      AudioManager.init();
      AnimationManager.init();
      ContentManager.init();
      
      // 初始化各个模块
      LoadingManager.init();
      ThemeManager.init();
      NavigationManager.init();
      ScrollAnimationManager.init();
      ModalManager.init();
      FormManager.init();
      GameManager.init();
      GuestbookManager.init();
      
      // 延迟初始化粒子效果
      setTimeout(() => {
        ParticleManager.init();
      }, 1000);
      
      // 绑定全局事件
      this.bindGlobalEvents();
      
      console.log('🎉 AI探索者网站初始化完成');
      
    } catch (error) {
      console.error('❌ 初始化失败:', error);
    }
  }

  bindGlobalEvents() {
    // Hero区域按钮事件
    const viewProjectsBtn = document.getElementById('view-projects-btn');
    viewProjectsBtn?.addEventListener('click', () => {
      const projectsSection = document.getElementById('projects');
      projectsSection?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    });

    // 窗口大小变化
    window.addEventListener('resize', () => {
      const container = document.getElementById('particles-container');
      if (window.innerWidth <= 768) {
        container.style.display = 'none';
      } else {
        container.style.display = 'block';
      }
    });

    // 页面可见性变化
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        document.body.style.animationPlayState = 'paused';
      } else {
        document.body.style.animationPlayState = 'running';
      }
    });
  }
}

// 启动应用
const app = new AIExplorerApp();
app.init();

// 全局错误处理
window.addEventListener('error', (event) => {
  console.error('全局错误:', event.error);
});

// 导出到全局作用域
window.AIExplorerApp = app;
