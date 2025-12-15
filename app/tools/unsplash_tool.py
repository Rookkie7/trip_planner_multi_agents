import requests
from ..config import get_settings
import os
from typing import Optional, List, Dict, Any
from hello_agents import ToolRegistry
from hello_agents.tools import Tool, ToolParameter

class UnsplashTool(Tool):
    """Unsplash图片服务类"""

    def __init__(self):
        """初始化服务"""
        super().__init__(
            name="image_searcher",
            description="一个智能图片搜索引擎。根据输入的地点或食物或酒店名称自动搜索对应的图片。"
        )
        settings = get_settings()
        self.access_key = settings.unsplash_access_key
        self.base_url = "https://api.unsplash.com"

    def search_photos(self, query: str, per_page: int = 5) -> List[dict]:
        """
        搜索图片

        Args:
            query: 搜索关键词
            per_page: 每页数量

        Returns:
            图片列表
        """
        try:
            url = f"{self.base_url}/search/photos"
            params = {
                "query": query,
                "per_page": per_page,
                "client_id": self.access_key
            }

            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()

            data = response.json()
            results = data.get("results", [])

            # 提取图片URL
            photos = []
            for photo in results:
                photos.append({
                    "id": photo.get("id"),
                    "url": photo.get("urls", {}).get("regular"),
                    "thumb": photo.get("urls", {}).get("thumb"),
                    "description": photo.get("description") or photo.get("alt_description"),
                    "photographer": photo.get("user", {}).get("name")
                })

            return photos

        except Exception as e:
            print(f"❌ Unsplash搜索失败: {str(e)}")
            return []

    def get_photo_url(self, query: str) -> Optional[str]:
        """
        获取单张图片URL

        Args:
            query: 搜索关键词

        Returns:
            图片URL
        """
        photos = self.search_photos(query, per_page=1)
        if photos:
            return photos[0].get("url")
        return None


    def run(self, parameters: Dict[str, Any]) -> str:
        """
        执行图片搜索

        Args:
            parameters: 包含query参数的字典

        Returns:
            图片URL
        """
        query = parameters.get("query", "")
        if not query:
            return "错误：请提供搜索关键词"

        print(f"🔍 正在搜索图片: {query}")

        try:
            url = self.get_photo_url(query)
            if url:
                print(f"✅ 图片搜索成功: {url}")
                return url
            else:
                return "未找到图片"
        except  Exception as e:
            error_msg = f"图片搜索失败: {str(e)}"
            print(f"❌ {error_msg}")
            return error_msg

    def get_parameters(self):
        """获取工具参数定义"""
        return [
            ToolParameter(
                name="query",
                type="string",
                description="图片搜索关键词",
                required=True
            )
        ]