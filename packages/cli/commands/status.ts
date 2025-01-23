import { bold } from "cli-color";
import { Command } from "commander";
import { checkConnection } from "../utils/checkConnection";
import { exec } from "child_process";

export function status(): Command {
  const command = new Command("status");

  command
    .description("Get healthcheck endpoint output from production")
    .option("-n, --notify", "Notify the user when the PNC connection has restored")
    .action(async (options) => {
      const endpoint = "https://proxy.bichard7.service.justice.gov.uk/bichard-backend/Connectivity";

      let ok = false;
      try {
        ok = await checkConnection(endpoint);
      } catch (err) {
        console.error(`Failed to connect to ${bold(endpoint)}\nAre you connected to the VPN?`);
      }
      if (!ok) return;

      if (options.notify) {
        const notify = `
          until curl -s ${endpoint} | jq '.pncConnectionHealth' | grep -q '"healthy": true'; do
            echo -n '.';
            sleep 5;
          done
        `;
        exec(notify, (error) => {
          if (error) {
            console.error(`Error during watch: ${error.message}`);
            return;
          }

          const osascriptCommand = `
            osascript -e 'display notification "${new Date().toLocaleTimeString()}" with title "PNC Connection Restored"'
          `;
          exec(osascriptCommand, (osascriptError) => {
            if (osascriptError) {
              console.error(`osascript failed: ${osascriptError.message}`);
            }
          });
        });
        return;
      } else {
        const curlCommand = `curl -s ${endpoint} | jq '.pncConnectionHealth'`;
        exec(curlCommand, (error, stdout) => {
          if (error) {
            console.error(`Error fetching endpoint status: ${error.message}`);
          } else {
            console.log(stdout);
          }
        });
      }

    });

  return command;
}

