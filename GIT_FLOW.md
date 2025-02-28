# Git Flow 工作流程指南

本项目使用 Git Flow 工作流程来管理代码版本和发布流程。以下是详细的分支策略和使用指南。

## 主要分支

### main 分支
- 用途：存储生产环境的代码
- 特点：永远保持可部署状态
- 来源：只能从 `release/*` 或 `hotfix/*` 分支合并

### develop 分支
- 用途：主要开发分支，包含最新的开发特性
- 特点：包含所有已完成的特性
- 来源：从 `feature/*`、`release/*` 或 `hotfix/*` 分支合并

## 支持分支

### feature/* 分支
- 命名规范：`feature/功能名称`
- 用途：开发新功能
- 来源：从 `develop` 分支创建
- 合并到：`develop` 分支
- 示例：
  ```bash
  # 创建功能分支
  git checkout -b feature/new-feature develop
  
  # 完成功能后合并回 develop
  git checkout develop
  git merge --no-ff feature/new-feature
  git branch -d feature/new-feature
  ```

### release/* 分支
- 命名规范：`release/版本号`
- 用途：准备发布新版本
- 来源：从 `develop` 分支创建
- 合并到：`main` 和 `develop` 分支
- 示例：
  ```bash
  # 创建发布分支
  git checkout -b release/1.0.0 develop
  
  # 完成发布准备后
  git checkout main
  git merge --no-ff release/1.0.0
  git tag -a v1.0.0
  
  git checkout develop
  git merge --no-ff release/1.0.0
  
  git branch -d release/1.0.0
  ```

### hotfix/* 分支
- 命名规范：`hotfix/问题描述`
- 用途：修复生产环境的紧急问题
- 来源：从 `main` 分支创建
- 合并到：`main` 和 `develop` 分支
- 示例：
  ```bash
  # 创建热修复分支
  git checkout -b hotfix/critical-bug main
  
  # 完成修复后
  git checkout main
  git merge --no-ff hotfix/critical-bug
  git tag -a v1.0.1
  
  git checkout develop
  git merge --no-ff hotfix/critical-bug
  
  git branch -d hotfix/critical-bug
  ```

## 版本标签管理

- 主版本发布：v1.0.0、v2.0.0
- 功能更新：v1.1.0、v1.2.0
- 问题修复：v1.0.1、v1.0.2

## 最佳实践

1. 提交信息规范：
   - feat: 新功能
   - fix: 修复问题
   - docs: 文档更新
   - style: 代码格式调整
   - refactor: 代码重构
   - test: 测试相关
   - chore: 构建过程或辅助工具的变动

2. 分支管理：
   - 及时删除已合并的功能分支
   - 保持分支的整洁和可追踪性
   - 使用 `--no-ff` 参数保留分支合并历史

3. 代码审查：
   - 所有代码变更都需要通过代码审查
   - 创建 Pull Request 进行团队协作
   - 确保代码符合项目规范

4. 冲突解决：
   - 经常从目标分支更新代码
   - 在本地解决冲突后再推送
   - 必要时与团队成员协商解决方案

## 工作流程示例

1. 开始新功能开发：
   ```bash
   git checkout develop
   git pull
   git checkout -b feature/new-feature
   # 进行开发...
   ```

2. 完成功能开发：
   ```bash
   git checkout develop
   git pull
   git merge --no-ff feature/new-feature
   git push origin develop
   ```

3. 准备版本发布：
   ```bash
   git checkout develop
   git pull
   git checkout -b release/1.0.0
   # 进行版本准备工作...
   ```

4. 完成版本发布：
   ```bash
   git checkout main
   git merge --no-ff release/1.0.0
   git tag -a v1.0.0
   git push origin main --tags
   
   git checkout develop
   git merge --no-ff release/1.0.0
   git push origin develop
   ```

5. 处理紧急问题：
   ```bash
   git checkout main
   git checkout -b hotfix/urgent-fix
   # 修复问题...
   
   git checkout main
   git merge --no-ff hotfix/urgent-fix
   git tag -a v1.0.1
   git push origin main --tags
   
   git checkout develop
   git merge --no-ff hotfix/urgent-fix
   git push origin develop
   ``` 