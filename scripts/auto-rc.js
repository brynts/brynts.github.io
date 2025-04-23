/*************************************

RevenueCat Script by @brynts

*************************************/

// === CONFIGURATION === //
const mapping = [
  {
    app: "PhotoRoom",
    "user-agent": "PhotoRoom",
    "bundle-id": "com.background.app",
    entitlement: ["business"]
  },
  {
    app: "TouchRetouch",
    "user-agent": "TouchRetouchBasic",
    "bundle-id": "com.advasoft.touchretouch",
    entitlement: ["premium"]
  },
  {
    app: "WAStory Converter",
    "user-agent": "WAStoryConverter",
    "bundle-id": "com.wastory.converter",
    entitlement: ["Premium"]
  },
  {
    app: "Simple Weather",
    "user-agent": "simple-weather",
    "bundle-id": "com.simpleweather.app",
    entitlement: ["believer", "skinAndy", "skinCedar", "skinChroma", "skinKarat", "skinMonster", "skinOpal", "skinPresstube", "weatherApp"]
  },
  {
    app: "Video Converter",
    "user-agent": "Video%20converter",
    "bundle-id": "com.videoconverter.app",
    entitlement: ["unlock_everything_pro"]
  },
  {
    app: "Jellycuts",
    "user-agent": "Jellycuts",
    "bundle-id": "com.jellycuts.app",
    entitlement: ["pro"]
  },
  {
    app: "ImageX",
    "user-agent": "ImageX",
    "bundle-id": "com.imagex.ios",
    entitlement: ["imagex.pro.ios"]
  },
  {
    app: "VSCO",
    "user-agent": "VSCO",
    "bundle-id": "co.visualsupply.cam",
    entitlement: ["pro"]
  },
  {
    app: "AthanPro",
    "user-agent": "Athan%20Pro",
    "bundle-id": "Quanticapps.Athan",
    entitlement: ["com.quanticapps.premium"]
  }
];

// === FAKE SUBSCRIPTION DATA === //
const fakeSubscription = {
  is_sandbox: false,
  ownership_type: "PURCHASED",
  billing_issues_detected_at: null,
  period_type: "normal",
  expires_date: "2099-12-18T01:04:17Z",
  grace_period_expires_date: null,
  unsubscribe_detected_at: null,
  original_purchase_date: "2024-07-28T01:04:18Z",
  purchase_date: "2024-07-28T01:04:17Z",
  store: "app_store",
  auto_resume_date: null,
  refunded_at: null,
  store_transaction_id: "999999999999999"
};

function makeEntitlement(productId) {
  return {
    grace_period_expires_date: null,
    purchase_date: "2024-07-28T01:04:17Z",
    product_identifier: productId,
    expires_date: "2099-12-18T01:04:17Z"
  };
}

// === MAIN LOGIC === //
let obj = {};
try {
  obj = JSON.parse($response.body);
} catch (e) {
  console.log("Failed to parse response body:", e);
  $done({});
}

// Normalize headers
let ua = ($request.headers["User-Agent"] || $request.headers["user-agent"] || "").toLowerCase();
let bundleId = ($request.headers["X-Client-Bundle-ID"] || $request.headers["x-client-bundle-id"] || "").toLowerCase();

// Initialize subscriber fields safely
obj.subscriber = obj.subscriber || {};
obj.subscriber.subscriptions = obj.subscriber.subscriptions || {};
obj.subscriber.entitlements = obj.subscriber.entitlements || {};

// Try to match based on bundle ID or User-Agent
const matchedApp = mapping.find(item =>
  bundleId.includes(item["bundle-id"].toLowerCase()) ||
  ua.includes(item["user-agent"].toLowerCase())
);

// Inject fake subscription if match found
if (matchedApp) {
  matchedApp.entitlement.forEach(id => {
    obj.subscriber.subscriptions[id] = fakeSubscription;
    obj.subscriber.entitlements[id] = makeEntitlement(id);
  });
} else {
  obj.subscriber.subscriptions["default.premium"] = fakeSubscription;
  obj.subscriber.entitlements["pro"] = makeEntitlement("default.premium");
}

$done({ body: JSON.stringify(obj) });
