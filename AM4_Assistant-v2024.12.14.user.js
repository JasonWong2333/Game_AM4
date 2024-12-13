// ==UserScript==
// @name         AM4_Assistant
// @namespace    http://tampermonkey.net/
// @version      v2024.12.14
// @description  《航空经理4》小助手，点击网页上方的启动脚本即可运行
// @author       JasonWong
// @match			*://*.www.airlinemanager.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    function toggleSettingsPopup() {
        const popup = document.getElementById('settingsPopup');
        popup.style.display = popup.style.display === 'none' ? 'block' : 'none';
    }

    function saveSettings() {
        const fuelAmount = document.getElementById('fuelAmountInput').value;
        const fuelPriceThreshold = document.getElementById('fuelPriceThresholdInput').value;
        const co2Amount = document.getElementById('co2AmountInput').value;
        const co2PriceThreshold = document.getElementById('co2PriceThresholdInput').value;

        // 保存到 localStorage
        localStorage.setItem('fuelAmount', fuelAmount);
        localStorage.setItem('fuelPriceThreshold', fuelPriceThreshold);
        localStorage.setItem('co2Amount', co2Amount);
        localStorage.setItem('co2PriceThreshold', co2PriceThreshold);

        console.log('设置已保存');
        toggleSettingsPopup(); // 关闭弹窗
    }

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

    // 获取用户设置
    const fuelAmount = localStorage.getItem('fuelAmount') || '30000000';
    const fuelPriceThreshold = parseFloat(localStorage.getItem('fuelPriceThreshold') || '380');

    // 获取当前价格（从 HTML 中提取）
    const priceElement = document.querySelector('.col-6.p-2 .text-danger b');
    if (priceElement) {
        const priceText = priceElement.textContent.trim();
        const price = parseFloat(priceText.replace('$', '').replace(',', ''));
        console.log(`当前燃油价格为：$${price}`);

        if (price < fuelPriceThreshold) {
            console.log(`燃油价格低于 $${fuelPriceThreshold}，准备购买...`);
            const amountInput = document.getElementById('amountInput');
            if (amountInput) {
                amountInput.value = fuelAmount;
                console.log(`已输入购买数量：${fuelAmount}`);
            }
            const purchaseButton = document.querySelector('.btn.btn-danger.btn-xs.btn-block.w-100');
            if (purchaseButton) {
                purchaseButton.click();
                console.log('已点击购买按钮');
            }
        } else {
            console.log(`燃油价格高于 $${fuelPriceThreshold}，跳过购买操作`);
        }
    }
}

// 检查碳价格并购买碳
async function checkAndPurchaseCO2() {
    console.log('检测碳价格...');

    // 获取用户设置
    const co2Amount = localStorage.getItem('co2Amount') || '10000000';
    const co2PriceThreshold = parseFloat(localStorage.getItem('co2PriceThreshold') || '105');

    // 获取当前价格（从 HTML 中提取）
    const priceElement = document.querySelector('.col-6.p-2 .text-danger b');
    if (priceElement) {
        const priceText = priceElement.textContent.trim();
        const price = parseFloat(priceText.replace('$', '').replace(',', ''));
        console.log(`当前碳价格为：$${price}`);

        if (price < co2PriceThreshold) {
            console.log(`碳价格低于 $${co2PriceThreshold}，准备购买...`);
            const amountInput = document.getElementById('amountInput');
            if (amountInput) {
                amountInput.value = co2Amount;
                console.log(`已输入购买数量：${co2Amount}`);
            }
            const purchaseButton = document.querySelector('.btn.btn-danger.btn-xs.btn-block.w-100');
            if (purchaseButton) {
                purchaseButton.click();
                console.log('已点击购买按钮');
            }
        } else {
            console.log(`碳价格高于 $${co2PriceThreshold}，跳过购买操作`);
        }
    }
}

// 点击 "Increase airline reputation" 的函数
async function clickAirlineReputation() {
    console.log('查找 "Increase airline reputation"...');
    // 获取所有的 <tr> 元素
    const rows = document.querySelectorAll('table.table tbody tr');
    // 遍历 <tr> 元素，查找包含 "Increase airline reputation" 的行
    for (let row of rows) {
        if (row.innerText.includes('Increase airline reputation')) {
            console.log('找到目标行，准备点击...');
            row.click(); // 点击目标行
            await randomDelay(); // 添加随机延迟
            return; // 点击后退出函数
        }
    }
    console.log('未找到 "Increase airline reputation" 的行');
}

async function select24Hours() {
    console.log('选择 24 Hours ...');

    const dSelector = document.getElementById('dSelector'); // 获取 <select> 元素
    if (dSelector) {
        dSelector.value = "6"; // 设置值为 "6"（对应 24 Hours）
        console.log('已选择 24 Hours');

        // 触发 change 事件，确保页面更新选择
        const event = new Event('change', { bubbles: true });
        dSelector.dispatchEvent(event);
    } else {
        console.log('未找到 dSelector 下拉菜单');
    }
}

// 点击 "Increase airline reputation" 的函数
async function clickEcoFriendly() {
    console.log('查找 "Eco-friendly"...');
    // 获取所有的 <tr> 元素
    const rows = document.querySelectorAll('table.table tbody tr');
    // 遍历 <tr> 元素，查找包含 "Eco-friendly" 的行
    for (let row of rows) {
        if (row.innerText.includes('Eco-friendly')) {
            console.log('找到目标行，准备点击...');
            row.click(); // 点击目标行
            await randomDelay(); // 添加随机延迟
            return; // 点击后退出函数
        }
    }
    console.log('未找到 "Increase airline reputation" 的行');
}

async function clickEcoMarketingButton() {
    console.log('查找 Eco Marketing 按钮...');

    // 使用 querySelector 根据 onclick 属性定位按钮
    const ecoMarketingButton = document.querySelector('button.btn.btn-xs.btn-danger[onclick*="marketing_new.php?type=5"]');
    if (ecoMarketingButton) {
        console.log('找到 Eco Marketing 按钮，准备点击...');
        ecoMarketingButton.click(); // 触发点击事件
        await randomDelay(); // 添加随机延迟
        console.log('已点击 Eco Marketing 按钮');
    } else {
        console.log('未找到 Eco Marketing 按钮');
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
        await clickButtonById('newCampaign');
        await randomDelay(); // 再次添加随机延迟
        await clickAirlineReputation();
        await randomDelay(); // 再次添加随机延迟
        await clickButtonById('dSelector');
        await randomDelay(); // 再次添加随机延迟
        await select24Hours(); // 选择 24 Hours
        await randomDelay(); // 添加随机延迟
        await clickButtonById('c4Btn');
        await randomDelay(); // 再次添加随机延迟
        await clickButtonById('popBtn2');
        await randomDelay(); // 再次添加随机延迟
        await clickButtonById('newCampaign');
        await randomDelay(); // 再次添加随机延迟
        await clickEcoFriendly();
        await randomDelay(); // 再次添加随机延迟
        await clickEcoMarketingButton(); // 点击 Eco Marketing 按钮
        await randomDelay();
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
        console.log('脚本已启动，每10分钟运行一次');
        isRunning = true;
        updateButtonText(); // 更新按钮文字
        await runScript(); // 立即运行一次主逻辑
        intervalId = setInterval(runScript, 600000); // 每 10 分钟运行一次主函数
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

    // 在页面顶部添加齿轮按钮
    const gearButton = document.createElement('button');
    gearButton.id = 'gearButton';
    gearButton.textContent = '⚙️'; // 齿轮图标
    gearButton.style.position = 'fixed';
    gearButton.style.top = '10px';
    gearButton.style.left = 'calc(50% - 100px)'; // 位于启动按钮左边
    gearButton.style.transform = 'translateX(-50%)';
    gearButton.style.zIndex = '9999';
    gearButton.style.padding = '10px 20px';
    gearButton.style.backgroundColor = '#28a745';
    gearButton.style.color = 'white';
    gearButton.style.border = 'none';
    gearButton.style.borderRadius = '5px';
    gearButton.style.cursor = 'pointer';
    gearButton.style.fontSize = '16px';
    gearButton.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    document.body.appendChild(gearButton);

    // 齿轮按钮点击事件，打开设置弹窗
    gearButton.addEventListener('click', toggleSettingsPopup);

    // 启动按钮的点击事件
    button.addEventListener('click', () => {
        if (isRunning) {
            stopScript(); // 如果脚本正在运行，就停止
        } else {
            startScript(); // 如果脚本未运行，就启动
        }
    });

    // 创建设置弹窗
    const settingsPopup = document.createElement('div');
    settingsPopup.id = 'settingsPopup';
    settingsPopup.style.position = 'fixed';
    settingsPopup.style.top = '50%';
    settingsPopup.style.left = '50%';
    settingsPopup.style.transform = 'translate(-50%, -50%)';
    settingsPopup.style.zIndex = '10000';
    settingsPopup.style.padding = '20px';
    settingsPopup.style.backgroundColor = 'white';
    settingsPopup.style.border = '1px solid #ccc';
    settingsPopup.style.borderRadius = '10px';
    settingsPopup.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.2)';
    settingsPopup.style.display = 'none'; // 初始隐藏

    // 弹窗内容
    settingsPopup.innerHTML = `
        <h3>设置</h3>
        <label>
            燃油购买数量:
            <input type="number" id="fuelAmountInput" value="30000000" style="width: 100%; margin-bottom: 10px;">
        </label>
        <label>
            燃油购买价格阈值:
            <input type="number" id="fuelPriceThresholdInput" value="380" style="width: 100%; margin-bottom: 10px;">
        </label>
        <label>
            碳购买数量:
            <input type="number" id="co2AmountInput" value="10000000" style="width: 100%; margin-bottom: 10px;">
        </label>
        <label>
            碳购买价格阈值:
            <input type="number" id="co2PriceThresholdInput" value="105" style="width: 100%; margin-bottom: 10px;">
        </label>
        <button id="saveSettingsButton" style="padding: 10px 20px; background-color: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">保存设置</button>
        <button id="closeSettingsButton" style="padding: 10px 20px; background-color: #dc3545; color: white; border: none; border-radius: 5px; cursor: pointer; margin-left: 10px;">关闭</button>
    `;
    document.body.appendChild(settingsPopup);

    // 保存和关闭按钮事件
    document.getElementById('saveSettingsButton').addEventListener('click', saveSettings);
    document.getElementById('closeSettingsButton').addEventListener('click', toggleSettingsPopup);

})();