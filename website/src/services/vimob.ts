import "server-only";

const URL = process.env.VIMOB_API_URL!;
const KEY = process.env.VIMOB_API_KEY!;

interface VimobLeadPayload {
  name: string;
  phone: string;
  email?: string;
  message?: string;
}

export async function createVimobLead(payload: VimobLeadPayload): Promise<void> {
  try {
    const res = await fetch(`${URL}/leads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${KEY}`,
      },
      body: JSON.stringify({ source: "Site Plenus", ...payload }),
    });
    if (!res.ok) {
      const text = await res.text();
      console.error(`Vimob lead error ${res.status}:`, text);
    }
  } catch (err) {
    console.error("Vimob lead fetch failed:", err);
  }
}
