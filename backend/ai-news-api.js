/**
 * AI资讯API服务
 * 提供AI资讯的获取、缓存和管理功能
 */

const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const fs = require('fs').promises;
const path = require('path');

class AINewsAPI {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3001;
        this.newsCache = [];
        this.lastUpdate = null;
        this.cacheFile = path.join(__dirname, 'data', 'ai-news-cache.json');
        
        this.setupMiddleware();
        this.setupRoutes();
        this.loadCache();
        this.scheduleUpdates();
    }
    
    setupMiddleware() {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.static('public'));
    }
    
    setupRoutes() {
        // 获取最新AI资讯
        this.app.get('/api/ai-news', async (req, res) => {
            try {
                const { page = 1, limit = 10, category } = req.query;
                
                let news = this.newsCache;
                
                // 按分类筛选
                if (category && category !== 'all') {
                    news = news.filter(item => 
                        item.category.toLowerCase() === category.toLowerCase()
                    );
                }
                
                // 分页
                const startIndex = (page - 1) * limit;
                const endIndex = startIndex + parseInt(limit);
                const paginatedNews = news.slice(startIndex, endIndex);
                
                res.json({
                    success: true,
                    data: {
                        news: paginatedNews,
                        total: news.length,
                        page: parseInt(page),
                        limit: parseInt(limit),
                        hasMore: endIndex < news.length,
                        lastUpdate: this.lastUpdate
                    }
                });
                
            } catch (error) {
                console.error('获取AI资讯失败:', error);
                res.status(500).json({
                    success: false,
                    message: '获取AI资讯失败',
                    error: error.message
                });
            }
        });
        
        // 获取热门资讯
        this.app.get('/api/ai-news/hot', async (req, res) => {
            try {
                const hotNews = this.newsCache
                    .filter(item => item.type === 'hot' || item.views > 1000)
                    .slice(0, 5);
                
                res.json({
                    success: true,
                    data: hotNews
                });
                
            } catch (error) {
                console.error('获取热门资讯失败:', error);
                res.status(500).json({
                    success: false,
                    message: '获取热门资讯失败',
                    error: error.message
                });
            }
        });
        
        // 获取资讯分类统计
        this.app.get('/api/ai-news/stats', async (req, res) => {
            try {
                const stats = {};
                
                this.newsCache.forEach(item => {
                    const category = item.category;
                    stats[category] = (stats[category] || 0) + 1;
                });
                
                res.json({
                    success: true,
                    data: {
                        categories: stats,
                        total: this.newsCache.length,
                        lastUpdate: this.lastUpdate
                    }
                });
                
            } catch (error) {
                console.error('获取统计数据失败:', error);
                res.status(500).json({
                    success: false,
                    message: '获取统计数据失败',
                    error: error.message
                });
            }
        });
        
        // 手动触发更新
        this.app.post('/api/ai-news/refresh', async (req, res) => {
            try {
                await this.fetchLatestNews();
                
                res.json({
                    success: true,
                    message: 'AI资讯更新成功',
                    data: {
                        count: this.newsCache.length,
                        lastUpdate: this.lastUpdate
                    }
                });
                
            } catch (error) {
                console.error('手动更新失败:', error);
                res.status(500).json({
                    success: false,
                    message: '更新失败',
                    error: error.message
                });
            }
        });
        
        // 健康检查
        this.app.get('/api/health', (req, res) => {
            res.json({
                success: true,
                message: 'AI资讯API服务运行正常',
                timestamp: new Date().toISOString(),
                uptime: process.uptime()
            });
        });
    }
    
    async loadCache() {
        try {
            // 确保数据目录存在
            await fs.mkdir(path.dirname(this.cacheFile), { recursive: true });
            
            const cacheData = await fs.readFile(this.cacheFile, 'utf-8');
            const cache = JSON.parse(cacheData);
            
            this.newsCache = cache.news || [];
            this.lastUpdate = cache.lastUpdate;
            
            console.log(`✅ 加载缓存成功，共 ${this.newsCache.length} 条资讯`);
            
        } catch (error) {
            console.log('📝 缓存文件不存在，将创建新的缓存');
            await this.fetchLatestNews();
        }
    }
    
    async saveCache() {
        try {
            const cacheData = {
                news: this.newsCache,
                lastUpdate: this.lastUpdate,
                version: '1.0'
            };
            
            await fs.writeFile(this.cacheFile, JSON.stringify(cacheData, null, 2));
            console.log('💾 缓存保存成功');
            
        } catch (error) {
            console.error('💾 缓存保存失败:', error);
        }
    }
    
    async fetchLatestNews() {
        console.log('🔄 开始获取最新AI资讯...');
        
        try {
            // 这里应该调用真实的API，目前使用模拟数据
            const mockNews = await this.getMockNews();
            
            // 合并新旧数据，去重
            const existingIds = new Set(this.newsCache.map(item => item.id));
            const newNews = mockNews.filter(item => !existingIds.has(item.id));
            
            this.newsCache = [...newNews, ...this.newsCache].slice(0, 100); // 保留最新100条
            this.lastUpdate = new Date().toISOString();
            
            await this.saveCache();
            
            console.log(`✅ 获取AI资讯成功，新增 ${newNews.length} 条`);
            
        } catch (error) {
            console.error('❌ 获取AI资讯失败:', error);
            throw error;
        }
    }
    
    async getMockNews() {
        // 模拟API调用延迟
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const categories = ['热门', '硬件', '苹果', '影响', '有趣', '模型'];
        const types = ['hot', 'hardware', 'apple', 'impact', 'fun', 'model'];
        const sources = ['IT之家', 'TechCrunch', '36氪', '机器之心'];
        
        const mockNews = [];
        const now = new Date();
        
        for (let i = 0; i < 20; i++) {
            const categoryIndex = Math.floor(Math.random() * categories.length);
            const publishTime = new Date(now - Math.random() * 7 * 24 * 60 * 60 * 1000);
            
            mockNews.push({
                id: `news_${Date.now()}_${i}`,
                title: this.generateMockTitle(categories[categoryIndex]),
                summary: this.generateMockSummary(categories[categoryIndex]),
                url: `https://example.com/news/${Date.now()}_${i}`,
                source: sources[Math.floor(Math.random() * sources.length)],
                category: categories[categoryIndex],
                type: types[categoryIndex],
                tags: this.generateMockTags(categories[categoryIndex]),
                publishTime: this.formatPublishTime(publishTime),
                timestamp: publishTime.getTime(),
                views: Math.floor(Math.random() * 5000) + 100,
                likes: Math.floor(Math.random() * 500) + 10
            });
        }
        
        return mockNews.sort((a, b) => b.timestamp - a.timestamp);
    }
    
    generateMockTitle(category) {
        const titles = {
            '热门': [
                '微软CEO纳德拉分享AI提示词技巧，助力企业数字化转型',
                'OpenAI发布GPT-5预览版，性能提升显著',
                '谷歌推出全新AI搜索功能，改变信息获取方式',
                'Meta开源最新AI模型，推动行业发展'
            ],
            '硬件': [
                '英伟达发布新一代AI芯片，算力再创新高',
                '苹果M4芯片集成神经网络引擎，AI性能翻倍',
                'AMD推出AI加速卡，挑战英伟达市场地位',
                '华为昇腾AI芯片获得重大突破'
            ],
            '苹果': [
                'iOS 18.2集成ChatGPT功能，Siri智能升级',
                '苹果AI搜索功能即将上线，挑战谷歌地位',
                'Mac Studio配备M4 Ultra芯片，AI创作新标杆',
                'Apple Intelligence在中国市场的本土化策略'
            ],
            '影响': [
                'AI技术对就业市场的深远影响分析',
                '人工智能在医疗领域的伦理考量',
                'AI监管政策最新进展，行业规范日趋完善',
                '教育行业如何应对AI技术冲击'
            ],
            '有趣': [
                'AI绘画大赛结果出炉，机器创意超越人类',
                '聊天机器人通过图灵测试，AI智能新里程碑',
                'AI作曲家创作交响乐，音乐界掀起讨论',
                '虚拟AI主播走红网络，直播行业新变革'
            ],
            '模型': [
                'Anthropic发布Claude 4，推理能力大幅提升',
                '百度文心一言4.0版本上线，中文理解更精准',
                '开源大模型Llama 3性能评测，超越商业模型',
                '多模态AI模型突破，文本图像理解一体化'
            ]
        };
        
        const categoryTitles = titles[category] || titles['热门'];
        return categoryTitles[Math.floor(Math.random() * categoryTitles.length)];
    }
    
    generateMockSummary(category) {
        const summaries = {
            '热门': '最新的AI技术动态和行业趋势，展现人工智能领域的快速发展和创新突破，为从业者和爱好者提供前沿资讯。',
            '硬件': '硬件厂商在AI芯片和计算设备方面的最新进展，包括性能提升、架构优化和市场竞争格局的变化。',
            '苹果': '苹果公司在人工智能领域的战略布局和产品创新，涵盖软硬件一体化的AI解决方案。',
            '影响': '人工智能技术对社会、经济、就业等各个层面产生的深远影响，以及相关的政策和伦理讨论。',
            '有趣': 'AI领域的有趣应用和创新实验，展现人工智能技术的创意潜力和未来可能性。',
            '模型': '最新的AI模型发布和技术突破，包括性能评测、能力对比和应用场景分析。'
        };
        
        return summaries[category] || summaries['热门'];
    }
    
    generateMockTags(category) {
        const tags = {
            '热门': ['AI', '人工智能', '技术趋势'],
            '硬件': ['芯片', '硬件', 'GPU'],
            '苹果': ['苹果', 'iOS', 'Mac'],
            '影响': ['就业', '社会', '伦理'],
            '有趣': ['创意', '艺术', '娱乐'],
            '模型': ['大模型', 'LLM', '开源']
        };
        
        return tags[category] || tags['热门'];
    }
    
    formatPublishTime(date) {
        const now = new Date();
        const timeDiff = now - date;
        const minutes = Math.floor(timeDiff / (1000 * 60));
        const hours = Math.floor(timeDiff / (1000 * 60 * 60));
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        
        if (minutes < 60) {
            return minutes <= 0 ? '刚刚' : `${minutes}分钟前`;
        } else if (hours < 24) {
            return `${hours}小时前`;
        } else if (days < 7) {
            return `${days}天前`;
        } else {
            return date.toLocaleDateString('zh-CN', {
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    }
    
    scheduleUpdates() {
        // 每2小时更新一次
        cron.schedule('0 */2 * * *', async () => {
            console.log('⏰ 定时更新AI资讯...');
            try {
                await this.fetchLatestNews();
            } catch (error) {
                console.error('⏰ 定时更新失败:', error);
            }
        });
        
        console.log('⏰ 定时任务已启动：每2小时更新一次AI资讯');
    }
    
    start() {
        this.app.listen(this.port, () => {
            console.log(`🚀 AI资讯API服务已启动`);
            console.log(`📡 服务地址: http://localhost:${this.port}`);
            console.log(`📊 API文档: http://localhost:${this.port}/api/health`);
            console.log(`📰 当前缓存: ${this.newsCache.length} 条资讯`);
        });
    }
}

// 启动服务
const aiNewsAPI = new AINewsAPI();
aiNewsAPI.start();

// 优雅关闭
process.on('SIGINT', () => {
    console.log('\n🛑 正在关闭AI资讯API服务...');
    process.exit(0);
});

module.exports = AINewsAPI;
