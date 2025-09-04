// AI探索者个人网站 - 主JavaScript文件

// 全局配置
const CONFIG = {
  LOADING_DURATION: 2000,
  PARTICLE_COUNT: 50,
  THEME_STORAGE_KEY: 'ai-explorer-theme',
  CACHE_VERSION: '1.0.0',
  PERFORMANCE_MONITORING: true
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
    if (loadingScreen) {
      setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
          loadingScreen.style.display = 'none';
        }, 500);
      }, CONFIG.LOADING_DURATION);
    }
  }
};

// 导航管理
const NavigationManager = {
  init() {
    this.bindMobileMenu();
    this.bindSmoothScroll();
    this.setupMobileOptimizations();
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
      
      // 防止iOS双击缩放
      let lastTouchEnd = 0;
      document.addEventListener('touchend', (event) => {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
          event.preventDefault();
        }
        lastTouchEnd = now;
      }, false);
    }
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
    this.setupCounters();
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
          const progress = bar.getAttribute('data-progress') || '0%';
          const progressBar = bar.querySelector('.skill-progress');
          setTimeout(() => {
            progressBar.style.width = progress;
          }, 200);
        }
      });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => skillObserver.observe(bar));
  },

  setupCounters() {
    const counters = document.querySelectorAll('.counter');
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const target = parseInt(counter.dataset.target) || 0;
          this.animateCounter(counter, 0, target, 2000);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
  },

  animateCounter(element, start, end, duration) {
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
    this.bindGuestbookForm();
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

  bindGuestbookForm() {
    const guestbookForm = document.getElementById('guestbook-form');
    guestbookForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('guest-name').value.trim();
      const email = document.getElementById('guest-email').value.trim();
      const message = document.getElementById('guest-message').value.trim();
      
      if (!name || !message) {
        this.showNotification('请填写昵称和留言内容！', 'error');
        return;
      }
      
      this.addGuestMessage({ name, email, message });
      guestbookForm.reset();
      this.showNotification('留言发表成功！感谢您的分享 🎉', 'success');
    });
  },

  addGuestMessage({ name, email, message }) {
    const now = new Date();
    const timeStr = now.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    const container = document.getElementById('messages-container');
    const messageEl = document.createElement('div');
    
    const avatar = name.charAt(0).toUpperCase();
    const colors = [
      'from-blue-400 to-purple-500',
      'from-green-400 to-blue-500',
      'from-purple-400 to-pink-500',
      'from-yellow-400 to-red-500'
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    messageEl.className = 'message-item bg-light-primary dark:bg-dark-primary rounded-2xl p-6 shadow-lg transform hover:-translate-y-1 transition-all duration-300 opacity-0 -translate-y-4';
    
    messageEl.innerHTML = `
      <div class="flex items-start space-x-4">
        <div class="flex-shrink-0">
          <div class="w-12 h-12 bg-gradient-to-r ${randomColor} rounded-full flex items-center justify-center text-white font-bold text-lg">
            ${avatar}
          </div>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between mb-2">
            <h4 class="text-lg font-semibold text-light-text dark:text-dark-text">${name}</h4>
            <span class="text-sm text-light-text-secondary dark:text-dark-text-secondary">${timeStr}</span>
          </div>
          <p class="text-light-text-secondary dark:text-dark-text-secondary leading-relaxed">
            ${message}
          </p>
          <div class="flex items-center space-x-4 mt-4">
            <button class="like-btn flex items-center text-light-text-secondary dark:text-dark-text-secondary hover:text-red-500 transition-colors duration-300">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
              <span class="like-count">0</span>
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
    
    container.insertBefore(messageEl, container.firstChild);
    
    // 触发动画
    setTimeout(() => {
      messageEl.classList.remove('opacity-0', '-translate-y-4');
    }, 100);
    
    // 更新留言数量
    const countEl = document.getElementById('message-count');
    const currentCount = parseInt(countEl.textContent.match(/\d+/)[0]);
    countEl.textContent = `(${currentCount + 1})`;
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
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
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
    this.bindLikeButtons();
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
      button.onclick = makeGuess;
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
        } else if (winner === 'ai') {
          aiScore++;
          resultText += '<span class="text-red-500 font-bold">😅 AI赢了！</span>';
        } else {
          resultText += '<span class="text-yellow-500 font-bold">🤝 平局！</span>';
        }
        
        result.innerHTML = resultText;
        updateScore();
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
  },

  bindLikeButtons() {
    document.addEventListener('click', (e) => {
      if (e.target.closest('.like-btn')) {
        const btn = e.target.closest('.like-btn');
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
        
        FormManager.showNotification('👍 点赞成功！', 'success');
      }
      
      if (e.target.closest('.reply-btn')) {
        FormManager.showNotification('💬 回复功能开发中，敬请期待！', 'success');
      }
    });
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
      GameManager.init();
      
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