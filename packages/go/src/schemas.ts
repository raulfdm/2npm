// Mapping from Node's `process.arch` to Golang's `$GOARCH`
export const supportedArches = ["ia32", "x64", "arm", "arm64"] as const;

export type SupportedArchs = (typeof supportedArches)[number];

export const ARCH_MAPPING: Record<SupportedArchs, string> = {
	ia32: "386",
	x64: "amd64",
	arm: "arm",
	arm64: "arm64",
} as const;

// Mapping between Node's `process.platform` to Golang's
export const supportedPlatforms = [
	"darwin",
	"linux",
	"win32",
	"freebsd",
] as const;
export type SupportedPlatforms = (typeof supportedPlatforms)[number];

export const PLATFORM_MAPPING: Record<SupportedPlatforms, string> = {
	darwin: "darwin",
	linux: "linux",
	win32: "windows",
	freebsd: "freebsd",
} as const;
