import logging
logger = logging.getLogger(__name__)
import json
from typing import Dict, Any

from hello_agents.agents import SimpleAgent
from ..model.models import TripRequest,ParseRequestResponse,ParseRequestInput
from ..services.llm_service import get_llm

REQUEST_PARSER_PROMPT = """你是旅行请求解析专家。你的任务是将用户的自然语言请求解析为结构化的旅行规划请求。

**你的职责：**
1. 解析用户请求，提取以下关键信息：
   - 目的地城市 (city)
   - 旅行时间范围 (start_date, end_date)
   - 旅行天数 (travel_days)
   - 交通方式偏好 (transportation)
   - 住宿偏好 (accommodation)
   - 旅行偏好标签 (preferences)
   - 其他特殊要求 (free_text_input)

2. 判断信息是否完整：
   - **必需信息**：目的地城市 (city),旅行时间范围 (start_date, end_date),旅行天数 (travel_days),交通方式偏好 (transportation),住宿偏好 (accommodation)
   - **可选信息**：旅行偏好标签 (preferences), 其他特殊要求 (free_text_input)

3. 输出格式：
   - 如果信息完整：返回JSON格式的完整TripRequest
   - 如果信息不完整：返回缺失字段和建议

**输出格式示例：**

**信息完整时：**
```json
{
  "status": "complete",
  "data": {
    "city": "北京",
    "start_date": "2025-06-01",
    "end_date": "2025-06-03",
    "travel_days": 3,
    "transportation": "公共交通",
    "accommodation": "经济型酒店",
    "preferences": ["历史文化", "美食"],
    "free_text_input": "希望多安排一些博物馆"
  }
}
```

**信息不完整时：**
```json
{
  "status": "incomplete",
  "missing_fields": ["start_date", "end_date"],
  "suggestions": "请提供具体的旅行日期，例如：6月1日到6月3日",
  "partial_data": {
    "city": "北京",
    "preferences": ["美食"]
  }
}
```

**处理规则：**
1. 注意必需信息和可选信息，如果必需信息缺失，一定要按信息不完整格式返回
2. 如果用户说"下周去北京玩3天"，应尝试推断具体日期
3. 偏好标签尽量从用户描述中提取关键词
4. 保持对话自然，可以请求用户补充信息 
5. 请严格按照上述格式输出回答，不要生成多余回答，做到判断准确
"""


class RequestAgent():
    """
    自然语言解析agent
    """
    def __init__(self):
        logger.info("初始化自然语言解析系统")
        try:
            self.llm = get_llm()
            logger.info("初始化LLM服务成功")

            logger.info("正在初始化自然语言解析agent")
            self.request_parser_agent = SimpleAgent(
                name = "自然语言解析agent",
                llm=self.llm,
                system_prompt=REQUEST_PARSER_PROMPT
            )
        except Exception as e:
            logger.error("初始化LLM服务失败：%s", e)
            raise e


    def parse_user_request(self, user_input: str) -> Dict[str, Any]:
        """
        解析用户的自然语言请求

        Args:
            user_input: 用户自然语言描述

        Returns:
            解析结果，包含状态和相应数据
        """
        try:
            logger.info(f"\n{'=' * 60}")
            logger.info(f"🧠 解析用户请求: {user_input[:100]}...")
            logger.info(f"{'=' * 60}\n")

            # 调用解析Agent
            response = self.request_parser_agent.run(user_input)

            # 尝试解析JSON响应
            try:
                # 提取JSON部分
                if "```json" in response:
                    json_start = response.find("```json") + 7
                    json_end = response.find("```", json_start)
                    json_str = response[json_start:json_end].strip()
                elif "```" in response:
                    json_start = response.find("```") + 3
                    json_end = response.find("```", json_start)
                    json_str = response[json_start:json_end].strip()
                elif "{" in response and "}" in response:
                    json_start = response.find("{")
                    json_end = response.rfind("}") + 1
                    json_str = response[json_start:json_end]
                else:
                    # 如果没有JSON，尝试直接解析为JSON
                    json_str = response

                result = json.loads(json_str)
                print(f"✅ 请求解析成功，状态: {result.get('status')}")
                return result

            except json.JSONDecodeError:
                # 如果不是JSON格式，说明agent没有按格式输出
                print(f"⚠️  Agent响应不是标准JSON格式: {response[:200]}")
                return {
                    "status": "error",
                    "message": "解析失败，请重新描述您的需求",
                    "raw_response": response
                }

        except Exception as e:
            print(f"❌ 请求解析失败: {str(e)}")
            return {
                "status": "error",
                "message": f"解析失败: {str(e)}"
            }



_request_parser = None

def get_request_parser() -> RequestAgent:
    """获取请求解析系统实例(单例模式)"""
    global _request_parser
    if _request_parser is None:
        _request_parser = RequestAgent()
    return _request_parser