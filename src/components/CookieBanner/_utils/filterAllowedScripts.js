// CHI CAN 1 DANH SACH DUY NHAT (Nhung tu khoa nhan dien cong cu Thong Ke/Analytics)
const STATISTICS_KEYWORDS = [
  "googletagmanager", // GTM
  "gtm.js", // GTM
  "gtag", // Google Analytics moi
  "google-analytics", // GA
  "analytics", // Cac loai file analytics chung
  "hotjar", // Ban do nhiet
];

export const filterAllowedScripts = (scripts, prefs) => {
  return scripts.filter((script) => {
    const contentToScan = (
      (script.src || "") + (script.content || "")
    ).toLowerCase();

    // Kiem tra xem script nay CO PHAI la Thong ke khong?
    const isStatistics = STATISTICS_KEYWORDS.some((kw) =>
      contentToScan.includes(kw),
    );

    if (isStatistics) {
      // NEU LA THONG KE: Chi cho qua khi khach bat Statistics
      if (!prefs.statistics) {
        console.log(
          "🚫 Blocked Statistics Script:",
          script.src || "inline-script",
        );
        return false;
      }
      return true;
    }

    // NEU LA CAC MA CON LAI (BAO GOM CA UBEMBED VA MA LA): Mac dinh coi la MARKETING!
    // Chi cho qua khi khach bat Marketing
    if (!prefs.marketing) {
      console.log(
        "🚫 Blocked Marketing/Unknown Script:",
        script.src || "inline-script",
      );
      return false;
    }
    return true;
  });
};

// THEM HAM MOI: Chuyen dung de quet mang chuoi string (noscript)
export const filterAllowedNoscripts = (noscripts, prefs) => {
  return noscripts.filter((noscriptStr) => {
    // Ep chuoi html ve chu thuong de quet
    const contentToScan = noscriptStr.toLowerCase();

    const isStatistics = STATISTICS_KEYWORDS.some((kw) =>
      contentToScan.includes(kw),
    );

    if (isStatistics) {
      if (!prefs.statistics) {
        console.log("🚫 Đã chặn Statistics Noscript");
        return false;
      }
      return true;
    }

    if (!prefs.marketing) {
      console.log("🚫 Đã chặn Marketing/Unknown Noscript");
      return false;
    }
    return true;
  });
};
