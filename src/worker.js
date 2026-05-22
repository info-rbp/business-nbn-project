export default {
  async fetch(request, env, ctx) {
    return new Response("Velocity Enterprise Node.js App - Cloudflare Worker Shim. This worker is for CI purposes only. Please deploy using a standard Node.js host.", {
      headers: { "content-type": "text/plain" },
    });
  },
};
