import { fromZodError } from "zod-validation-error";
import {
  ARCH_MAPPING,
  PLATFORM_MAPPING,
  PackageJson,
  SupportedArchs,
  SupportedPlatforms,
} from "./schemas";
import { getPackagesSync } from "@manypkg/get-packages";
import path from "node:path";

export function getProjectConfig() {
  const arch = getArch();
  const platform = getPlatform();
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

function getArch() {
  const isSupportedArch = SupportedArchs.safeParse(process.arch);

  if (!isSupportedArch.success) {
    throw new Error(`Unsupported architecture: ${process.arch}`);
  }

  return isSupportedArch.data;
}

function getPlatform() {
  const isSupportedPlatform = SupportedPlatforms.safeParse(process.platform);

  if (!isSupportedPlatform.success) {
    throw new Error(`Unsupported platform: ${process.platform}`);
  }

  return isSupportedPlatform.data;
}

function readPackageJson(): PackageJson & {
  rootDir: string;
} {
  const { rootPackage, rootDir } = getPackagesSync(process.cwd());

  const packageJsonResult = PackageJson.safeParse(rootPackage?.packageJson);

  if (!packageJsonResult.success) {
    console.error(
      "[PACKAGE_JSON_PARSING]",
      fromZodError(packageJsonResult.error).message
    );

    process.exit(1);
  }

  return {
    ...packageJsonResult.data,
    rootDir,
  };
}

function getMetadata(
  { goBinary, version }: PackageJson,
  platform: SupportedPlatforms,
  arch: SupportedArchs
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
