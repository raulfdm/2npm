import { getProjectConfig } from "./config";
import {
	createFolder,
	deleteFolder,
	downloadFile,
	moveFile,
	untarFile,
} from "@2npm/utils";

await install();

async function install() {
	console.log("Installing binary...");

	const projectConfig = getProjectConfig();

	console.log(projectConfig);

	createFolder(projectConfig.absoluteDistPath);
	createFolder(projectConfig.temp.folder);

	try {
		await downloadFile(projectConfig.metadata.url, projectConfig.temp.filePath);
		console.log("Binary downloaded successfully");
		await untarFile(projectConfig.temp.filePath, projectConfig.temp.folder);
		moveFile(
			`${projectConfig.temp.folder}/${projectConfig.metadata.binaryName}`,
			`${projectConfig.absoluteDistPath}/${projectConfig.metadata.binaryName}`,
		);
		console.log("Binary installed successfully");
		deleteFolder(projectConfig.temp.folder);
	} catch (error) {
		console.error(`Error downloading binary: ${error}`);
		process.exit(1);
	}
}
