import { Router } from "express";
import { db, contactMessagesTable, siteSettingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { SubmitContactBody } from "@workspace/api-zod";

const router = Router();

router.post("/contact", async (req, res) => {
  try {
    const body = SubmitContactBody.parse(req.body);

    await db.insert(contactMessagesTable).values({
      name: body.name,
      email: body.email,
      phone: body.phone ?? null,
      subject: body.subject,
      message: body.message,
    });

    const keyRows = await db.select().from(siteSettingsTable).where(eq(siteSettingsTable.key, "web3formsKey"));
    const web3formsKey = keyRows[0]?.value || "";

    if (web3formsKey) {
      try {
        const w3Response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            access_key: web3formsKey,
            name: body.name,
            email: body.email,
            phone: body.phone || "",
            subject: `[Maître Séraphin] ${body.subject}`,
            message: body.message,
          }),
        });
        const w3Data = await w3Response.json() as { success?: boolean; message?: string };
        req.log.info({ w3Data }, "Web3Forms response");
      } catch (w3Err) {
        req.log.warn({ w3Err }, "Web3Forms submission failed, message saved locally");
      }
    }

    res.json({ success: true, message: "Votre message a été envoyé avec succès" });
  } catch (err) {
    req.log.error({ err }, "Contact submission error");
    res.status(400).json({ error: "Données invalides" });
  }
});

router.get("/messages", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Non authentifié" });
    return;
  }
  const token = authHeader.slice(7);
  if (token !== process.env.ADMIN_TOKEN) {
    res.status(401).json({ error: "Token invalide" });
    return;
  }

  try {
    const messages = await db.select().from(contactMessagesTable).orderBy(contactMessagesTable.createdAt);
    const formatted = messages.map((m) => ({
      id: m.id,
      name: m.name,
      email: m.email,
      phone: m.phone,
      subject: m.subject,
      message: m.message,
      createdAt: m.createdAt.toISOString(),
    }));
    res.json(formatted);
  } catch (err) {
    req.log.error({ err }, "Failed to get messages");
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
