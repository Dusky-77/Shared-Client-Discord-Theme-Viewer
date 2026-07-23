import type { ButtonInteraction, Interaction, ModalSubmitInteraction } from "discord.js";
import { commands } from "../commands/index.js";
import { handleAngleDec, handleAngleInc, handleAngleModalBtn } from "../components/buttons/handleAngleButtons.js";
import { handleColorButton } from "../components/buttons/handleColorButtons.js";
import {
	handleContrast,
	handleExportCss,
	handleReset,
	handleSavePrompt,
	handleShare,
	handleSurprise,
} from "../components/buttons/handleActionButtons.js";
import { handleIntensityDec, handleIntensityInc, handleIntensityModalBtn } from "../components/buttons/handleIntensityButtons.js";
import { handleModeButton } from "../components/buttons/handleModeButtons.js";
import {
	handlePresetPageDynamic,
	handlePresetPageFirst,
	handlePresetPageModal,
} from "../components/buttons/handlePresetButtons.js";
import { handleModalAngle } from "../components/modals/handleAngleModal.js";
import { handleModalColor } from "../components/modals/handleColorModal.js";
import { handleModalIntensity } from "../components/modals/handleIntensityModal.js";
import { handleModalPresetPage } from "../components/modals/handlePresetPageModal.js";
import { handleModalSaveTheme } from "../components/modals/handleSaveModal.js";

const buttonHandlers: Record<string, (interaction: ButtonInteraction) => Promise<unknown>> = {
	preset_page_first: handlePresetPageFirst,
	preset_page_modal: handlePresetPageModal,
	angle_dec: handleAngleDec,
	angle_inc: handleAngleInc,
	angle_modal_btn: handleAngleModalBtn,
	intensity_dec: handleIntensityDec,
	intensity_inc: handleIntensityInc,
	intensity_modal_btn: handleIntensityModalBtn,
	action_surprise: handleSurprise,
	action_contrast: handleContrast,
	action_reset: handleReset,
	action_save_prompt: handleSavePrompt,
	action_export_css: handleExportCss,
	action_share: handleShare,
};

const modalHandlers: Record<string, (interaction: ModalSubmitInteraction) => Promise<unknown>> = {
	modal_preset_page: handleModalPresetPage,
	modal_angle: handleModalAngle,
	modal_intensity: handleModalIntensity,
	modal_save_theme: handleModalSaveTheme,
};

async function routeButton(interaction: ButtonInteraction) {
	const id = interaction.customId;

	const directHandler = buttonHandlers[id];
	if (directHandler) return directHandler(interaction);

	if (id.startsWith("mode_")) return handleModeButton(interaction);
	if (id.startsWith("color_btn_")) return handleColorButton(interaction);
	if (id.startsWith("preset_page_")) return handlePresetPageDynamic(interaction);
}

async function routeModal(interaction: ModalSubmitInteraction) {
	const id = interaction.customId;

	const directHandler = modalHandlers[id];
	if (directHandler) return directHandler(interaction);

	if (id.startsWith("modal_color_")) return handleModalColor(interaction);
}

export async function onInteractionCreate(interaction: Interaction) {
	if (interaction.isChatInputCommand()) {
		const command = commands.find((c) => c.data.name === interaction.commandName);
		if (command) return command.execute(interaction);
		return;
	}

	if (interaction.isButton()) return routeButton(interaction);
	if (interaction.isModalSubmit()) return routeModal(interaction);
}
