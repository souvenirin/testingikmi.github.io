function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function humanNow() {
  const d = new Date();
  return d.toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "medium" });
}

function detectCacheHint() {
  // Karena site statis, cache utamanya dari Cloudflare/Browser.
  // Kita tampilkan petunjuk sederhana dari Performance API.
  const nav = performance.getEntriesByType?.("navigation")?.[0];
  if (!nav) return "Tidak bisa dideteksi (browser tidak mendukung).";

  // Ini bukan bukti Cloudflare cache, tapi indikasi load yang cepat bisa karena cache.
  const t = Math.round(nav.duration);
  return `Load ~${t}ms (indikasi saja, bukan bukti cache Cloudflare).`;
}

document.addEventListener("DOMContentLoaded", () => {
  setText("now", humanNow());
  setText("host", location.hostname);
  setText("proto", location.protocol.replace(":", ""));
  setText("year", String(new Date().getFullYear()));

  setText("httpsStatus", location.protocol === "https:" ? "OK (HTTPS aktif)" : "Belum HTTPS");
  setText("cacheHint", detectCacheHint());
  setText("ua", navigator.userAgent);

  const pingBtn = document.getElementById("pingBtn");
  const pingResult = document.getElementById("pingResult");

  pingBtn?.addEventListener("click", async () => {
    pingResult.textContent = "Mengecek…";
    try {
      // Fetch ke halaman sendiri untuk memastikan akses normal
      const res = await fetch(location.href, { cache: "no-store" });
      pingResult.textContent = res.ok ? "✅ Halaman hidup (HTTP 200)" : `⚠️ HTTP ${res.status}`;
    } catch (e) {
      pingResult.textContent = "❌ Gagal fetch (cek koneksi / config).";
    }
  });

  const fakeForm = document.getElementById("fakeForm");
  const formMsg = document.getElementById("formMsg");

  fakeForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    formMsg.textContent = "Terkirim (demo). Untuk form beneran butuh backend / service email.";
    setTimeout(() => (formMsg.textContent = ""), 4000);
  });
});
