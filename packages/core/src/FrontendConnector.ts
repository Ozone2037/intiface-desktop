import { EventEmitter } from "events";
import { IntifaceProtocols } from "intiface-protocols";
import { IntifaceConfigurationEventManager } from "./IntifaceConfigurationEventManager";
import { IntifaceConfiguration } from "./IntifaceConfiguration";

// Sends messages from the frontend/GUI to the backend/server process.
export abstract class FrontendConnector extends EventEmitter {

  public get Config(): IntifaceConfiguration | null {
    if (this._config === null) {
      return null;
    }
    // This can be null up until we receive a configuration from the parent process.
    return this._config!.Config;
  }

  private _config: IntifaceConfigurationEventManager | null = null;

  protected constructor() {
    super();
  }

  public SendMessage(aMsg: IntifaceProtocols.ServerFrontendMessage) {
    this.SendMessageInternal(Buffer.from(IntifaceProtocols.ServerFrontendMessage.encode(aMsg).finish()));
  }

  protected abstract SendMessageInternal(aRawMsg: Buffer): void;

  protected Ready() {
    const readyMsg = IntifaceProtocols.ServerFrontendMessage.create({
      ready: IntifaceProtocols.ServerFrontendMessage.Ready.create(),
    });
    this.SendMessage(readyMsg);
  }

  protected EmitServerMessage(aMsg: IntifaceProtocols.ServerBackendMessage) {
    this.emit("message", aMsg);
  }

  protected ProcessMessage(aMsg: IntifaceProtocols.ServerBackendMessage) {
    if (aMsg.configuration !== null) {
      // If we've gotten a configuration message from the backend, that means
      // the config file was loaded and we need to overwrite our current state
      // with that.
      this._config = new IntifaceConfigurationEventManager(JSON.parse(aMsg.configuration!.configuration!));
      // Any time the configuration is saved, throw it at the backend so we can
      // update settings and save the file.
      this._config.addListener("configsaved", (aConfig: string) => {
        const configMsg = IntifaceProtocols.ServerFrontendMessage.create({
          updateconfig: IntifaceProtocols.ServerFrontendMessage.UpdateConfig.create({ configuration: aConfig }),
        });
        this.SendMessage(configMsg);
      });
    }
    // Always emit after we're done, just in case extra things need to be done otherwise.
    this.EmitServerMessage(aMsg);
  }
}
