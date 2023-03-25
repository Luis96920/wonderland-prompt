import esbuild from "esbuild";
import minimist from "minimist";
import chalk from "chalk";
import { spawn } from "child_process";

const args = minimist(process.argv.slice(2));

let server;

esbuild
	.build({
		entryPoints: ["./src/main.ts"],
		outfile: ".build/main.cjs",
		bundle: true,
		platform: "node",
		format: "cjs",
		watch: args["watchbuild"]
			? {
					onRebuild(error, result) {
						if (error) console.error(chalk.red("error   :", error));
						else console.log(chalk.green("success :"), "built and bundled main.ts");

						if (args["watchstart"]) {
							runProcess();
						}
					}
			  }
			: undefined
	})
	.then(() => {
		console.log(chalk.green("success :"), "built and bundled main.ts");
		runProcess();
	});

function runProcess() {
	if (server) server.kill();

	server = spawn("node", ["./.build/main.cjs"]);
	console.log(chalk.blue("started..."));

	server.stdout.on("data", (data) => {
		console.log(data.toString());
	});
}