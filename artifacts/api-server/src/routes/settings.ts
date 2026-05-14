import { Router } from "express";
import { db, siteSettingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  GetSettingsResponse,
  UpdateSettingsBody,
  UpdateSettingsResponse,
} from "@workspace/api-zod";

const router = Router();

const DEFAULT_SETTINGS: Record<string, string> = {
  siteName: "Maître Zonon 666",
  phone: "+22968075372",
  whatsapp: "+22968075372",
  address: "Quartier Ahouandjigo, Lokossa — Bénin",
  email: "contact@maitrezonon666.com",
  web3formsKey: "",
  heroImage: "",
  aboutImage: "",
  ceremonyImages: "[]",
  ritualImages: "[]",
  videoUrl: "",
  videoTitle: "Le Maître en Action — Voyez la Puissance à l'Œuvre",
};

async function getSettingsMap(): Promise<Record<string, string>> {
  const rows = await db.select().from(siteSettingsTable);
  const map: Record<string, string> = { ...DEFAULT_SETTINGS };
  for (const row of rows) {
    map[row.key] = row.value;
  }
  return map;
}

function mapToSettings(map: Record<string, string>) {
  let ceremonyImages: string[] = [];
  try { ceremonyImages = JSON.parse(map.ceremonyImages || "[]"); } catch { ceremonyImages = []; }
  let ritualImages: string[] = [];
  try { ritualImages = JSON.parse(map.ritualImages || "[]"); } catch { ritualImages = []; }
  return {
    siteName: map.siteName,
    phone: map.phone,
    whatsapp: map.whatsapp,
    address: map.address,
    email: map.email,
    web3formsKey: map.web3formsKey,
    heroImage: map.heroImage,
    aboutImage: map.aboutImage,
    ceremonyImages,
    ritualImages,
    videoUrl: map.videoUrl,
    videoTitle: map.videoTitle,
  };
}

router.get("/settings", async (req, res) => {
  try {
    const map = await getSettingsMap();
    const parsed = GetSettingsResponse.parse(mapToSettings(map));
    res.json(parsed);
  } catch (err) {
    req.log.error({ err }, "Failed to get settings");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/settings", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  const token = authHeader.slice(7);
  if (token !== process.env.ADMIN_TOKEN) {
    res.status(401).json({ error: "Invalid token" });
    return;
  }

  try {
    const body = UpdateSettingsBody.parse(req.body);

    const updates: [string, string][] = [];
    if (body.siteName !== undefined) updates.push(["siteName", body.siteName]);
    if (body.phone !== undefined) updates.push(["phone", body.phone]);
    if (body.whatsapp !== undefined) updates.push(["whatsapp", body.whatsapp]);
    if (body.address !== undefined) updates.push(["address", body.address]);
    if (body.email !== undefined) updates.push(["email", body.email]);
    if (body.web3formsKey !== undefined) updates.push(["web3formsKey", body.web3formsKey]);
    if (body.heroImage !== undefined) updates.push(["heroImage", body.heroImage]);
    if (body.aboutImage !== undefined) updates.push(["aboutImage", body.aboutImage]);
    if (body.ceremonyImages !== undefined) updates.push(["ceremonyImages", JSON.stringify(body.ceremonyImages)]);
    if (body.ritualImages !== undefined) updates.push(["ritualImages", JSON.stringify(body.ritualImages)]);
    if (body.videoUrl !== undefined) updates.push(["videoUrl", body.videoUrl]);
    if (body.videoTitle !== undefined) updates.push(["videoTitle", body.videoTitle]);

    for (const [key, value] of updates) {
      const existing = await db.select().from(siteSettingsTable).where(eq(siteSettingsTable.key, key));
      if (existing.length > 0) {
        await db.update(siteSettingsTable).set({ value }).where(eq(siteSettingsTable.key, key));
      } else {
        await db.insert(siteSettingsTable).values({ key, value });
      }
    }

    const map = await getSettingsMap();
    const parsed = UpdateSettingsResponse.parse(mapToSettings(map));
    res.json(parsed);
  } catch (err) {
    req.log.error({ err }, "Failed to update settings");
    res.status(400).json({ error: "Invalid request" });
  }
});

export default router;
