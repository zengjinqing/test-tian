<script setup>
import { onMounted, reactive, ref } from "vue";

const state = reactive({
    config: {
        'initial': {
            frameWidth: 600,
            frameHeight: 600,
            rowNum: 10,
            colNum: 15,
            fps: 100,
            imgSrc: 'src/assets/zhushou/3唤醒状态_00000.png',
            type: 'cycle' //动画循环
        },
        'welcome': {
            frameWidth: 600,
            frameHeight: 600,
            rowNum: 10,
            colNum: 6,
            fps: 100,
            imgSrc: 'src/assets/zhushou/1-开机欢迎_00000.png',
            type: 'once' //动画执行一次
        },
        'warning': {
            frameWidth: 600,
            frameHeight: 600,
            rowNum: 10,
            colNum: 18,
            total: 175,
            fps: 50,
            imgSrc: 'src/assets/zhushou/5预警提醒_00000.png',
            type: 'once' //动画执行一次
        },
        'around': {
            frameWidth: 600,
            frameHeight: 600,
            rowNum: 10,
            colNum: 8,
            fps: 100,
            imgSrc: 'src/assets/zhushou/2飞一圈回到固定位置_00000.png',
            type: 'once', //动画执行一次
            left: '200px',
            top: '200px'
        },
        'back': {
            frameWidth: 600,
            frameHeight: 600,
            rowNum: 10,
            colNum: 8,
            fps: 100,
            imgSrc: 'src/assets/zhushou/2飞一圈回到固定位置_00000.png',
            type: 'once', //动画执行一次
            left: '50%',
            top: '50%'
        },
        'answer': {
            frameWidth: 600,
            frameHeight: 600,
            rowNum: 10,
            colNum: 16,
            fps: 50,
            imgSrc: 'src/assets/zhushou/6小助手说话问答_00000.png',
            type: 'once' //动画执行一次
        },

    }
})
const robotStyle = reactive({

    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',


})
onMounted(() => {
    robotAnimation(state.config['initial'])
})
let badRobotRef = ref(null)
function robotAnimation(config) {
    const canvas = document.getElementById('badRobot')
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('画布不支持');

    const spriteConfig = config
    let totalFrames = spriteConfig.rowNum * spriteConfig.colNum
    if (config.total) {
        totalFrames = config.total
    }
    const frameDuration = 1000 / spriteConfig.fps

    let lastFrameTime = null; //上一次绘制帧的时间
    let currentFrame = 0
    let isAnimationRunning = true

    const spriteImage = new Image()
    spriteImage.src = config.imgSrc
    spriteImage.onload = function () {
        lastFrameTime = Date.now(); //记录初始时间
        animate(); //开始动画
        if (config.left && config.top) {
            robotStyle.transition = 'all 3s ease'
            robotStyle.left = config.left
            robotStyle.top = config.top


        }

    }
    function animate() {
        if (!isAnimationRunning) return;
        const now = Date.now()

        if (lastFrameTime !== null && now - lastFrameTime >= frameDuration) {
            lastFrameTime = now;
            currentFrame = (currentFrame + 1) % totalFrames
            // 停止动画
            if (spriteConfig.type === 'once' && currentFrame === totalFrames - 1) {
                isAnimationRunning = false;
                robotStyle.transition = 'none'
            }
            drawFrames()
        }
        requestAnimationFrame(animate)
    }
    function drawFrames() {
        const col = currentFrame % 10; //前帧所在的列
        const row = Math.floor(currentFrame / 10); //当前帧所在的行
        const x = col * spriteConfig.frameWidth; //起始 X 坐标
        const y = row * spriteConfig.frameHeight; //起始 Y 坐标

        // 清除画布
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 绘制当前帧到画布上
        ctx.drawImage(
            spriteImage,
            x, y, spriteConfig.frameWidth, spriteConfig.frameHeight,
            0, 0, canvas.width, canvas.height
        );
    }
}
</script>

<template>
    <canvas v-draggable id="badRobot" :style="robotStyle" ref="badRobotRef" width="600" height="600"></canvas>
    <div class="options">
        <span style="margin-right: 10px;">options</span>
        <el-button @click="robotAnimation(state.config.welcome)">say hi</el-button>
        <el-button @click="robotAnimation(state.config.around)">fly around</el-button>
        <el-button @click="robotAnimation(state.config.back)">fly back</el-button>
        <el-button @click="robotAnimation(state.config.answer)">answer</el-button>
        <el-button @click="robotAnimation(state.config.warning)">warning</el-button>
        <el-button @click="robotAnimation(state.config.initial)">awake</el-button>
    </div>
</template>

<style scoped>
#badRobot {
    position: absolute;
    z-index: 10;
    cursor: pointer;


}

.options {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 2rem;
    display: flex;
    align-items: center;
    z-index: 1;
    background: gold;
    border-radius: 10px;
    padding: 10px 20px;

}
</style>