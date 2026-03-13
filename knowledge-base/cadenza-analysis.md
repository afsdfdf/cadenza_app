# Cadenza 项目分析

## 项目定位

Cadenza 是一个以音乐版权为底层资产的 RWA 协议，核心目标是把未来版税收入、版权权益和粉丝参与转化为可验证、可分拆、可交易、可分红的链上资产体系。

它的核心价值主张来自三类角色：

- 艺术家：把未来版税提前融资，降低对唱片公司的依赖
- 投资者：获得可分拆、可流动、透明结算的音乐版权资产
- 粉丝：从被动消费转向参与艺术家成长并获得经济回报

## 公共资料来源

- 官网：`https://cadenza.ink/`
- X：`https://x.com/cadenza_X`
- 白皮书：站点内 `Whitepaper.html`

本地镜像路径：

- `archive/cadenza-site/`
- `app/public/cadenza/whitepaper.html`

## 白皮书核心模块

### 1. NFT Copyright Verification

- 每首歌、专辑或版税合同先完成版权核验
- 版权、收益比例、期限、许可范围写入元数据
- 最终铸造成唯一版权 NFT

### 2. Fractionalized Tokens

- 版权 NFT 锁入协议合约
- 进一步拆分为 ERC-20 份额
- 投资者与粉丝可共同持有未来版税收益权

### 3. Marketplace & Liquidity Pools

- 艺术家通过首发出售份额获得资金
- 二级市场和 AMM 流动池支持持续交易
- 白皮书明确提到 Uniswap、Curve 等方向

### 4. Automated Royalty Distribution

- 流媒体和授权收入进入协议 Revenue Pool
- 智能合约按持仓自动结算
- 收益可用稳定币发放

### 5. Governance

- 通过 DAO 治理协议升级、分红频率、费用参数、合作伙伴
- 强调社区透明治理与审计可见性

## 商业逻辑

1. 艺术家上传作品与版权证明
2. 平台完成版权与身份验证
3. 版权 NFT 铸造并锁仓
4. ERC-20 份额发行
5. 首发融资与二级市场交易
6. 流媒体收入进入版税池
7. 稳定币自动分发到持有人

## 技术架构关键词

- Copyright NFT
- ERC-20 Fractionalization
- Revenue Pool
- Streaming Oracle
- Stablecoin Payout
- DAO Governance
- Compliance / KYC / AML

## 路线图

- 2025 Q4：Alpha，上线版权录入和 NFT Demo
- 2026 Q2：Beta，上线代币化与市场
- 2026 Q4：版税池与自动分红
- 2027 Q2：流动性扩展与跨链
- 2027 Q4：Spotify / Apple Music 等生态合作
- 2028+：扩展到影视配乐、游戏原声、现场演出权益

## 风险点

- 法律风险：版权真实性、授权边界、跨司法辖区
- 市场风险：二级市场流动性不足、估值波动
- 技术风险：智能合约和预言机错误
- 运营风险：收入报表不准确、平台宕机
- 合规风险：KYC/AML 与证券监管边界

## 本次产品原型策略

为了最大程度贴近白皮书而又保持可演示性，这次 App 重点落地为：

- Discover：音乐版权资产发现与品牌首页
- Vault：版税收入、持仓、稳定币分配
- Mint：艺术家上传与版权 NFT 铸造流程
- Market：音乐资产份额认购与流动性展示
- DAO：提案投票、参数治理与协议透明度

## 当前公开资料缺口

- 未见真实链上合约地址
- 未见正式审计报告
- 未见公开 API 文档
- X 入口已知，但公共站点未展示可验证社媒运营细节
- 白皮书强调平台能力，但实际生产系统接口尚未公开
