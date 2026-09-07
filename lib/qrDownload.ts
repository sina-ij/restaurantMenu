import QRCode from "qrcode";

export async function downloadMenuQrCode(url: string, slug: string) {
  const canvas = document.createElement("canvas");
  await QRCode.toCanvas(canvas, url, {
    width: 512,
    margin: 2,
    color: { dark: "#221a13", light: "#ffffff" },
  });

  const blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
  if (!blob) throw new Error("QR canvas toBlob failed");

  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = `qr-menu-${slug}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(objectUrl);
}
