# 智能旅行规划助手

基于 HelloAgents 框架的多智能体旅行规划系统，提供智能化的旅行行程规划服务。

## 项目简介

这是一个完整的旅行规划应用，包含：
- **后端 API**：基于 FastAPI 和 HelloAgents 的智能规划引擎
- **前端应用**：基于 React + TypeScript 的现代化 Web 界面

## 主要功能

### 智能规划
- 景点推荐（基于高德地图API提供的MCP服务器）
- 天气查询集成
- 酒店推荐
- 餐饮建议
- 预算管理
- 图片展示（集成自研Unsplash工具）

### 双重输入模式
1. **自然语言输入**：用户用自然语言描述需求，AI 自动解析，可多轮对话解析
2. **表单输入**：结构化输入，精确控制各项参数

### 多智能体协作
- 景点搜索 Agent
- 天气查询 Agent
- 酒店推荐 Agent
- 行程规划 Agent
- 自然语言解析 Agent

## 快速开始

### 环境要求

- Python 3.8+
- Node.js 18+
- 高德地图 API Key
- OpenAI API Key（或兼容的 LLM API）

### 安装依赖

#### 后端
```bash
pip install -r requirements.txt
```

#### 前端
```bash
cd frontend
npm install
```

### 配置环境变量

在项目根目录创建 `.env` 文件：

```env
# 高德地图 API
AMAP_API_KEY=your_amap_api_key

# Unsplash API（可选）
UNSPLASH_ACCESS_KEY=your_unsplash_access_key
UNSPLASH_SECRET_KEY=your_unsplash_secret_key

# LLM 配置
LLM_API_KEY=your_openai_api_key
LLM_BASE_URL=https://api.openai.com/v1
LLM_MODEL_ID=gpt-4
```

### 启动服务

#### 启动后端 API

```bash
uvicorn app.main:app --reload
```

后端将运行在 `http://localhost:8000`

#### 启动前端应用

```bash
cd frontend
npm run dev
```

前端将运行在 `http://localhost:5173`

## API 文档

启动后端后，访问以下地址查看 API 文档：

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### 主要 API 端点

#### 1. 生成旅行计划
- **POST** `/api/trip/plan`
- 请求体：`TripRequest`
- 响应：`TripPlanResponse`

#### 2. 解析自然语言请求
- **POST** `/api/request/parse-request`
- 请求体：`{ user_input: string }`
- 响应：`ParseRequestResponse`

## 项目结构

```
.
├── app/                      # 后端应用
│   ├── agents/              # 智能体模块
│   │   ├── agents.py       # 主要规划 Agent
│   │   └── request_agent.py # 自然语言解析 Agent
│   ├── model/               # 数据模型
│   ├── router/              # API 路由
│   ├── services/            # 服务层
│   ├── tools/               # 自定义工具
│   ├── config.py            # 配置管理
│   └── main.py              # 应用入口
├── frontend/                 # 前端应用
│   ├── src/
│   │   ├── components/      # React 组件
│   │   ├── pages/           # 页面组件
│   │   ├── services/        # API 服务
│   │   └── types/           # TypeScript 类型
│   └── package.json
└── README.md
```

## 技术栈

### 后端
- **框架**: FastAPI
- **AI 框架**: HelloAgents
- **LLM**: OpenAI API（可兼容其他）
- **数据源**: 
  - 高德地图 API（POI、天气）
  - Unsplash API（图片）

### 前端
- **框架**: React 18 + TypeScript
- **构建工具**: Vite
- **UI**: TailwindCSS
- **路由**: React Router
- **HTTP**: Axios
- **图标**: Lucide React

## 使用示例

### 自然语言输入
```
我想6月1日到6月3日去北京玩3天，喜欢历史文化景点和美食，希望住经济型酒店
```

### 表单输入
- 目的地：北京
- 开始日期：2025-06-01
- 结束日期：2025-06-03
- 旅行天数：3
- 交通方式：公共交通
- 住宿类型：经济型酒店
- 偏好：历史文化、美食

## 开发说明

### 添加新的 Agent
1. 在 `app/agents/` 创建新的 Agent 文件
2. 定义 Agent 的系统提示词
3. 注册所需的工具
4. 在主规划流程中集成

### 添加新的工具
1. 在 `app/tools/` 创建工具类
2. 继承 `Tool` 基类
3. 实现 `run()` 方法
4. 在 Agent 中注册使用

## 注意事项

1. 确保所有 API Key 已正确配置
2. 高德地图 API 有调用限额，注意配额管理
3. LLM API 调用可能需要较长时间，已设置 120 秒超时
4. 图片搜索为可选功能，失败时会显示默认占位图

## License

MIT

## 致谢

- [HelloAgents](https://github.com/yourusername/hello-agents) - AI Agent 框架
- [高德地图开放平台](https://lbs.amap.com/) - 地图和 POI 数据
- [Unsplash](https://unsplash.com/) - 高质量图片
