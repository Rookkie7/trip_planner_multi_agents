import logging
from ..agents.agents import get_trip_planner_agent
from ..agents.request_agent import get_request_parser

from fastapi import APIRouter, HTTPException
from ..model.models import (
    TripRequest,
    TripPlanResponse,
    ErrorResponse,
    ParseRequestInput,
    ParseRequestResponse
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/request", tags=["请求解析"])

@router.post(
    "/parse-request",
    response_model=ParseRequestResponse,
    summary="解析自然语言请求",
    description="将用户的自然语言旅行请求解析为结构化数据，并判断信息是否完整"
)
async def parse_user_request(request: ParseRequestInput):
    """
    解析用户自然语言请求

    Args:
        request: 包含用户输入的请求

    Returns:
        解析结果，包含状态和数据
    """
    try:
        print(f"\n{'=' * 60}")
        print(f"📝 收到自然语言解析请求:")
        print(f"   用户输入: {request.user_input}")
        print(f"{'=' * 60}\n")

        # 获取Agent实例
        agent = get_request_parser()

        # 解析用户请求
        result = agent.parse_user_request(request.user_input)

        # 根据解析结果返回
        if result.get("status") == "complete":
            # 信息完整，可以直接调用plan
            return ParseRequestResponse(
                success=True,
                status="complete",
                trip_request=result.get("data"),
                message="信息完整，可以开始规划旅行"
            )
        elif result.get("status") == "incomplete":
            # 信息不完整
            return ParseRequestResponse(
                success=True,
                status="incomplete",
                missing_fields=result.get("missing_fields", []),
                suggestions=result.get("suggestions", ""),
                partial_data=result.get("partial_data", {}),
                message="请补充必要信息"
            )
        else:
            # 解析错误
            return ParseRequestResponse(
                success=False,
                status="error",
                message=result.get("message", "解析失败")
            )

    except Exception as e:
        print(f"❌ 解析请求失败: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"解析请求失败: {str(e)}"
        )


@router.get(
    "/health",
    summary="健康检查",
    description="检查请求分析服务是否正常"
)
async def health_check():
    """健康检查"""
    try:
        # 检查Agent是否可用
        agent = get_request_parser()

        return {
            "status": "healthy",
            "service": "request-parse-agent"
        }
    except Exception as e:
        raise HTTPException(
            status_code=503,
            detail=f"服务不可用: {str(e)}"
        )
