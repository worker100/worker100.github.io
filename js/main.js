// AI探索者个人网站 - 主JavaScript文件

// 全局配置
const CONFIG = {
  LOADING_DURATION: 2000,
  PARTICLE_COUNT: 50,
  THEME_STORAGE_KEY: 'ai-explorer-theme'
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

// 加载动画管理
const LoadingManager = {
  init() {
    const loadingScreen = document.getElementById('loading-screen');
    
    setTimeout(() => {
      if (loadingScreen) {
        loadingScreen.classList.add('fade-out');
        setTimeout(() => {
          loadingScreen.style.display = 'none';
        }, 500);
      }
    }, CONFIG.LOADING_DURATION);
  }
};

// 导航管理
const NavigationManager = {
  init() {
    this.bindMobileMenu();
    this.bindSmoothScroll();
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
      // 初始化各个模块
      LoadingManager.init();
      ThemeManager.init();
      NavigationManager.init();
      ScrollAnimationManager.init();
      ModalManager.init();
      FormManager.init();
      
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
