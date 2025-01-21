import { Command } from "commander";

export function helloCommand(): Command {
  const command = new Command("hello");

  command
    .description("Prints a hello message")
    .option("-n, --name <name>", "Name to greet", "World")
    .action((options) => {
      console.log(`Hello, ${options.name}!`);
    });

  return command;
}

