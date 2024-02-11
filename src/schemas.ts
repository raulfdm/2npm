import { z } from "zod";

// Mapping from Node's `process.arch` to Golang's `$GOARCH`
const supportedArches = ["ia32", "x64", "arm", "arm64"] as const;

export const SupportedArchs = z.enum(supportedArches);
export type SupportedArchs = z.infer<typeof SupportedArchs>;

export const ARCH_MAPPING: Record<SupportedArchs, string> = {
  ia32: "386",
  x64: "amd64",
  arm: "arm",
  arm64: "arm64",
} as const;

// Mapping between Node's `process.platform` to Golang's
const supportedPlatforms = ["darwin", "linux", "win32", "freebsd"] as const;

export const SupportedPlatforms = z.enum(supportedPlatforms);
export type SupportedPlatforms = z.infer<typeof SupportedPlatforms>;

export const PLATFORM_MAPPING: Record<SupportedPlatforms, string> = {
  darwin: "darwin",
  linux: "linux",
  win32: "windows",
  freebsd: "freebsd",
} as const;

export const PackageJson = z.object({
  version: z.string(),
  goBinary: z.object({
    name: z.string(),
    path: z.string(),
    url: z.string(),
  }),
});
export type PackageJson = z.infer<typeof PackageJson>;
