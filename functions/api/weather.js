export async function onRequest() {
  const res = await fetch("https://uapis.cn/api/v1/misc/weather");
  const data = await res.json();

  return new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}