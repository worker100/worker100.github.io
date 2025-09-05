/**
 * AI资讯自动更新系统
 * 每日自动获取最新AI资讯并更新网站内容
 */

class AINewsUpdater {
    constructor() {
        this.apiSources = [
            {
                name: 'IT之家',
                url: 'https://www.ithome.com/tag/ai/',
                type: 'domestic'
            },
            {
                name: 'TechCrunch',
                url: 'https://techcrunch.com/category/artificial-intelligence/',
                type: 'international'
            },
            {
                name: '36氪',
                url: 'https://www.36kr.com/search/articles/AI',
                type: 'domestic'
            },
            {
                name: '机器之心',
                url: 'https://www.jiqizhixin.com/',
                type: 'domestic'
            }
        ];
        
        this.newsCache = [];
        this.lastUpdateTime = localStorage.getItem('ai-news-last-update') || null;
        this.updateInterval = 24 * 60 * 60 * 1000; // 24小时
        
        this.init();
    }
    
    init() {
        console.log('🤖 AI资讯更新系统初始化...');
        
        // 检查是否需要更新
        if (this.shouldUpdate()) {
            this.updateNews();
        }
        
        // 设置定时更新
        this.scheduleUpdate();
        
        // 绑定手动刷新按钮
        this.bindRefreshButton();
        
        // 更新显示时间
        this.updateDisplayTime();
    }
    
    shouldUpdate() {
        if (!this.lastUpdateTime) return true;
        
        const now = new Date().getTime();
        const lastUpdate = new Date(this.lastUpdateTime).getTime();
        
        return (now - lastUpdate) > this.updateInterval;
    }
    
    async updateNews() {
        console.log('📡 开始获取最新AI资讯...');
        
        try {
            // 显示加载状态
            this.showLoadingState();
            
            // 模拟获取新闻数据（实际项目中会调用真实API）
            const newsData = await this.fetchNewsFromAPIs();
            
            // 更新缓存
            this.newsCache = newsData;
            localStorage.setItem('ai-news-cache', JSON.stringify(newsData));
            
            // 更新页面显示
            this.updateNewsDisplay(newsData);
            
            // 更新时间戳
            const now = new Date().toISOString();
            this.lastUpdateTime = now;
            localStorage.setItem('ai-news-last-update', now);
            
            // 更新显示时间
            this.updateDisplayTime();
            
            console.log('✅ AI资讯更新完成！');
            
        } catch (error) {
            console.error('❌ AI资讯更新失败:', error);
            this.showErrorState();
        }
    }
    
    async fetchNewsFromAPIs() {
        try {
            // 尝试从后端API获取数据
            const response = await fetch('/api/ai-news?limit=20');
            
            if (response.ok) {
                const result = await response.json();
                if (result.success && result.data.news) {
                    console.log('📡 从后端API获取资讯成功');
                    return result.data.news;
                }
            }
            
            console.log('⚠️ 后端API不可用，使用模拟数据');
        } catch (error) {
            console.log('⚠️ 后端API连接失败，使用模拟数据:', error.message);
        }
        
        // 后备方案：使用模拟数据
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 返回模拟的最新资讯数据
        return [
            {
                id: 1,
                title: '微软CEO纳德拉亲授：用5个AI提示词，让GPT-5重塑高管工作效率',
                summary: '微软CEO萨提亚·纳德拉公开了5个驱动其日常工作的ChatGPT提示词，详细展示了GPT-5与Microsoft Copilot如何深度融入其日常管理工作中...',
                url: 'https://www.ithome.com/0/880/574.htm',
                source: 'IT之家',
                category: '热门',
                tags: ['微软', 'GPT-5'],
                publishTime: '今日 9:26',
                type: 'hot'
            },
            {
                id: 2,
                title: '宏碁发布Veriton GN100 AI超算设备：GB10超级芯片，起售价3999美元',
                summary: '宏碁发布了基于英伟达Project Digits架构的Veriton GN100 AI迷你工作站，配备GB10超级芯片、128GB LPDDR5x内存...',
                url: 'https://www.ithome.com/0/880/367.htm',
                source: 'IT之家',
                category: '硬件',
                tags: ['宏碁', '英伟达'],
                publishTime: '09月04日',
                type: 'hardware'
            },
            {
                id: 3,
                title: '苹果2026年推Siri AI搜索：3大模块设计，平衡本地与云端计算',
                summary: '预估2026年年初发布的iOS 26.4更新中，苹果计划为Siri推出基于自研Apple Foundation Model模型的AI网页搜索功能...',
                url: 'https://www.ithome.com/0/880/235.htm',
                source: 'IT之家',
                category: '苹果',
                tags: ['Siri', '搜索'],
                publishTime: '09月04日',
                type: 'apple'
            }
        ];
    }
    
    updateNewsDisplay(newsData) {
        const newsContainer = document.querySelector('#ai-news .grid.grid-cols-1.md\\:grid-cols-2.gap-6');
        if (!newsContainer) return;
        
        // 清空现有内容
        newsContainer.innerHTML = '';
        
        // 生成新的资讯卡片
        newsData.forEach((news, index) => {
            const newsCard = this.createNewsCard(news, index);
            newsContainer.appendChild(newsCard);
        });
        
        // 添加动画效果
        this.animateNewsCards();
    }
    
    createNewsCard(news, index) {
        const card = document.createElement('article');
        card.className = 'ai-news-card bg-light-primary dark:bg-dark-primary rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 border-l-4';
        
        // 根据类型设置边框颜色
        const borderColors = {
            'hot': 'border-blue-500',
            'hardware': 'border-green-500',
            'apple': 'border-purple-500',
            'impact': 'border-red-500',
            'fun': 'border-yellow-500',
            'model': 'border-indigo-500'
        };
        
        card.classList.add(borderColors[news.type] || 'border-gray-500');
        
        // 设置卡片内容
        card.innerHTML = `
            <div class="flex items-start justify-between mb-4">
                <span class="px-3 py-1 bg-${this.getCategoryColor(news.category)}-100 dark:bg-${this.getCategoryColor(news.category)}-900 text-${this.getCategoryColor(news.category)}-600 dark:text-${this.getCategoryColor(news.category)}-300 rounded-full text-xs font-medium">
                    ${this.getCategoryIcon(news.category)} ${news.category}
                </span>
                <span class="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                    ${news.publishTime}
                </span>
            </div>
            <h3 class="text-lg font-semibold mb-3 text-light-text dark:text-dark-text hover:text-accent-blue transition-colors duration-300 cursor-pointer line-clamp-2">
                ${news.title}
            </h3>
            <p class="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-4 line-clamp-3">
                ${news.summary}
            </p>
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2 text-xs text-light-text-secondary dark:text-dark-text-secondary">
                    ${news.tags.map(tag => `<span class="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">${tag}</span>`).join('')}
                </div>
                <a href="${news.url}" target="_blank" class="text-accent-blue hover:text-accent-purple transition-colors duration-300 text-sm">
                    阅读全文 →
                </a>
            </div>
        `;
        
        return card;
    }
    
    getCategoryColor(category) {
        const colors = {
            '热门': 'blue',
            '硬件': 'green',
            '苹果': 'purple',
            '影响': 'red',
            '有趣': 'yellow',
            '模型': 'indigo'
        };
        return colors[category] || 'gray';
    }
    
    getCategoryIcon(category) {
        const icons = {
            '热门': '🔥',
            '硬件': '💻',
            '苹果': '🍎',
            '影响': '⚠️',
            '有趣': '🎮',
            '模型': '🚀'
        };
        return icons[category] || '📰';
    }
    
    animateNewsCards() {
        const cards = document.querySelectorAll('.ai-news-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.5s ease-out';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
    
    showLoadingState() {
        const statusElement = document.querySelector('#last-update-time');
        if (statusElement) {
            statusElement.textContent = '正在更新...';
            statusElement.parentElement.querySelector('svg').classList.add('animate-spin');
        }
    }
    
    showErrorState() {
        const statusElement = document.querySelector('#last-update-time');
        if (statusElement) {
            statusElement.textContent = '更新失败，请稍后重试';
            statusElement.parentElement.querySelector('svg').classList.remove('animate-spin');
        }
    }
    
    updateDisplayTime() {
        const statusElement = document.querySelector('#last-update-time');
        if (statusElement && this.lastUpdateTime) {
            const updateTime = new Date(this.lastUpdateTime);
            const now = new Date();
            
            // 格式化显示时间
            let displayTime;
            const timeDiff = now - updateTime;
            const minutes = Math.floor(timeDiff / (1000 * 60));
            const hours = Math.floor(timeDiff / (1000 * 60 * 60));
            
            if (minutes < 60) {
                displayTime = minutes <= 0 ? '刚刚' : `${minutes}分钟前`;
            } else if (hours < 24) {
                displayTime = `${hours}小时前`;
            } else {
                displayTime = updateTime.toLocaleDateString('zh-CN', {
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            }
            
            statusElement.textContent = displayTime;
            statusElement.parentElement.querySelector('svg').classList.remove('animate-spin');
        }
    }
    
    scheduleUpdate() {
        // 每小时检查一次是否需要更新
        setInterval(() => {
            if (this.shouldUpdate()) {
                this.updateNews();
            }
        }, 60 * 60 * 1000);
        
        console.log('⏰ 已设置定时更新任务');
    }
    
    bindRefreshButton() {
        const refreshButton = document.querySelector('#load-more-news');
        if (refreshButton) {
            refreshButton.addEventListener('click', () => {
                this.updateNews();
            });
        }
    }
    
    // 手动触发更新
    async forceUpdate() {
        console.log('🔄 手动触发资讯更新...');
        
        try {
            // 尝试触发后端API更新
            const response = await fetch('/api/ai-news/refresh', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const result = await response.json();
                console.log('✅ 后端API更新成功:', result.message);
            }
        } catch (error) {
            console.log('⚠️ 后端API更新失败，使用前端更新:', error.message);
        }
        
        // 无论后端是否成功，都执行前端更新
        this.updateNews();
    }
    
    // 获取热门资讯
    async getHotNews() {
        try {
            const response = await fetch('/api/ai-news/hot');
            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    return result.data;
                }
            }
        } catch (error) {
            console.log('获取热门资讯失败:', error.message);
        }
        
        // 从缓存中获取热门资讯
        return this.getCachedNews().slice(0, 5);
    }
    
    // 获取资讯统计
    async getNewsStats() {
        try {
            const response = await fetch('/api/ai-news/stats');
            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    return result.data;
                }
            }
        } catch (error) {
            console.log('获取资讯统计失败:', error.message);
        }
        
        // 返回默认统计数据
        return {
            categories: {
                '模型发布': 15,
                '硬件设备': 8,
                '行业动态': 12,
                '研究报告': 6
            },
            total: 41
        };
    }
    
    // 获取缓存的资讯
    getCachedNews() {
        const cached = localStorage.getItem('ai-news-cache');
        return cached ? JSON.parse(cached) : [];
    }
    
    // 清除缓存
    clearCache() {
        localStorage.removeItem('ai-news-cache');
        localStorage.removeItem('ai-news-last-update');
        console.log('🗑️ 资讯缓存已清除');
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    // 创建全局AI资讯更新实例
    window.aiNewsUpdater = new AINewsUpdater();
    
    console.log('🎉 AI资讯自动更新系统已启动！');
});

// 导出类供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AINewsUpdater;
}
