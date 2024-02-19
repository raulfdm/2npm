import { string, safeParse, object, optional, type Output } from "valibot";

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
		platform: platform.output,
	};
}

const _2npmConfig = object({
	binary: object({
		name: optional(string()),
		url: string(),
	}),
});

type _2npmConfig = Output<typeof _2npmConfig>;

export function getProjectConfig() {}

const fakePackage = {
	"2npm": {
		binary: {
			url: "http://example.com",
			name: "example",
		},
	} satisfies _2npmConfig,
};
