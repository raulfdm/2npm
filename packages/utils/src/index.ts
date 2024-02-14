import fs from "node:fs";
import { pipeline } from "node:stream";
import { promisify } from "node:util";
import tar from "tar";

const pipelinePromise = promisify(pipeline);

export function createFolder(folderPath: string) {
	if (!fs.existsSync(folderPath)) {
		fs.mkdirSync(folderPath, { recursive: true });
	}
}

export function deleteFolder(folderPath: string) {
	if (fs.existsSync(folderPath)) {
		fs.rmSync(folderPath, { recursive: true });
	}
}

export function moveFile(srcPath: string, destPath: string) {
	fs.renameSync(srcPath, destPath);
}

export async function downloadFile(url: string, outputPath: string) {
	const response = await fetch(url);

	if (!response.ok) {
		throw new Error(
			`Server responded with ${response.status}: ${response.statusText}`,
		);
	}

	const fileStream = fs.createWriteStream(outputPath);

	if (!response.body) {
		throw new Error("Server did not send a response body");
	}

	return pipelinePromise(response.body, fileStream);
}

export function untarFile(tarPath: string, destPath: string) {
	return tar.x({
		file: tarPath,
		cwd: destPath,
	});
}
