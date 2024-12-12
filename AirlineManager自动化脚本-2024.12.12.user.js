// ==UserScript==
// @name         AirlineManager自动化脚本
// @namespace    http://tampermonkey.net/
// @version      2024.12.12
// @description  AirlineManager自动化脚本
// @author       JasonWong
// @match			*://*.www.airlinemanager.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // 随机延迟函数（返回一个 Promise，延迟随机时间）
    function randomDelay(min = 500, max = 1000) {
        const delay = Math.floor(Math.random() * (max - min + 1)) + min; // 随机延迟
        return new Promise(resolve => setTimeout(resolve, delay));
    }

    // 等待关闭按钮加载
    async function waitForCloseButton() {
        return new Promise(resolve => {
            const interval = setInterval(() => {
                const closeButton = document.querySelector('.glyphicons.glyphicons-remove.med-icon.opa.opa-rotate');
                if (closeButton) {
                    console.log('找到关闭窗口按钮');
                    clearInterval(interval); // 停止轮询
                    resolve(closeButton); // 返回找到的按钮
                } else {
                    console.log('关闭窗口按钮尚未加载，继续等待...');
                }
            }, 500); // 每隔 500 毫秒检查一次
        });
    }

    // 点击关闭窗口按钮
    async function clickCloseButton() {
        const closeButton = await waitForCloseButton(); // 等待关闭按钮加载
        console.log('准备点击关闭窗口按钮');
        closeButton.click();
        await randomDelay(); // 添加随机延迟

        // 如果关闭按钮的点击无效，尝试直接调用 closePop()
        if (typeof closePop === 'function') {
            console.log('调用 closePop 函数关闭窗口');
            closePop();
        } else {
            console.log('未找到 closePop 函数');
        }
    }

    // 点击按钮的通用函数
    async function clickButtonById(buttonId) {
        const button = document.getElementById(buttonId);
        if (button) {
            console.log(`找到按钮：${buttonId}，准备点击`);
            button.click();
            await randomDelay(); // 添加随机延迟
        } else {
            console.log(`未找到按钮：${buttonId}`);
        }
    }

    // 点击 Fuel 按钮
    async function clickFuelButton() {
        // 使用 querySelector 精确匹配 Finance 按钮
        const financeButton = document.querySelector('div.menu-btn-new[onclick*="fuel.php"]');
        if (financeButton) {
            console.log('找到 Fuel 按钮，准备点击');
            financeButton.click(); // 点击按钮
            await randomDelay(); // 添加随机延迟
        } else {
            console.log('未找到 Fuel 按钮');
        }
    }

    // 点击 Finance 按钮
    async function clickFinanceButton() {
        // 使用 querySelector 精确匹配 Finance 按钮
        const financeButton = document.querySelector('div.menu-btn-new[onclick*="finances.php"]');
        if (financeButton) {
            console.log('找到 Finance 按钮，准备点击');
            financeButton.click(); // 点击按钮
            await randomDelay(); // 添加随机延迟
        } else {
            console.log('未找到 Finance 按钮');
        }
    }

// 检查燃油价格并购买燃油
async function checkAndPurchaseFuel() {
    console.log('检测燃油价格...');

    // 获取当前价格（从 HTML 中提取）
    const priceElement = document.querySelector('.col-6.p-2 .text-danger b');
    if (priceElement) {
        const priceText = priceElement.textContent.trim(); // 获取价格文本，例如 "$ 1,360"
        const price = parseFloat(priceText.replace('$', '').replace(',', '')); // 转换为数值
        console.log(`当前燃油价格为：$${price}`);

        // 如果价格低于 $380，执行购买操作
        if (price < 380) {
            console.log('燃油价格低于 $380，准备购买...');

            // 在输入框中输入购买数量 1000000
            const amountInput = document.getElementById('amountInput');
            if (amountInput) {
                amountInput.value = '1000000'; // 输入购买数量
                console.log('已输入购买数量：1000000');
            } else {
                console.log('未找到燃油数量输入框');
                return;
            }

            // 点击购买按钮
            const purchaseButton = document.querySelector('.btn.btn-danger.btn-xs.btn-block.w-100');
            if (purchaseButton) {
                purchaseButton.click(); // 点击购买按钮
                console.log('已点击购买按钮');
            } else {
                console.log('未找到购买按钮');
            }
        } else {
            console.log('燃油价格高于 $380，跳过购买操作');
        }
    } else {
        console.log('未找到燃油价格元素');
    }
}

// 检查碳价格并购买燃油
async function checkAndPurchaseCO2() {
    console.log('检测碳价格...');

    // 获取当前价格（从 HTML 中提取）
    const priceElement = document.querySelector('.col-6.p-2 .text-danger b');
    if (priceElement) {
        const priceText = priceElement.textContent.trim(); // 获取价格文本，例如 "$ 1,360"
        const price = parseFloat(priceText.replace('$', '').replace(',', '')); // 转换为数值
        console.log(`当前碳价格为：$${price}`);

        // 如果价格低于 $105，执行购买操作
        if (price < 105) {
            console.log('碳价格低于 $105，准备购买...');

            // 在输入框中输入购买数量 1000000
            const amountInput = document.getElementById('amountInput');
            if (amountInput) {
                amountInput.value = '1000000'; // 输入购买数量
                console.log('已输入购买数量：1000000');
            } else {
                console.log('未找到碳数量输入框');
                return;
            }

            // 点击购买按钮
            const purchaseButton = document.querySelector('.btn.btn-danger.btn-xs.btn-block.w-100');
            if (purchaseButton) {
                purchaseButton.click(); // 点击购买按钮
                console.log('已点击购买按钮');
            } else {
                console.log('未找到购买按钮');
            }
        } else {
            console.log('碳价格高于 $105，跳过购买操作');
        }
    } else {
        console.log('未找到碳价格元素');
    }
}

    // 主逻辑函数
    async function runScript() {
        console.log('脚本正在运行...');

        // 任务一：增加航空声誉
        // 第一步：点击 Finance 按钮
        await clickFinanceButton();
        await randomDelay(); // 再次添加随机延迟
        await clickButtonById('popBtn2');
        await randomDelay(); // 再次添加随机延迟
        await clickCloseButton();
        await randomDelay(); // 再次添加随机延迟


        // 任务二：将所有飞机离场
        // 第一步：点击 mapRoutes 按钮
        await clickButtonById('mapRoutes');

        // 第二步：检查并点击 departAll 按钮
        const departAllButton = document.getElementById('departAll');
        if (departAllButton) {
            await randomDelay(); // 添加随机延迟
            console.log('找到 departAll 按钮，准备点击');
            departAllButton.click();

            //点击关闭窗口按钮
            await randomDelay(); // 再次添加随机延迟
            await clickCloseButton();
        } else {
            console.log('未找到 departAll 按钮');
            await randomDelay(); // 再次添加随机延迟
            await clickCloseButton();
        }
        await randomDelay(); // 再次添加随机延迟


        // 任务三：补充燃油和碳配额
        await clickFuelButton();
        await randomDelay(); // 再次添加随机延迟
        await checkAndPurchaseFuel();
        await randomDelay(); // 再次添加随机延迟
        await clickButtonById('popBtn2');
        await randomDelay(); // 再次添加随机延迟
        await checkAndPurchaseCO2();
        await randomDelay(); // 再次添加随机延迟
        await clickCloseButton();
        await randomDelay(); // 再次添加随机延迟


        // 任务四：自动A检及维护

    }

    // 脚本运行状态
    let isRunning = false; // 当前是否正在运行脚本
    let intervalId = null; // 用于存储 setInterval 的 ID

    // 启动脚本函数
    async function startScript() {
        console.log('脚本已启动，每分钟运行一次');
        await runScript(); // 立即运行一次主逻辑
        intervalId = setInterval(runScript, 600000); // 每 10 分钟运行一次主函数
        isRunning = true;
        updateButtonText(); // 更新按钮文字
    }

    // 停止脚本函数
    function stopScript() {
        console.log('脚本已停止');
        clearInterval(intervalId); // 停止 setInterval
        isRunning = false;
        updateButtonText(); // 更新按钮文字
    }

    // 更新按钮文字
    function updateButtonText() {
        const button = document.getElementById('startScriptButton');
        button.textContent = isRunning ? '停止脚本' : '启动脚本'; // 根据运行状态更新文字
    }

    // 在页面顶部添加启动按钮
    const button = document.createElement('button');
    button.id = 'startScriptButton';
    button.textContent = '启动脚本'; // 初始状态为启动脚本
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.left = '50%';
    button.style.transform = 'translateX(-50%)';
    button.style.zIndex = '9999';
    button.style.padding = '10px 20px';
    button.style.backgroundColor = '#007bff';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.fontSize = '16px';
    button.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    document.body.appendChild(button);

    // 启动按钮的点击事件
    button.addEventListener('click', () => {
        if (isRunning) {
            stopScript(); // 如果脚本正在运行，就停止
        } else {
            startScript(); // 如果脚本未运行，就启动
        }
    });
})();