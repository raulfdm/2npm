/**
 * This is a temporary file to support the migration from the
 * previous implementation until we have a new one.
 */

import * as path from "node:path";
import * as fs from "node:fs";

import { object, safeParse, string, type Output } from "valibot";

export function getGoProjectConfig() {
	const rootDir = process.cwd();
	const pkgJson = getPackageJson(rootDir);
	const config = getGoBinaryConfig(pkgJson.content);

	return {
		rootDir,
		pkgJson: config,
		// TODO: fix this. It should respect the path the user defines
		absoluteDistPath: path.join(rootDir, "/dist"),
		temp: {
			folder: path.join(rootDir, "temp"),
			filename: "binary.tar.gz",
			get filePath() {
				return path.join(this.folder, this.filename);
			},
		},
	} as const;
}

function getPackageJson(rootDir: string) {
	const packageJson = path.join(rootDir, "package.json");
	const contentString = fs.readFileSync(packageJson, "utf-8");
	const pkgJson = JSON.parse(contentString) as unknown;

	return {
		content: pkgJson,
		path: packageJson,
	};
}

const goBinary = object(
	{
		name: string("Invalid package.json: goBinary.name is not a string"),
		url: string("Invalid package.json: goBinary.url is not a string"),
	},
	"Invalid package.json: goBinary is missing.",
);

const config = object({
	version: string(),
	goBinary: goBinary,
});

export type GoBinaryConfig = Output<typeof config>;

function getGoBinaryConfig(pkgJson: unknown): GoBinaryConfig {
	if (!pkgJson) {
		throw new Error("invalid package.json");
	}

	const pkgJsonResult = safeParse(config, pkgJson);

	if (!pkgJsonResult.success) {
		throw new Error(pkgJsonResult.issues.join("\n"));
	}

	return {
		version: pkgJsonResult.output.version,
		goBinary: pkgJsonResult.output.goBinary,
	};
}
