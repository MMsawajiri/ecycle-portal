// セクション管理
const sections = document.querySelectorAll('.section');
const navItems = document.querySelectorAll('.nav-item');

// セクションを表示する関数
function showSection(sectionId) {
    // 登録内容確認画面への特別処理
    if (sectionId === 'registration') {
        showRegistrationScreen();
        
        // ナビゲーションアイテムのアクティブ状態を更新
        navItems.forEach(item => {
            item.classList.remove('active');
        });
        const targetNavItem = document.querySelector(`[data-section="${sectionId}"]`);
        if (targetNavItem) {
            targetNavItem.classList.add('active');
        }
        return;
    }
    
    // 通常のセクション表示処理
    // すべてのセクションを非表示にする
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // すべてのナビゲーションアイテムから active クラスを削除
    navItems.forEach(item => {
        item.classList.remove('active');
    });
    
    // 指定されたセクションを表示
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // 対応するナビゲーションアイテムをアクティブにする
    const targetNavItem = document.querySelector(`[data-section="${sectionId}"]`);
    if (targetNavItem) {
        targetNavItem.classList.add('active');
    }
    
    // ページトップにスクロール
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ボトムナビゲーションのクリックイベント
navItems.forEach(item => {
    item.addEventListener('click', () => {
        const sectionId = item.getAttribute('data-section');
        showSection(sectionId);
    });
});

// メニュートグルボタン
const menuToggle = document.querySelector('.menu-toggle');
if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        // デモ用メニュー表示
        showDemoMenu();
    });
}

// デモ用メニュー表示
function showDemoMenu() {
    const menuOptions = [
        '1. メインアプリ (現在表示中)',
        '2. 登録内容確認画面',
        '3. 支払い設定画面',
        '4. ログアウト'
    ];
    
    const choice = prompt('デモメニュー:\n' + menuOptions.join('\n') + '\n\n数字を入力してください (1-4):');
    
    switch(choice) {
        case '1':
            showMainApp();
            break;
        case '2':
            showRegistrationScreen();
            break;
        case '3':
            showPaymentScreen();
            break;
        case '4':
            logout();
            break;
        default:
            // 何もしない
            break;
    }
}

// ログアウト機能
function logout() {
    isLoggedIn = false;
    showLoginScreen();
}

// タブ切り替え機能
function initTabSwitching() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const planResults = document.querySelectorAll('.plan-result');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetPlan = btn.getAttribute('data-plan');
            
            // タブボタンのアクティブ状態を切り替え
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // 対応する結果表示を切り替え
            planResults.forEach(result => {
                result.classList.remove('active');
            });
            
            const targetResult = document.getElementById(`${targetPlan}-result`);
            if (targetResult) {
                targetResult.classList.add('active');
            }
        });
    });
}

// シミュレーション計算機能（デフォルト300kWh使用）
function calculateSimulation() {
    // 固定で300kWhを使用（入力フィールドは削除済み）
    const monthlyUsage = 300;
    
    // 現在の料金計算（一般的な電力会社想定）
    const currentMonthly = monthlyUsage * 35 + 1500; // 35円/kWh + 基本料金
    const currentYearly = Math.round(currentMonthly * 12);
    
    // 標準プランの計算
    const standardBasic = 1200;
    const standardUnit = 28;
    const standardMonthly = monthlyUsage * standardUnit + standardBasic;
    const standardYearly = Math.round(standardMonthly * 12);
    const standardSavings = currentYearly - standardYearly;
    
    // 市場連動プランの計算
    const marketBasic = 980;
    const marketUnit = 30; // 平均価格想定
    const marketMonthly = monthlyUsage * marketUnit + marketBasic;
    const marketYearly = Math.round(marketMonthly * 12);
    const marketSavings = currentYearly - marketYearly;
    
    // 標準プランの表示更新
    updatePlanDisplay('standard', {
        savings: standardSavings,
        currentYearly: currentYearly,
        newYearly: standardYearly,
        basicCharge: standardBasic,
        unitPrice: standardUnit
    });
    
    // 市場連動プランの表示更新
    updatePlanDisplay('market', {
        savings: marketSavings,
        currentYearly: currentYearly,
        newYearly: marketYearly,
        basicCharge: marketBasic,
        unitPrice: '15〜50'
    });
    
    // 結果エリアまでスクロール
    document.querySelector('.plan-tabs').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// プラン表示を更新
function updatePlanDisplay(planType, data) {
    const result = document.getElementById(`${planType}-result`);
    if (!result) return;
    
    // 節約金額を更新
    const savingsAmount = result.querySelector('.savings-amount .amount');
    if (savingsAmount) {
        savingsAmount.textContent = data.savings.toLocaleString();
    }
    
    // 料金内訳を更新
    const priceElements = result.querySelectorAll('.breakdown-table .price');
    if (priceElements.length >= 5) {
        priceElements[0].textContent = `¥${data.currentYearly.toLocaleString()}`;
        priceElements[1].textContent = `¥${data.newYearly.toLocaleString()}`;
        priceElements[2].textContent = `¥${data.basicCharge.toLocaleString()}`;
        if (typeof data.unitPrice === 'number') {
            priceElements[3].textContent = `¥${data.unitPrice.toFixed(2)}`;
        } else {
            priceElements[3].textContent = `¥${data.unitPrice}/kWh`;
        }
    }
}

// プラン申込機能
function applyPlan(planType) {
    // 申込セクションに遷移
    showSection('application');
}

// DOMContentLoaded イベント
document.addEventListener('DOMContentLoaded', () => {
    // タブ切り替え機能を初期化
    initTabSwitching();
    
    // 申込ボタンのイベントリスナーを追加
    const applyBtn = document.querySelector('.feature-card .btn-secondary');
    if (applyBtn) {
        applyBtn.addEventListener('click', () => {
            showSection('application');
        });
    }
});

// ページ読み込み時の初期化は新しいログイン機能で処理

// サービスワーカーの登録（PWA対応の準備）
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // 将来的にサービスワーカーを追加する場合はここに記述
        // navigator.serviceWorker.register('/sw.js');
    });
}

// タッチイベントの最適化
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
});

document.addEventListener('touchend', (e) => {
    touchEndY = e.changedTouches[0].clientY;
    handleSwipe();
});

function handleSwipe() {
    const swipeDistance = touchStartY - touchEndY;
    const threshold = 50;
    
    // 将来的にスワイプ操作を実装する場合はここに記述
    // 例: 左右スワイプでセクション切り替えなど
}

// デバッグ用コンソールログ（本番環境では削除）
console.log('e.CYCLE Portal - 再エネで地域に貢献');

// ログイン機能
let isLoggedIn = false;

// ページ読み込み時の初期化（更新）
window.addEventListener('load', () => {
    // ローディング画面を表示
    showLoading();
    
    // 1.5秒後にログイン画面へ（テスト用に短縮）
    setTimeout(() => {
        hideLoading();
        if (!isLoggedIn) {
            showLoginScreen();
        } else {
            showMainApp();
        }
    }, 1500);
});

// ローディング表示
function showLoading() {
    const loadingScreen = document.getElementById('loading-screen');
    const loginScreen = document.getElementById('login-screen');
    const registrationScreen = document.getElementById('registration-screen');
    const paymentScreen = document.getElementById('payment-screen');
    const mainContent = document.querySelector('.main-content');
    const header = document.querySelector('.header');
    const bottomNav = document.querySelector('.bottom-nav');
    
    if (loadingScreen) loadingScreen.style.display = 'flex';
    if (loginScreen) loginScreen.style.display = 'none';
    if (registrationScreen) registrationScreen.style.display = 'none';
    if (paymentScreen) paymentScreen.style.display = 'none';
    if (mainContent) mainContent.style.display = 'none';
    if (header) header.style.display = 'none';
    if (bottomNav) bottomNav.style.display = 'none';
}

// ローディング非表示
function hideLoading() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.style.display = 'none';
    }
}

// ログイン画面表示
function showLoginScreen() {
    const loginScreen = document.getElementById('login-screen');
    const registrationScreen = document.getElementById('registration-screen');
    const paymentScreen = document.getElementById('payment-screen');
    const mainContent = document.querySelector('.main-content');
    const header = document.querySelector('.header');
    const bottomNav = document.querySelector('.bottom-nav');
    
    // 登録・支払い画面を非表示
    if (registrationScreen) registrationScreen.style.display = 'none';
    if (paymentScreen) paymentScreen.style.display = 'none';
    
    // ログイン画面を表示、他を非表示
    if (loginScreen) loginScreen.style.display = 'block';
    if (mainContent) mainContent.style.display = 'none';
    if (header) header.style.display = 'none';
    if (bottomNav) bottomNav.style.display = 'none';
}

// メインアプリ表示
function showMainApp() {
    const loginScreen = document.getElementById('login-screen');
    const passwordResetScreen = document.getElementById('password-reset-screen');
    const registrationScreen = document.getElementById('registration-screen');
    const paymentScreen = document.getElementById('payment-screen');
    const mainContent = document.querySelector('.main-content');
    const header = document.querySelector('.header');
    const bottomNav = document.querySelector('.bottom-nav');
    
    // 全ての追加画面を非表示
    if (loginScreen) loginScreen.style.display = 'none';
    if (passwordResetScreen) passwordResetScreen.style.display = 'none';
    if (registrationScreen) registrationScreen.style.display = 'none';
    if (paymentScreen) paymentScreen.style.display = 'none';
    
    // メインアプリを表示
    if (mainContent) mainContent.style.display = 'block';
    if (header) header.style.display = 'block';
    if (bottomNav) bottomNav.style.display = 'flex';
    
    // ホームセクションを表示
    showSection('home');
}

// パスワード表示切替
function togglePassword() {
    const passwordInput = document.getElementById('login-password');
    const toggleIcon = document.querySelector('.password-toggle i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    }
}

// ログイン処理
function initLogin() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleLogin();
        });
    }
}

function handleLogin() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const btnText = document.querySelector('.btn-text');
    const btnLoading = document.querySelector('.btn-loading');
    const loginBtn = document.querySelector('.btn-login');
    
    // バリデーション
    if (!email || !password) {
        showLoginError('メールアドレスとパスワードを入力してください');
        return;
    }
    
    // ローディング表示
    btnText.style.display = 'none';
    btnLoading.style.display = 'block';
    loginBtn.disabled = true;
    
    // ダミーログイン処理（1秒後に成功、テスト用に短縮）
    setTimeout(() => {
        if (email === 'demo@ecycle.jp' && password === 'demo123') {
            // ログイン成功 - メインアプリを表示
            isLoggedIn = true;
            showMainApp();
        } else {
            // ログイン失敗
            showLoginError('メールアドレスまたはパスワードが正しくありません');
            btnText.style.display = 'block';
            btnLoading.style.display = 'none';
            loginBtn.disabled = false;
        }
    }, 1000);
}

// ログインエラー表示
function showLoginError(message) {
    // 全てのログインフォームエラーをクリア
    clearAllLoginErrors();
    
    // パスワード関連エラーの場合はパスワードフィールドに表示
    if (message.includes('パスワード')) {
        const passwordInput = document.getElementById('login-password');
        const passwordErrorElement = passwordInput.closest('.form-group').querySelector('.error-message');
        if (passwordErrorElement) {
            passwordErrorElement.textContent = message;
        }
    } else {
        // メールアドレス関連またはその他のエラーはメールフィールドに表示
        const emailInput = document.getElementById('login-email');
        const emailErrorElement = emailInput.closest('.form-group').querySelector('.error-message');
        if (emailErrorElement) {
            emailErrorElement.textContent = message;
        }
    }
    
    // 3秒後にエラーメッセージをクリア
    setTimeout(() => {
        clearAllLoginErrors();
    }, 3000);
}

// ログインフォームの全エラーをクリア
function clearAllLoginErrors() {
    const errorElements = document.querySelectorAll('#login-form .error-message');
    errorElements.forEach(element => {
        if (element) {
            element.textContent = '';
        }
    });
}

// パスワードリセット画面表示
function showPasswordReset() {
    const loginScreen = document.getElementById('login-screen');
    const passwordResetScreen = document.getElementById('password-reset-screen');
    
    if (loginScreen) loginScreen.style.display = 'none';
    if (passwordResetScreen) passwordResetScreen.style.display = 'block';
}

// ログイン画面に戻る
function backToLogin() {
    const loginScreen = document.getElementById('login-screen');
    const passwordResetScreen = document.getElementById('password-reset-screen');
    
    if (passwordResetScreen) passwordResetScreen.style.display = 'none';
    if (loginScreen) loginScreen.style.display = 'block';
}

// パスワードリセット処理
function initPasswordReset() {
    const resetForm = document.getElementById('reset-form');
    if (resetForm) {
        resetForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handlePasswordReset();
        });
    }
}

function handlePasswordReset() {
    const email = document.getElementById('reset-email').value;
    
    if (!email) {
        showResetError('メールアドレスを入力してください');
        return;
    }
    
    if (!isValidEmail(email)) {
        showResetError('正しいメールアドレスを入力してください');
        return;
    }
    
    // ダミー送信処理
    alert('パスワードリセット用のメールを送信しました。\nメールをご確認ください。');
    backToLogin();
}

// リセットエラー表示
function showResetError(message) {
    const emailInput = document.getElementById('reset-email');
    const errorElement = emailInput.closest('.form-group').querySelector('.error-message');
    if (errorElement) {
        errorElement.textContent = message;
    }
}

// 登録内容確認画面表示
function showRegistrationScreen() {
    showSection('registration');
    loadRegistrationData();
}

// 申込データの読み込み
function loadRegistrationData() {
    const applicationData = localStorage.getItem('lastApplicationData');
    const applicationNumber = localStorage.getItem('lastApplicationNumber');
    
    if (applicationData && applicationNumber) {
        try {
            const data = JSON.parse(applicationData);
            displayRegistrationData(data, applicationNumber);
        } catch (e) {
            showNoApplicationMessage();
        }
    } else {
        showNoApplicationMessage();
    }
}

// 申込データの表示
function displayRegistrationData(data, applicationNumber) {
    document.getElementById('reg-fullname').textContent = `${data.lastName || ''} ${data.firstName || ''}`.trim() || '-';
    document.getElementById('reg-postal').textContent = data.postalCode || '-';
    
    // 都道府県名を取得
    const prefectureName = getPrefectureName(data.prefecture);
    document.getElementById('reg-address').textContent = `${prefectureName}${data.city || ''}${data.address || ''}` || '-';
    
    document.getElementById('reg-email').textContent = data.email || '-';
    document.getElementById('reg-phone').textContent = data.phone || '-';
    document.getElementById('reg-plan').textContent = data.plan === 'standard' ? '標準プラン' : '市場連動プラン';
    document.getElementById('reg-application-number').textContent = applicationNumber || '-';
    
    document.getElementById('application-status').style.display = 'none';
    document.getElementById('registration-info').style.display = 'block';
    document.getElementById('no-application').style.display = 'none';
}

// 未申込時の表示
function showNoApplicationMessage() {
    document.getElementById('application-status').style.display = 'none';
    document.getElementById('registration-info').style.display = 'none';
    document.getElementById('no-application').style.display = 'block';
}

// 都道府県名取得関数
function getPrefectureName(value) {
    const prefectures = {
        'hokkaido': '北海道',
        'aomori': '青森県',
        'iwate': '岩手県',
        'miyagi': '宮城県',
        'akita': '秋田県',
        'yamagata': '山形県',
        'fukushima': '福島県',
        'ibaraki': '茨城県',
        'tochigi': '栃木県',
        'gunma': '群馬県',
        'saitama': '埼玉県',
        'chiba': '千葉県',
        'tokyo': '東京都',
        'kanagawa': '神奈川県',
        'niigata': '新潟県',
        'toyama': '富山県',
        'ishikawa': '石川県',
        'fukui': '福井県',
        'yamanashi': '山梨県',
        'nagano': '長野県',
        'gifu': '岐阜県',
        'shizuoka': '静岡県',
        'aichi': '愛知県',
        'mie': '三重県',
        'shiga': '滋賀県',
        'kyoto': '京都府',
        'osaka': '大阪府',
        'hyogo': '兵庫県',
        'nara': '奈良県',
        'wakayama': '和歌山県',
        'tottori': '鳥取県',
        'shimane': '島根県',
        'okayama': '岡山県',
        'hiroshima': '広島県',
        'yamaguchi': '山口県',
        'tokushima': '徳島県',
        'kagawa': '香川県',
        'ehime': '愛媛県',
        'kochi': '高知県',
        'fukuoka': '福岡県',
        'saga': '佐賀県',
        'nagasaki': '長崎県',
        'kumamoto': '熊本県',
        'oita': '大分県',
        'miyazaki': '宮崎県',
        'kagoshima': '鹿児島県',
        'okinawa': '沖縄県'
    };
    return prefectures[value] || '';
}

// 支払い画面表示
function showPaymentScreen() {
    const loginScreen = document.getElementById('login-screen');
    const passwordResetScreen = document.getElementById('password-reset-screen');
    const registrationScreen = document.getElementById('registration-screen');
    const paymentScreen = document.getElementById('payment-screen');
    const mainContent = document.querySelector('.main-content');
    const header = document.querySelector('.header');
    const bottomNav = document.querySelector('.bottom-nav');
    
    // 全ての画面を非表示
    if (loginScreen) loginScreen.style.display = 'none';
    if (passwordResetScreen) passwordResetScreen.style.display = 'none';
    if (registrationScreen) registrationScreen.style.display = 'none';
    if (mainContent) mainContent.style.display = 'none';
    if (header) header.style.display = 'none';
    if (bottomNav) bottomNav.style.display = 'none';
    
    // 支払い画面を表示
    if (paymentScreen) paymentScreen.style.display = 'block';
}

// クレジットカード関連機能
function initPaymentForm() {
    const paymentForm = document.getElementById('payment-form');
    if (!paymentForm) return;
    
    // フォーム送信イベント
    paymentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handlePaymentSubmit();
    });
    
    // カード番号の入力補助
    const cardNumberInput = document.getElementById('card-number');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', formatCardNumber);
        cardNumberInput.addEventListener('input', updateCardPreview);
    }
    
    // カード名義人の入力補助
    const cardHolderInput = document.getElementById('card-holder');
    if (cardHolderInput) {
        cardHolderInput.addEventListener('input', updateCardPreview);
    }
    
    // 有効期限の入力補助
    const cardExpiryInput = document.getElementById('card-expiry');
    if (cardExpiryInput) {
        cardExpiryInput.addEventListener('input', formatCardExpiry);
        cardExpiryInput.addEventListener('input', updateCardPreview);
    }
    
    // CVVの入力制限
    const cardCvvInput = document.getElementById('card-cvv');
    if (cardCvvInput) {
        cardCvvInput.addEventListener('input', formatCardCvv);
    }
}

// カード番号のフォーマット
function formatCardNumber(e) {
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    e.target.value = value;
}

// 有効期限のフォーマット
function formatCardExpiry(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    e.target.value = value;
}

// CVVのフォーマット
function formatCardCvv(e) {
    let value = e.target.value.replace(/\D/g, '');
    e.target.value = value;
}

// カードプレビューの更新
function updateCardPreview() {
    const cardNumber = document.getElementById('card-number').value;
    const cardHolder = document.getElementById('card-holder').value;
    const cardExpiry = document.getElementById('card-expiry').value;
    
    const cardNumberDisplay = document.getElementById('card-number-display');
    const cardHolderDisplay = document.getElementById('card-holder-display');
    const cardExpiryDisplay = document.getElementById('card-expiry-display');
    const cardBrand = document.getElementById('card-brand');
    
    // カード番号の表示更新
    if (cardNumber) {
        const maskedNumber = cardNumber.padEnd(19, '•');
        cardNumberDisplay.textContent = maskedNumber;
    } else {
        cardNumberDisplay.textContent = '•••• •••• •••• ••••';
    }
    
    // 名義人の表示更新
    if (cardHolder) {
        cardHolderDisplay.textContent = cardHolder.toUpperCase();
    } else {
        cardHolderDisplay.textContent = 'カード所有者名';
    }
    
    // 有効期限の表示更新
    if (cardExpiry) {
        cardExpiryDisplay.textContent = cardExpiry;
    } else {
        cardExpiryDisplay.textContent = '••/••';
    }
    
    // カードブランドの判定
    updateCardBrand(cardNumber);
}

// カードブランドの判定と表示更新
function updateCardBrand(cardNumber) {
    const cardBrand = document.getElementById('card-brand');
    const cleanNumber = cardNumber.replace(/\s/g, '');
    
    if (cleanNumber.startsWith('4')) {
        cardBrand.innerHTML = '<i class="fab fa-cc-visa"></i>';
    } else if (cleanNumber.startsWith('5') || cleanNumber.startsWith('2')) {
        cardBrand.innerHTML = '<i class="fab fa-cc-mastercard"></i>';
    } else if (cleanNumber.startsWith('3')) {
        cardBrand.innerHTML = '<i class="fab fa-cc-amex"></i>';
    } else if (cleanNumber.startsWith('6')) {
        cardBrand.innerHTML = '<i class="fab fa-cc-discover"></i>';
    } else {
        cardBrand.innerHTML = '<i class="fas fa-credit-card"></i>';
    }
}

// 支払い情報の送信処理
function handlePaymentSubmit() {
    const cardNumber = document.getElementById('card-number').value;
    const cardHolder = document.getElementById('card-holder').value;
    const cardExpiry = document.getElementById('card-expiry').value;
    const cardCvv = document.getElementById('card-cvv').value;
    const termsAgree = document.getElementById('terms-agree').checked;
    
    const btnText = document.querySelector('.btn-payment .btn-text');
    const btnLoading = document.querySelector('.btn-payment .btn-loading');
    const paymentBtn = document.querySelector('.btn-payment');
    
    // バリデーション
    if (!validatePaymentForm()) {
        return;
    }
    
    // ローディング表示
    btnText.style.display = 'none';
    btnLoading.style.display = 'block';
    paymentBtn.disabled = true;
    
    // ダミー送信処理（3秒後に完了）
    setTimeout(() => {
        // 完了メッセージ
        alert('お支払い情報の登録が完了しました。\n\ne.CYCLEへのお申込み手続きがすべて完了いたしました。\n供給開始まで今しばらくお待ちください。');
        
        // メインアプリへ移行
        showMainApp();
    }, 3000);
}

// 支払いフォームのバリデーション
function validatePaymentForm() {
    const cardNumber = document.getElementById('card-number').value.replace(/\s/g, '');
    const cardHolder = document.getElementById('card-holder').value;
    const cardExpiry = document.getElementById('card-expiry').value;
    const cardCvv = document.getElementById('card-cvv').value;
    const termsAgree = document.getElementById('terms-agree').checked;
    
    let isValid = true;
    
    // カード番号チェック
    if (!cardNumber || cardNumber.length < 13) {
        showPaymentError('card-number', '正しいカード番号を入力してください');
        isValid = false;
    } else {
        clearPaymentError('card-number');
    }
    
    // 名義人チェック
    if (!cardHolder.trim()) {
        showPaymentError('card-holder', 'カード名義人を入力してください');
        isValid = false;
    } else {
        clearPaymentError('card-holder');
    }
    
    // 有効期限チェック
    if (!cardExpiry || !isValidExpiry(cardExpiry)) {
        showPaymentError('card-expiry', '正しい有効期限を入力してください');
        isValid = false;
    } else {
        clearPaymentError('card-expiry');
    }
    
    // CVVチェック
    if (!cardCvv || cardCvv.length < 3) {
        showPaymentError('card-cvv', 'セキュリティコードを入力してください');
        isValid = false;
    } else {
        clearPaymentError('card-cvv');
    }
    
    // 利用規約同意チェック
    if (!termsAgree) {
        alert('利用規約に同意してください。');
        isValid = false;
    }
    
    return isValid;
}

// 有効期限の妥当性チェック
function isValidExpiry(expiry) {
    if (!/^\d{2}\/\d{2}$/.test(expiry)) return false;
    
    const [month, year] = expiry.split('/').map(Number);
    if (month < 1 || month > 12) return false;
    
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;
    
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
        return false;
    }
    
    return true;
}

// 支払いエラー表示
function showPaymentError(inputId, message) {
    const input = document.getElementById(inputId);
    const errorElement = input.closest('.form-group').querySelector('.error-message');
    
    input.classList.add('error');
    if (errorElement) {
        errorElement.textContent = message;
    }
}

// 支払いエラークリア
function clearPaymentError(inputId) {
    const input = document.getElementById(inputId);
    const errorElement = input.closest('.form-group').querySelector('.error-message');
    
    input.classList.remove('error');
    if (errorElement) {
        errorElement.textContent = '';
    }
}

// UX改善機能
function initUXEnhancements() {
    // スクロールプログレスインジケーター
    initScrollProgress();
    
    // インターセクションオブザーバーでアニメーション
    initScrollAnimations();
    
    // キーボードナビゲーション改善
    initKeyboardNavigation();
    
    // タッチジェスチャー対応
    initTouchGestures();
}

// スクロール進捗インジケーター
function initScrollProgress() {
    // スクロール進捗バーをヘッダーに追加
    const header = document.querySelector('.header');
    if (header && !document.querySelector('.scroll-indicator')) {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-indicator';
        header.appendChild(progressBar);
        
        window.addEventListener('scroll', updateScrollProgress);
    }
}

function updateScrollProgress() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (!scrollIndicator) return;
    
    const scrollTop = window.pageYOffset;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    
    scrollIndicator.style.width = Math.min(scrollPercent, 100) + '%';
}

// スクロールアニメーション
function initScrollAnimations() {
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        // アニメーション対象要素を観察
        const animatedElements = document.querySelectorAll(
            '.feature-card, .billing-card, .usage-stats, .impact-card, .timeline-item'
        );
        
        animatedElements.forEach(el => {
            el.style.animationPlayState = 'paused';
            observer.observe(el);
        });
    }
}

// キーボードナビゲーション改善
function initKeyboardNavigation() {
    // Tabキーでのナビゲーション順序を改善
    const focusableElements = document.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    focusableElements.forEach((element, index) => {
        if (!element.hasAttribute('tabindex')) {
            element.setAttribute('tabindex', '0');
        }
    });
    
    // Escキーで閉じる操作
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // チャット画面が開いている場合は閉じる
            const chatWindow = document.getElementById('chat-window');
            if (chatWindow && chatWindow.classList.contains('active')) {
                backToSupport();
                return;
            }
            
            // パスワードリセット画面が開いている場合は閉じる
            const passwordResetScreen = document.getElementById('password-reset-screen');
            if (passwordResetScreen && passwordResetScreen.style.display === 'block') {
                backToLogin();
                return;
            }
        }
        
        // エンターキーでボタンのクリック
        if (e.key === 'Enter' && e.target.classList.contains('nav-item')) {
            e.target.click();
        }
    });
}

// タッチジェスチャー対応
function initTouchGestures() {
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    
    document.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    });
    
    document.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        handleTouchGesture();
    });
    
    function handleTouchGesture() {
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        const threshold = 50;
        
        // 横スワイプでセクション切り替え（将来の拡張用）
        if (Math.abs(deltaX) > threshold && Math.abs(deltaY) < threshold) {
            // 左スワイプ/右スワイプの処理は今後実装可能
        }
        
        // チャット画面で上スワイプでスクロールトップ
        const chatMessages = document.getElementById('chat-messages');
        if (chatMessages && deltaY > threshold) {
            chatMessages.scrollTop = 0;
        }
    }
}

// 改良されたエラーハンドリング
function initErrorHandling() {
    // グローバルエラーハンドラー
    window.addEventListener('error', (e) => {
        console.error('エラーが発生しました:', e.error);
        showUserFriendlyError('申し訳ございません。エラーが発生しました。ページを再読み込みしてお試しください。');
    });
    
    // 未処理のPromise rejection
    window.addEventListener('unhandledrejection', (e) => {
        console.error('Promise rejection:', e.reason);
        showUserFriendlyError('通信エラーが発生しました。しばらく待ってからお試しください。');
    });
    
    // ネットワークエラーの検出
    window.addEventListener('online', () => {
        hideNetworkError();
    });
    
    window.addEventListener('offline', () => {
        showNetworkError();
    });
}

// ユーザーフレンドリーなエラーメッセージ
function showUserFriendlyError(message) {
    const errorToast = createErrorToast(message);
    document.body.appendChild(errorToast);
    
    setTimeout(() => {
        errorToast.remove();
    }, 5000);
}

function createErrorToast(message) {
    const toast = document.createElement('div');
    toast.className = 'error-toast';
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas fa-exclamation-triangle"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="toast-close">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // CSS for error toast
    const style = document.createElement('style');
    style.textContent = `
        .error-toast {
            position: fixed;
            top: 80px;
            left: 50%;
            transform: translateX(-50%);
            background: #E74C3C;
            color: white;
            padding: 16px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
            z-index: 10000;
            animation: slideDown 0.3s ease-out;
            max-width: 90%;
        }
        
        .toast-content {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .toast-close {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            padding: 4px;
            margin-left: auto;
        }
        
        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateX(-50%) translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }
        }
    `;
    
    if (!document.querySelector('#error-toast-styles')) {
        style.id = 'error-toast-styles';
        document.head.appendChild(style);
    }
    
    return toast;
}

// ネットワークエラー表示
function showNetworkError() {
    if (!document.querySelector('.network-error')) {
        const networkError = document.createElement('div');
        networkError.className = 'network-error';
        networkError.innerHTML = `
            <div class="network-error-content">
                <i class="fas fa-wifi"></i>
                <span>オフラインです</span>
            </div>
        `;
        
        document.body.appendChild(networkError);
    }
}

function hideNetworkError() {
    const networkError = document.querySelector('.network-error');
    if (networkError) {
        networkError.remove();
    }
}

// エラーハンドリング
window.addEventListener('error', (e) => {
    console.error('エラーが発生しました:', e.error);
    // ユーザーへのエラー通知（必要に応じて実装）
});

// 申込フォーム機能
let formData = {};

// フォームの初期化
function initApplicationForm() {
    const form = document.getElementById('apply-form');
    if (!form) return;
    
    // フォーム送信イベント
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (validateForm()) {
            showConfirmation();
        }
    });
    
    // 入力補助機能
    initInputHelpers();
    
    // ファイルアップロード
    initFileUpload();
}

// 入力補助機能
function initInputHelpers() {
    // 郵便番号の自動ハイフン挿入
    const postalInput = document.getElementById('postal-code');
    if (postalInput) {
        postalInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/[^0-9]/g, '');
            if (value.length > 3) {
                value = value.slice(0, 3) + '-' + value.slice(3, 7);
            }
            e.target.value = value;
        });
    }
    
    // 電話番号の自動ハイフン挿入
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/[^0-9]/g, '');
            if (value.length > 3 && value.length <= 7) {
                value = value.slice(0, 3) + '-' + value.slice(3);
            } else if (value.length > 7) {
                value = value.slice(0, 3) + '-' + value.slice(3, 7) + '-' + value.slice(7, 11);
            }
            e.target.value = value;
        });
    }
    
    // カタカナ入力チェック
    const kanaInputs = document.querySelectorAll('[name="lastNameKana"], [name="firstNameKana"]');
    kanaInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            const value = e.target.value;
            if (value && !/^[\u30A0-\u30FF]+$/.test(value)) {
                showError(input, 'カタカナで入力してください');
            } else {
                clearError(input);
            }
        });
    });
}

// ファイルアップロード機能
function initFileUpload() {
    const fileInput = document.getElementById('bill-upload');
    const fileName = document.querySelector('.file-name');
    
    if (fileInput && fileName) {
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                fileName.textContent = file.name;
                clearError(fileInput);
            } else {
                fileName.textContent = '選択されていません';
            }
        });
    }
}

// フォームバリデーション
function validateForm() {
    const form = document.getElementById('apply-form');
    let isValid = true;
    
    // 必須項目チェック
    const requiredInputs = form.querySelectorAll('[required]');
    requiredInputs.forEach(input => {
        if (!input.value.trim()) {
            showError(input, 'この項目は必須です');
            isValid = false;
        } else {
            clearError(input);
        }
    });
    
    // メールアドレス確認
    const email = document.getElementById('email');
    const emailConfirm = document.getElementById('email-confirm');
    if (email.value !== emailConfirm.value) {
        showError(emailConfirm, 'メールアドレスが一致しません');
        isValid = false;
    }
    
    // メールアドレス形式チェック
    if (email.value && !isValidEmail(email.value)) {
        showError(email, '正しいメールアドレスを入力してください');
        isValid = false;
    }
    
    // ファイルアップロードチェック
    const fileInput = document.getElementById('bill-upload');
    if (!fileInput.files.length) {
        showError(fileInput, '電気料金明細をアップロードしてください');
        isValid = false;
    }
    
    return isValid;
}

// メールアドレス形式チェック
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// エラー表示
function showError(input, message) {
    input.classList.add('error');
    const errorElement = input.parentElement.querySelector('.error-message') || 
                        input.closest('.form-group').querySelector('.error-message');
    if (errorElement) {
        errorElement.textContent = message;
    }
}

// エラークリア
function clearError(input) {
    input.classList.remove('error');
    const errorElement = input.parentElement.querySelector('.error-message') || 
                        input.closest('.form-group').querySelector('.error-message');
    if (errorElement) {
        errorElement.textContent = '';
    }
}

// 確認画面表示
function showConfirmation() {
    // フォームデータ収集
    const form = document.getElementById('apply-form');
    const formDataObj = new FormData(form);
    
    formData = {
        lastName: formDataObj.get('lastName'),
        firstName: formDataObj.get('firstName'),
        lastNameKana: formDataObj.get('lastNameKana'),
        firstNameKana: formDataObj.get('firstNameKana'),
        postalCode: formDataObj.get('postalCode'),
        prefecture: formDataObj.get('prefecture'),
        city: formDataObj.get('city'),
        address: formDataObj.get('address'),
        email: formDataObj.get('email'),
        phone: formDataObj.get('phone'),
        fileName: document.querySelector('.file-name').textContent
    };
    
    // 確認画面に値を設定
    document.getElementById('confirm-name').textContent = `${formData.lastName} ${formData.firstName}`;
    document.getElementById('confirm-name-kana').textContent = `${formData.lastNameKana} ${formData.firstNameKana}`;
    document.getElementById('confirm-postal').textContent = formData.postalCode;
    document.getElementById('confirm-address').textContent = `${formData.prefecture}${formData.city}${formData.address}`;
    document.getElementById('confirm-email').textContent = formData.email;
    document.getElementById('confirm-phone').textContent = formData.phone;
    document.getElementById('confirm-file').textContent = formData.fileName;
    
    // 画面切り替え
    document.getElementById('application-form').classList.remove('active');
    document.getElementById('application-confirm').classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// フォームに戻る
function backToForm() {
    document.getElementById('application-confirm').classList.remove('active');
    document.getElementById('application-form').classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 申込送信
function submitApplication() {
    // 実際の送信処理（APIコールなど）
    console.log('申込データ送信:', formData);
    
    // 完了画面表示
    document.getElementById('application-confirm').classList.remove('active');
    document.getElementById('application-complete').classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// チャートタブ切り替え機能
function initChartTabs() {
    const chartTabs = document.querySelectorAll('.chart-tab');
    const chartContents = document.querySelectorAll('.chart-content');
    
    chartTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const period = tab.getAttribute('data-period');
            
            // タブのアクティブ状態を切り替え
            chartTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // 対応するチャートコンテンツを表示
            chartContents.forEach(content => {
                content.classList.remove('active');
            });
            
            const targetContent = document.getElementById(`${period}-chart`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

// チャット機能
let chatMessages = [];

// チャット開始
function startChat() {
    document.getElementById('support-main').classList.remove('active');
    document.getElementById('chat-window').classList.add('active');
    
    // 初期メッセージがまだない場合のみ追加
    if (chatMessages.length === 0) {
        chatMessages.push({
            type: 'bot',
            message: 'こんにちは！e.CYCLEサポートです。<br>どのようなことでお困りでしょうか？',
            time: '今すぐ'
        });
    }
}

// サポートページに戻る
function backToSupport() {
    document.getElementById('chat-window').classList.remove('active');
    document.getElementById('support-main').classList.add('active');
}

// メッセージ送信
function sendMessage() {
    const input = document.getElementById('chat-input');
    if (!input) return;
    
    const message = input.value.trim();
    if (!message) return;
    
    // ユーザーメッセージを追加
    addMessage('user', message);
    input.value = '';
    
    // 送信ボタンを一時的に無効化
    const sendBtn = document.getElementById('chat-send-btn');
    if (sendBtn) {
        sendBtn.disabled = true;
    }
    
    // 1秒後にボット返信
    setTimeout(() => {
        const botResponse = getBotResponse(message);
        addMessage('bot', botResponse);
        sendBtn.disabled = false;
    }, 1000);
}

// メッセージを追加
function addMessage(type, message) {
    const messagesContainer = document.getElementById('chat-messages');
    const time = new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
    
    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}-message`;
    
    const avatarIcon = type === 'bot' ? 'fas fa-robot' : 'fas fa-user';
    
    messageElement.innerHTML = `
        <div class="message-avatar">
            <i class="${avatarIcon}"></i>
        </div>
        <div class="message-content">
            <p>${message}</p>
            <span class="message-time">${time}</span>
        </div>
    `;
    
    messagesContainer.appendChild(messageElement);
    
    // 自動スクロール
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // メッセージを配列に保存
    chatMessages.push({
        type: type,
        message: message,
        time: time
    });
}

// ボット返信ロジック
function getBotResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    // FAQ自動返信
    if (message.includes('引っ越し') || message.includes('引越し') || message.includes('転居')) {
        return `引っ越し手続きについてご案内いたします。<br><br>
        1. 新住所が決まったらお早めにご連絡ください<br>
        2. 引っ越し予定日の1週間前までにお手続きをお願いします<br>
        3. お客様番号をご準備の上、お電話またはメールでご連絡ください<br><br>
        ☎️ 0120-XXX-XXX<br>
        📧 メールでのお問い合わせもご利用いただけます`;
    }
    
    if (message.includes('解約') || message.includes('退会') || message.includes('やめる')) {
        return `解約手続きについてご案内いたします。<br><br>
        1. 解約希望日の1ヶ月前までにご連絡ください<br>
        2. 最終月の電気料金は日割り計算いたします<br>
        3. 解約手数料はかかりません<br><br>
        解約をご希望の場合は、お電話にてお手続きをお願いいたします。<br>
        ☎️ 0120-XXX-XXX（平日9:00-18:00）`;
    }
    
    if (message.includes('料金') || message.includes('請求') || message.includes('支払') || message.includes('金額')) {
        return `料金に関するお問い合わせですね。<br><br>
        料金の詳細は「料金確認」ページでご確認いただけます。<br>
        月別の使用量や環境貢献実績もご覧いただけます。<br><br>
        💡 料金確認ページはボトムメニューの「料金確認」からアクセスできます<br><br>
        その他ご不明な点がございましたら、お気軽にお聞かせください。`;
    }
    
    if (message.includes('使い方') || message.includes('操作') || message.includes('ポータル') || message.includes('画面')) {
        return `ポータルの使い方についてご案内いたします。<br><br>
        📱 <strong>ボトムメニュー</strong><br>
        ・ホーム：お客様の利用状況<br>
        ・シミュレーション：料金計算<br>
        ・料金確認：請求内容の詳細<br>
        ・使用量：電力使用量のグラフ<br>
        ・サポート：お問い合わせ<br><br>
        各画面で操作方法がご不明でしたら、具体的にお聞かせください！`;
    }
    
    if (message.includes('名義変更') || message.includes('名前変更') || message.includes('契約者変更')) {
        return `名義変更についてご案内いたします。<br><br>
        以下の書類が必要となります：<br>
        1. 名義変更申請書（お電話でお送りします）<br>
        2. 新契約者様の本人確認書類<br>
        3. 現契約者様の同意書<br><br>
        お手続きはお電話のみとなっております。<br>
        ☎️ 0120-XXX-XXX（平日9:00-18:00）`;
    }
    
    if (message.includes('ありがと') || message.includes('感謝')) {
        return `どういたしまして！😊<br><br>
        他にもご不明な点がございましたら、いつでもお気軽にお声がけください。<br>
        e.CYCLEをご利用いただき、ありがとうございます！`;
    }
    
    // デフォルト返信
    return `ご質問ありがとうございます。<br><br>
    申し訳ございませんが、詳しい内容については担当者がお答えいたします。<br><br>
    📞 <strong>お電話でのお問い合わせ</strong><br>
    0120-XXX-XXX（平日9:00-18:00）<br><br>
    📧 <strong>メールでのお問い合わせ</strong><br>
    サポートページのメールフォームをご利用ください<br><br>
    お急ぎの場合はお電話でお問い合わせください。`;
}

// Enter キーでメッセージ送信
function initChatInput() {
    const chatInput = document.getElementById('chat-input');
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                sendMessage();
            }
        });
    }
}

// メール問合せフォーム送信
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const inquiryType = document.getElementById('inquiry-type').value;
            const inquiryContent = document.getElementById('inquiry-content').value;
            
            if (!inquiryType || !inquiryContent.trim()) {
                alert('必須項目を入力してください。');
                return;
            }
            
            // 送信処理（実際はAPIに送信）
            alert('お問い合わせを送信しました。\n担当者よりご連絡いたします。');
            
            // フォームをリセット
            contactForm.reset();
        });
    }
}

// DOMContentLoaded に追加
document.addEventListener('DOMContentLoaded', () => {
    // 既存の初期化処理...
    
    // 申込フォームの初期化を追加
    initApplicationForm();
    
    // チャートタブの初期化を追加
    initChartTabs();
    
    // チャット機能の初期化を追加
    initChatInput();
    
    // メール問合せフォームの初期化を追加
    initContactForm();
    
    // ログイン機能の初期化を追加
    initLogin();
    
    // パスワードリセット機能の初期化を追加
    initPasswordReset();
    
    // 支払いフォームの初期化を追加
    initPaymentForm();
    
    // UX改善機能の初期化を追加
    initUXEnhancements();
    
    // エラーハンドリングの初期化を追加
    initErrorHandling();
    
    // シミュレーション結果を自動表示（入力フィールド削除のため）
    setTimeout(() => {
        if (document.getElementById('simulation')) {
            calculateSimulation();
        }
    }, 500);
});
// 契約情報の折りたたみ
function toggleContractDetails() {
    const content = document.getElementById('contract-content');
    const toggle = document.getElementById('contract-toggle');
    const icon = toggle.querySelector('i');
    
    if (content.style.display === 'none') {
        content.style.display = 'block';
        icon.classList.remove('fa-plus');
        icon.classList.add('fa-minus');
    } else {
        content.style.display = 'none';
        icon.classList.remove('fa-minus');
        icon.classList.add('fa-plus');
    }
}

// 料金詳細の折りたたみ
function togglePricingDetails() {
    const content = document.getElementById('pricing-content');
    const toggle = document.getElementById('pricing-toggle');
    const icon = toggle.querySelector('i');
    
    if (content.style.display === 'none') {
        content.style.display = 'block';
        icon.classList.remove('fa-plus');
        icon.classList.add('fa-minus');
    } else {
        content.style.display = 'none';
        icon.classList.remove('fa-minus');
        icon.classList.add('fa-plus');
    }
}

// 申込み確認画面の編集ボタン機能
function editCustomerInfo() {
    alert('お客様情報の編集機能は準備中です。\n現在はデモ表示となっております。');
}

function editPlanInfo() {
    alert('プラン情報の編集機能は準備中です。\nシミュレーション画面から変更可能です。');
}

function proceedToContract() {
    // 申込み処理へ進む
    window.location.href = 'application-form.html';
}
