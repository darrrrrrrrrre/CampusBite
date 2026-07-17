// ==================== 全局資料庫 (包含擴充 3 大類，每類 5-6 項) ====================
const MENU_DATA = {
    // 擴充選項 1：蔬食健康輕食 (5項)
    "healthy": [
        { id: "h1", name: "低卡舒肥雞胸溫沙拉", price: 140, desc: "精選逢甲在地小農蔬菜，搭配嫩肩舒肥雞胸肉與自製胡麻醬，健康無負擔。" },
        { id: "h2", name: "酪梨鮮蝦地瓜能量碗", price: 165, desc: "優質脂肪酪梨搭配鮮甜白蝦、香甜紅東地瓜，補充滿滿每日所需能量。" },
        { id: "h3", name: "野菇豆腐溫拌藜麥飯", price: 130, desc: "多汁菇類與炙燒嫩豆腐，拌入高纖紅藜麥飯，純素/蛋奶素者的首選。" },
        { id: "h4", name: "煙燻鮭魚和風減脂沙拉", price: 155, desc: "煙燻挪威鮭魚切片，佐以爽口和風醬汁，鮮美又清爽。" },
        { id: "h5", name: "繽紛水果優格高纖燕麥碗", price: 110, desc: "希臘無糖優格，搭配季節時令新鮮水果與手作無糖烤燕麥片。" }
    ],
    // 擴充選項 2：校園銅板炸物小吃 (6項)
    "snacks": [
        { id: "s1", name: "逢甲傳奇黃金脆皮雞排", price: 90, desc: "外皮超酥脆、咬下狂噴汁！校園必吃經典銅板美食。" },
        { id: "s2", name: "甘梅地瓜薯條(大份)", price: 65, desc: "台灣在地地瓜，炸至金黃後灑上特製甘梅粉，鹹甜交織超涮嘴。" },
        { id: "s3", name: "酥炸雙色地瓜QQ球", price: 50, desc: "外酥內軟、口感彈牙，一包就能帶給你下午滿滿的療癒感。" },
        { id: "s4", name: "泰式酸辣爆汁雞米花", price: 80, desc: "鮮嫩雞肉球現炸起鍋，淋上微辣帶酸的泰式招牌醬汁。" },
        { id: "s5", name: "椒鹽脆皮杏鮑菇", price: 60, desc: "裹上薄粉將多汁菇肉鎖在裡面，椒鹽提味，多汁酥脆。" },
        { id: "s6", name: "黃金煉乳起司銀絲卷", price: 55, desc: "金黃酥脆的銀絲卷加上邪惡切達起司片，最後淋滿香甜煉乳。" }
    ],
    // 擴充選項 3：午茶甜點特區 (5項)
    "desserts": [
        { id: "d1", name: "手作焦糖雞蛋布丁", price: 65, desc: "純鮮奶與新鮮雞蛋手工蒸烤，搭配苦甜焦糖液，滑嫩細緻。" },
        { id: "d2", name: "法式苦甜巧克力塔", price: 95, desc: "使用 70% 比利時苦甜巧克力，塔皮香酥、內餡濃郁，甜點控必點。" },
        { id: "d3", name: "靜岡濃抹茶千層蛋糕", price: 120, desc: "層層疊疊的柔軟餅皮，夾入微苦回甘的靜岡抹茶內餡。" },
        { id: "d4", name: "香草黑糖珍珠格子鬆餅", price: 85, desc: "現烤格子鬆餅外酥內軟，放上滿滿Q彈黑糖珍珠與香草冰淇淋。" },
        { id: "d5", name: "莫蘭迪藍莓重乳酪蛋糕", price: 110, desc: "濃郁美式重乳酪，混入鮮採藍莓醬，形成唯美的低飽和紫色漸層。" }
    ]
};

// ==================== 狀態管理 (State) ====================
let cart = JSON.parse(localStorage.getItem('campus_bite_cart')) || [];
let activeCoupon = JSON.parse(localStorage.getItem('campus_bite_coupon')) || null;
let preferences = JSON.parse(localStorage.getItem('campus_bite_preferences')) || {
    utensils: 'no', // 'yes' or 'no'
    location: 'main_gate' // 'main_gate', 'dorm', 'building'
};

// ==================== 初始化事件 ====================
document.addEventListener('DOMContentLoaded', () => {
    // 自動更新導覽列購物車數量
    updateCartBadge();

    // 判斷目前人在哪個頁面並執行對應初始化
    const path = window.location.pathname;
    if (path.includes('menu.html')) {
        initMenuPage();
    } else if (path.includes('cart.html')) {
        initCartPage();
    } else if (path.includes('order-status.html')) {
        initOrderStatusPage();
    }
});

// ==================== 核心函式：購物車通用 ====================
function saveCart() {
    localStorage.setItem('campus_bite_cart', JSON.stringify(cart));
    updateCartBadge();
}

function updateCartBadge() {
    const badge = document.getElementById('cart-badge');
    if (badge) {
        const count = cart.reduce((total, item) => total + item.quantity, 0);
        badge.textContent = count;
        badge.style.display = count > 0 ? 'inline-block' : 'none';
    }
}

// ==================== 頁面 1：美食菜單渲染 (menu.html) ====================
function initMenuPage() {
    renderMenuGrid('healthy'); // 預設顯示蔬食健康輕食

    // 綁定分類標籤點擊事件
    const tags = document.querySelectorAll('.category-tags .tag');
    tags.forEach(tag => {
        tag.addEventListener('click', (e) => {
            tags.forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            const category = e.target.dataset.category;
            renderMenuGrid(category);
        });
    });
}

function renderMenuGrid(category) {
    const grid = document.getElementById('menu-grid');
    if (!grid) return;

    grid.innerHTML = '';
    const items = MENU_DATA[category] || [];

    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-content">
                <span class="card-category">${getCategoryName(category)}</span>
                <h3 class="card-title">${item.name}</h3>
                <p class="card-desc">${item.desc}</p>
                <div class="card-footer">
                    <span class="card-price">$${item.price}</span>
                    <button class="btn add-to-cart-btn" onclick="addToCart('${item.id}', '${item.name}', ${item.price})">加入購物車</button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

function getCategoryName(key) {
    const names = {
        'healthy': '蔬食健康輕食',
        'snacks': '校園銅板炸物',
        'desserts': '午茶甜點特區'
    };
    return names[key] || '精選美食';
}

function addToCart(id, name, price) {
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }
    saveCart();
    alert(`已將「${name}」加入購物車！`);
}

// ==================== 頁面 2：購物車與結帳 (cart.html) ====================
function initCartPage() {
    renderCartList();
    initPreferenceModule();
    initCouponModule();
}

function renderCartList() {
    const list = document.getElementById('cart-items-list');
    if (!list) return;

    list.innerHTML = '';
    if (cart.length === 0) {
        list.innerHTML = `<p class="empty-cart-text">您的購物車是空的，快去選購美味餐點吧！</p>`;
        updateSummary();
        return;
    }

    cart.forEach((item, index) => {
        const row = document.createElement('div');
        row.className = 'cart-item';
        row.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid var(--morandi-border);';
        row.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-name" style="font-weight: 600;">${item.name}</div>
                <div class="cart-item-price" style="color: var(--morandi-text-light); font-size: 0.9rem;">$${item.price} / 份</div>
            </div>
            <div class="cart-item-control" style="display: flex; align-items: center; gap: 15px;">
                <button class="qty-btn" onclick="updateQty(${index}, -1)" style="width: 28px; height: 28px; border-radius: 50%; border: 1px solid var(--morandi-border); background: white; cursor: pointer;">-</button>
                <span class="qty-num" style="font-weight: bold; font-size: 1rem;">${item.quantity}</span>
                <button class="qty-btn" onclick="updateQty(${index}, 1)" style="width: 28px; height: 28px; border-radius: 50%; border: 1px solid var(--morandi-border); background: white; cursor: pointer;">+</button>
            </div>
        `;
        list.appendChild(row);
    });

    updateSummary();
}

function updateQty(index, change) {
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    saveCart();
    renderCartList();
}

// --- 【模組 A：優惠券系統】 ---
function initCouponModule() {
    const applyBtn = document.getElementById('apply-coupon-btn');
    if (!applyBtn) return;

    applyBtn.addEventListener('click', () => {
        const codeInput = document.getElementById('coupon-code-input').value.trim().toUpperCase();
        const msg = document.getElementById('coupon-message');

        if (codeInput === 'CAMPUS50') {
            activeCoupon = { code: 'CAMPUS50', type: 'minus', value: 50 };
            msg.textContent = '成功套用折 50 元優惠券！';
            msg.style.color = 'var(--morandi-green)';
        } else if (codeInput === 'FCU85') {
            activeCoupon = { code: 'FCU85', type: 'discount', value: 0.85 };
            msg.textContent = '成功套用學校折扣：享 85 折優惠！';
            msg.style.color = 'var(--morandi-green)';
        } else {
            activeCoupon = null;
            msg.textContent = '無效的折價券，請輸入 CAMPUS50 或 FCU85';
            msg.style.color = 'var(--morandi-rose)';
        }
        localStorage.setItem('campus_bite_coupon', JSON.stringify(activeCoupon));
        updateSummary();
    });
}

function updateSummary() {
    const subtotalEl = document.getElementById('subtotal-price');
    const discountEl = document.getElementById('discount-price');
    const totalEl = document.getElementById('total-price');

    if (!subtotalEl) return;

    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    subtotalEl.textContent = `$${subtotal}`;

    let discount = 0;
    if (activeCoupon && subtotal > 0) {
        if (activeCoupon.type === 'minus') {
            discount = activeCoupon.value;
        } else if (activeCoupon.type === 'discount') {
            discount = Math.round(subtotal * (1 - activeCoupon.value));
        }
    }

    discountEl.textContent = `-$${discount}`;
    const finalTotal = Math.max(0, subtotal - discount);
    totalEl.textContent = `$${finalTotal}`;
}

// --- 【模組 C：環保餐具與備註偏好設定】 ---
function initPreferenceModule() {
    const utensilBtns = document.querySelectorAll('[data-utensil]');
    const locBtns = document.querySelectorAll('[data-location]');

    // 渲染已有偏好
    utensilBtns.forEach(btn => {
        if (btn.dataset.utensil === preferences.utensils) btn.classList.add('active');
        btn.addEventListener('click', (e) => {
            utensilBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            preferences.utensils = btn.dataset.utensil;
            localStorage.setItem('campus_bite_preferences', JSON.stringify(preferences));
        });
    });

    locBtns.forEach(btn => {
        if (btn.dataset.location === preferences.location) btn.classList.add('active');
        btn.addEventListener('click', (e) => {
            locBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            preferences.location = btn.dataset.location;
            localStorage.setItem('campus_bite_preferences', JSON.stringify(preferences));
        });
    });
}

// 結帳送出
function submitOrder() {
    if (cart.length === 0) {
        alert('購物車是空的，無法結帳唷！');
        return;
    }
    alert('訂單成立！即將帶您前往外送狀態追蹤頁面。');
    // 清空購物車
    cart = [];
    saveCart();
    localStorage.removeItem('campus_bite_coupon');
    window.location.href = 'order-status.html';
}

// ==================== 頁面 3：外送狀態即時追蹤 (order-status.html) ====================
function initOrderStatusPage() {
    initDeliverySimulation();
    initDriverChat();
}

// --- 【模組 B：即時外送狀態追蹤】 ---
function initDeliverySimulation() {
    let currentStep = 1;
    const progressSteps = document.querySelectorAll('.progress-step');
    const barFill = document.querySelector('.progress-bar-fill');
    const countdownEl = document.getElementById('countdown-timer');
    const statusTextEl = document.getElementById('current-status-text');

    if (!barFill) return;

    let timeLeft = 25 * 60; // 25 分鐘倒數

    // 倒數計時器
    const timerInterval = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            countdownEl.textContent = "餐點已送達！祝您用餐愉快！";
            return;
        }
        timeLeft--;
        const mins = Math.floor(timeLeft / 60);
        const secs = timeLeft % 60;
        countdownEl.textContent = `預計抵達時間：${mins} 分 ${secs < 10 ? '0' : ''}${secs} 秒`;
    }, 1000);

    // 模擬進度推移（每 8 秒自動往下一個狀態切換，供老師展示使用）
    const statusLabels = [
        "商家已接單，正在精心烹調您的美味餐點...",
        "餐點已製作完成！外送員正在領取中...",
        "外送員已取餐，正在飛奔往您的指定地點！",
        "外送員已抵達現場，請準備取餐囉！"
    ];

    const progressInterval = setInterval(() => {
        if (currentStep >= 4) {
            clearInterval(progressInterval);
            return;
        }
        currentStep++;
        
        // 更新進度條視覺
        progressSteps.forEach((step, idx) => {
            if (idx < currentStep) {
                step.classList.add('active');
            }
        });
        
        const percentage = ((currentStep - 1) / 3) * 100;
        barFill.style.width = `${percentage}%`;
        statusTextEl.textContent = statusLabels[currentStep - 1];

    }, 8000);
}

// --- 【模組 B：模擬與外送員即時對話】 ---
function initDriverChat() {
    const chatContainer = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-chat-btn');

    if (!sendBtn) return;

    // 發送訊息
    function sendMessage() {
        const text = chatInput.value.trim();
        if (!text) return;

        // 使用者訊息
        const userMsg = document.createElement('div');
        userMsg.style.cssText = 'margin: 5px 0; text-align: right;';
        userMsg.innerHTML = `<span style="background-color: var(--morandi-green); color: white; padding: 6px 12px; border-radius: 12px; display: inline-block;">${text}</span>`;
        chatContainer.appendChild(userMsg);
        chatInput.value = '';
        chatContainer.scrollTop = chatContainer.scrollHeight;

        // 模擬外送員在 1.5 秒後自動回覆
        setTimeout(() => {
            const driverMsg = document.createElement('div');
            driverMsg.style.cssText = 'margin: 5px 0; text-align: left;';
            driverMsg.innerHTML = `<span style="background-color: #E8E4DC; color: var(--morandi-text-dark); padding: 6px 12px; border-radius: 12px; display: inline-block;">好的！沒問題，我待會快到時打給您！</span>`;
            chatContainer.appendChild(driverMsg);
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }, 1500);
    }

    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
}