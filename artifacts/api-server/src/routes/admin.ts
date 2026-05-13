import { Router } from "express";
import { AdminLoginBody } from "@workspace/api-zod";
import crypto from "crypto";

const router = Router();

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Valala123@@";

router.post("/admin/login", (req, res) => {
  try {
    const body = AdminLoginBody.parse(req.body);
    if (body.password !== ADMIN_PASSWORD) {
      res.status(401).json({ error: "Mot de passe incorrect" });
      return;
    }
    const token = process.env.ADMIN_TOKEN || crypto.randomUUID();
    res.json({ success: true, token });
  } catch (err) {
    req.log.error({ err }, "Admin login error");
    res.status(400).json({ error: "Requête invalide" });
  }
});

router.post("/admin/logout", (_req, res) => {
  res.json({ success: true, message: "Déconnecté" });
});

export default router;
