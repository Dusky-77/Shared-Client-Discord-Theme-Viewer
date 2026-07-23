import { createCanvas } from "@napi-rs/canvas";
import { AttachmentBuilder } from "discord.js";

export async function generatePreviewCanvas(
	colors: string[],
	angle: number,
	activeIndex: number = 0,
): Promise<AttachmentBuilder> {
	const canvas = createCanvas(800, 140);
	const ctx = canvas.getContext("2d");

	const rad = (angle * Math.PI) / 180;
	const x1 = 400 + Math.cos(rad) * 400;
	const y1 = 70 + Math.sin(rad) * 70;
	const x2 = 400 - Math.cos(rad) * 400;
	const y2 = 70 - Math.sin(rad) * 70;

	const grad = ctx.createLinearGradient(x1, y1, x2, y2);
	colors.forEach((c, i) => grad.addColorStop(i / Math.max(colors.length - 1, 1), c));

	ctx.fillStyle = grad;
	ctx.fillRect(0, 0, 800, 140);

	const barLeft = 50;
	const barRight = 750;
	const barWidth = barRight - barLeft;

	colors.forEach((c, i) => {
		const t = colors.length === 1 ? 0.5 : i / (colors.length - 1);
		const cx = barLeft + t * barWidth;
		const cy = 70;
		const size = 52;
		const hx = cx - size / 2;
		const hy = cy - size / 2;

		ctx.save();
		ctx.beginPath();
		ctx.roundRect(hx, hy, size, size, 8);
		ctx.strokeStyle = "#FFFFFF";
		ctx.lineWidth = 4;
		ctx.stroke();
		ctx.restore();
	});

	return new AttachmentBuilder(await canvas.encode("png"), { name: "theme-preview.png" });
}

export async function createMiniSwatch(colors: string[]): Promise<AttachmentBuilder> {
	const canvas = createCanvas(300, 80);
	const ctx = canvas.getContext("2d");
	const grad = ctx.createLinearGradient(0, 0, 300, 80);
	colors.forEach((c, i) => grad.addColorStop(i / Math.max(colors.length - 1, 1), c));
	ctx.fillStyle = grad;
	ctx.fillRect(0, 0, 300, 80);
	return new AttachmentBuilder(await canvas.encode("png"), {
		name: `swatch-${Date.now()}-${Math.random().toString(36).substring(7)}.png`,
	});
}
