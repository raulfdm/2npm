import path from "node:path";
import { getArchAndPlatform } from "@2npm/core";
import { getGoProjectConfig, type GoBinaryConfig } from "@2npm/core/legacy";

import {
	ARCH_MAPPING,
	PLATFORM_MAPPING,
	type SupportedArchs,
	type SupportedPlatforms,
	supportedArches,
	supportedPlatforms,
} from "./schemas";

export function getProjectConfig() {
	const { arch, platform } = getSupportedArchAndPlatform();
	const { rootDir, pkgJson } = getGoProjectConfig();
	const metadata = getMetadata(pkgJson, platform, arch);

	return {
		arch,
		platform,
		pkgJson,
		metadata,
		rootDir,
		absoluteDistPath: `${rootDir}/dist`,
		temp: {
			folder: path.join(rootDir, "temp"),
			filename: "binary.tar.gz",
			get filePath() {
				return path.join(this.folder, this.filename);
			},
		},
	} as const;
}

export type ProjectConfig = ReturnType<typeof getProjectConfig>;

function getSupportedArchAndPlatform() {
	const { arch, platform } = getArchAndPlatform();

	// biome-ignore lint/suspicious/noExplicitAny: we don't know the process.arg
	if (!supportedArches.includes(arch as any)) {
		throw new Error(`Unsupported architecture: ${process.arch}`);
	}

	if (
		// biome-ignore lint/suspicious/noExplicitAny: we don't know the process.platform value
		!supportedPlatforms.includes(process.platform as any)
	) {
		throw new Error(`Unsupported platform: ${process.platform}`);
	}

	return {
		arch: arch as SupportedArchs,
		platform: platform as SupportedPlatforms,
	};
}

function getMetadata(
	{ goBinary, version }: GoBinaryConfig,
	platform: SupportedPlatforms,
	arch: SupportedArchs,
) {
	let binaryName = goBinary.name;
	let url = goBinary.url;

	if (version.startsWith("v")) {
		version = version.substring(1); // strip the 'v' if necessary v0.0.1 => 0.0.1
	}

	// Binary name on Windows has .exe suffix
	if (platform === "win32") {
		binaryName += ".exe";
	}

	console.log({
		ARCH: arch,
		PLATFORM: platform,
	});

	// Interpolate variables in URL, if necessary
	url = url.replace(/{{arch}}/g, ARCH_MAPPING[arch]);
	url = url.replace(/{{platform}}/g, PLATFORM_MAPPING[platform]);
	url = url.replace(/{{version}}/g, version);
	url = url.replace(/{{bin_name}}/g, binaryName);

	return {
		binaryName,
		url,
		version,
	};
}
