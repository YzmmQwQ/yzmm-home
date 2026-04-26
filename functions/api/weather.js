export async function onRequest() {
  // 直接用固定城市，避免 IP 查询失败
  const res = await fetch("https://uapis.cn/api/v1/misc/weather?city=Jinan");
  const data = await res.json();

  return new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}