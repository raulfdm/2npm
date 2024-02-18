import { string, safeParse } from "valibot";

export function getArchAndPlatform() {
	const arch = safeParse(string(), process.arch);

	if (arch.success === false) {
		throw new Error(
			`[getArchAndPlatform] could not determine arch: ${arch.issues[0].message}`,
		);
	}

	const platform = safeParse(string(), process.platform);

	if (platform.success === false) {
		throw new Error(
			`[getArchAndPlatform] could not determine platform: ${platform.issues[0].message}`,
		);
	}

	return {
		arch: arch.output,
		platform: arch.output,
	};
}
