<script setup lang="ts">
const projectItems = [
  {
    title: 'Element Plus',
    avatar: 'https://element-plus.org/images/element-plus-logo.svg',
    description: '在这个快速变化的世界中，唯有坚持初心才能找到方向',
    author: '前端开发者联盟',
    datetime: '刚刚'
  },
  {
    title: 'Vue 3',
    avatar: 'https://vuejs.org/images/logo.png',
    description: '每一次的尝试都是一次成长，未来属于勇敢者',
    author: '代码精灵',
    datetime: '3年前'
  },
  {
    title: 'Vitest',
    avatar: 'https://vitest.dev/logo.svg',
    description: '测试是软件开发的基石，确保每一行代码都能如预期般运行',
    author: '测试驱动开发团队',
    datetime: '刚刚'
  },
  {
    title: 'TypeScript',
    avatar: 'https://www.typescriptlang.org/favicon.ico',
    description: '类型系统让代码更安全，开发更高效',
    author: '编程语言爱好者',
    datetime: '2年前'
  },
  {
    title: 'pnpm',
    avatar: 'https://pnpm.io/img/pnpm-no-name-with-frame.svg',
    description: '高效的包管理工具，让依赖管理变得轻松',
    author: '开源社区',
    datetime: '刚刚'
  },
  {
    title: 'Less',
    avatar: 'https://lesscss.org/public/img/less_logo.png',
    description: 'CSS的未来在于简化，Less让样式更具可维护性',
    author: '前端设计师',
    datetime: '1年前'
  }
]
const activities = [
  {
    username: '张三',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/WhxKECPNujWoWEFNdnJE.png',
    project: '用户体验优化小组',
    action: '创建了',
    event: '第三季度规划'
  },
  {
    username: '李四',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/WhxKECPNujWoWEFNdnJE.png',
    project: '用户体验优化小组',
    action: '更新了',
    event: '第三季度规划'
  },
  {
    username: '王五',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/WhxKECPNujWoWEFNdnJE.png',
    project: '前端开发小分队',
    action: '创建了',
    event: '第三季度规划'
  },
  {
    username: '赵六',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/WhxKECPNujWoWEFNdnJE.png',
    project: '前端开发小分队',
    action: '更新了',
    event: '技术分享会'
  },
  {
    username: '陈七',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/WhxKECPNujWoWEFNdnJE.png',
    project: '敏捷实践者',
    action: '发布了',
    event: '团队博客'
  },
  {
    username: '刘八',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/WhxKECPNujWoWEFNdnJE.png',
    project: '技术前沿探索',
    action: '创建了',
    event: '产品设计指南'
  }
]
</script>

<template>
  <div class="container">
    <!-- 头部区域 -->

    <!-- 主体内容 -->
    <el-row :gutter="24">
      <el-col :xs="24" :sm="16">
        <!-- 进行中的项目卡片 -->
        <el-card shadow="hover" :body-style="{ padding: '10px' }">
          <template #header>
            <h1 style="float: left">进行中的项目</h1>
            <div class="clearfix">
              <el-button type="text" style="float: right">全部项目</el-button>
            </div>
          </template>
          <!-- 项目列表 -->
          <div class="project-container">
            <div class="project" v-for="item in projectItems" :key="item.title">
              <div class="project-header">
                <img class="project-img" :src="item.avatar" :alt="item.title" />
                <p class="project-title">{{ item.title }}</p>
              </div>
              <p class="project-description">{{ item.description }}</p>
              <p class="project-author">
                {{ item.author }} <span class="project-datetime">{{ item.datetime }}</span>
              </p>
            </div>
          </div>
        </el-card>

        <!-- 动态卡片 -->
        <el-card shadow="hover" :body-style="{ padding: '10px' }" style="margin-top: 20px">
          <template #header>
            <div class="card-header">
              <h1>动态</h1>
            </div>
          </template>
          <!-- 动态列表 -->
          <div v-for="item in activities" :key="item.username">
            <div class="activity-item">
              <el-avatar :src="item.avatar" class="avatar" size="small" />
              <div class="activity-content">
                {{ item.username }} 在 <a href="#">{{ item.project }}</a> {{ item.action }}
                <a href="#">{{ item.event }}</a>
              </div>
              <div class="time">几秒前</div>
            </div>
            <el-divider />
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="8"> <el-empty description="description" /> </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="less">
.project-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0px;
  .project {
    background-color: white;
    padding: 20px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .project-header {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      .project-title {
        font-size: 16px;
        font-weight: bold;
        margin: 0;
      }
    }
  }
}
.project-img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}
.project-description {
  color: #666;
  font-size: 14px;
  margin: 10px 0;
}
.project-author {
  font-size: 12px;
  color: #999;
  .project-datetime {
    font-size: 12px;
    color: #999;
    margin-left: 5px;
  }
}

.activity-item {
  display: flex;
  align-items: center;
  padding: 10px;
  .avatar {
    margin-right: 10px;
  }
  .activity-content {
    color: #333;
    a {
      color: #0066cc;
      text-decoration: none;
    }
  }
}
.time {
  margin-left: auto;
  color: #999;
  font-size: 12px;
}

.el-divider {
  margin: 10px 0;
}
</style>
