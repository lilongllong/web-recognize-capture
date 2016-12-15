## 后续任务

## 流程
时间序列保存-> 无效子笔画排除 -> 物理分割和碰撞检测 -> 分割后的笔画识别 ->

### 单笔
- 错误单笔识别和去除
    - 现行方式：对于独立的单笔画，拆分现有笔迹的笔画作为自对比模型，若某笔画不符合这些对比模型则去除，避免干扰
    - 现行方式：对于组合中的单笔画，不太好判断。例如两个正确的笔迹因为用户多画一条线导致连接起来。

### 多笔
- 优化笔迹碰撞检测
- 优化笔迹排序组合方式：时间+笔画顺序 => 空间 来确定笔画分布
- 优化空间判定笔画组合图形的判定方式
    - 现在的方式：采用笔画最短距离和各笔迹辐射范围 * 辐射参数的相对大小来确定是否组合在一起。
-

### 回退机制
- 笔画的撤销

### 笔画和dom对应机制
