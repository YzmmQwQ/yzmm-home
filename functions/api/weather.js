export async function onRequest(context) {
  // 获取用户真实 IP
  const ip = context.request.headers.get("cf-connecting-ip") || "";

  // 用 IP 查城市
  const ipRes = await fetch(`https://ipapi.co/${ip}/json/`);
  const ipData = await ipRes.json();
  const city = ipData.city || "北京";

  // 用城市查天气
  const res = await fetch(`https://uapis.cn/api/v1/misc/weather?city=${encodeURIComponent(city)}`);
  const data = await res.json();

  return new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}