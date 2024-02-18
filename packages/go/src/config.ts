import path from "node:path";
import { getPackagesSync } from "@manypkg/get-packages";
import { getArchAndPlatform } from "@2npm/core";

import {
	ARCH_MAPPING,
	PLATFORM_MAPPING,
	type PackageJson,
	type SupportedArchs,
	type SupportedPlatforms,
	supportedArches,
	supportedPlatforms,
} from "./schemas";

export function getProjectConfig() {
	const { arch, platform } = getSupportedArchAndPlatform();
	const { rootDir, ...pkgJson } = readPackageJson();
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

function readPackageJson(): PackageJson & {
	rootDir: string;
} {
	const { rootPackage, rootDir } = getPackagesSync(process.cwd());

	const packageJsonResult = validatePackageJson(rootPackage?.packageJson);

	if (!packageJsonResult.success) {
		console.error("[PACKAGE_JSON_PARSING]", packageJsonResult.error);
		process.exit(1);
	}

	return {
		...packageJsonResult.data,
		rootDir,
	};
}

type ValidationResult =
	| { success: true; data: PackageJson }
	| { success: false; error: string };

function validatePackageJson(pkgJson: unknown): ValidationResult {
	if (pkgJson === null || typeof pkgJson !== "object") {
		return {
			success: false,
			error: "Invalid package.json",
		};
	}

	if (typeof pkgJson !== "object") {
		return {
			success: false,
			error: "Invalid package.json",
		};
	}

	if ("version" in pkgJson === false) {
		return {
			success: false,
			error: "Invalid package.json: version is not a string",
		};
	}

	if ("goBinary" in pkgJson === false) {
		return {
			success: false,
			error: "Invalid package.json: goBinary is not an object",
		};
	}

	if (typeof pkgJson.goBinary !== "object") {
		return {
			success: false,
			error: "Invalid package.json: goBinary is not an object",
		};
	}

	// biome-ignore lint/style/noNonNullAssertion: <explanation>
	const goBinary = pkgJson.goBinary!;

	if ("name" in goBinary === false) {
		return {
			success: false,
			error: "Invalid package.json: goBinary.name is not a string",
		};
	}

	if (typeof goBinary.name !== "string") {
		return {
			success: false,
			error: "Invalid package.json: goBinary.name is not a string",
		};
	}

	if ("url" in goBinary === false) {
		return {
			success: false,
			error: "Invalid package.json: goBinary.url is not a string",
		};
	}

	const result = {
		success: true,
		data: pkgJson as PackageJson,
	} as const;

	return result;
}

function getMetadata(
	{ goBinary, version }: PackageJson,
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
