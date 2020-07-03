import { resolve } from "path";
import { window, QuickPickOptions, QuickPickItem } from "vscode";

import { ConfigurationManager } from "../common/configuration-manager";
import { EnvironmentController } from "./environment-controller";
import { matchOutputFiles } from "@Cli/common/dbobject";
import { WorkspaceConfig } from "@Cli/common/config";

const { workspaceConfigFile } = ConfigurationManager.getInstance();

export class FileController {
  private _workspacePath: string;
  private _environmentController: EnvironmentController;

  constructor(workspacePath: string, environmentController: EnvironmentController) {
    this._workspacePath = workspacePath;
    this._environmentController = environmentController;
  }

  public pickPackageScript = async (): Promise<string | null> => {
    // It doesn't reload if a field changes, so here...
    const config = new WorkspaceConfig(workspaceConfigFile);
    const env = this._environmentController.currentPick;
    const output = config.get({ field: "package.output", env });

    const files = matchOutputFiles(output, {
      cwd: this._workspacePath,
    });

    let items: QuickPickItem[] = files.map((file) => ({
      label: file,
      description: resolve(this._workspacePath, file),
    }));

    if (items.length === 0) {
      window.showWarningMessage(`Oradew: Cannot match any packaged file.`);
      return null;
    }

    const options: QuickPickOptions = {
      placeHolder: `Select script file to run (${this._environmentController.currentPick} environment)`,
      matchOnDescription: true,
      matchOnDetail: true,
    };
    return window.showQuickPick(items, options).then((item) => (item ? item.label : null));
  };
}