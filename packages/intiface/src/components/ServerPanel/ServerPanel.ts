import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { IntifaceConfiguration, FrontendConnector } from "intiface-core-library";

@Component({})
export default class ServerPanel extends Vue {

  @Prop()
  private config!: IntifaceConfiguration;

  @Prop()
  private connector!: FrontendConnector;
  private serverStates: string[] = ["Start Server", "Stop Server"];

  private get serverRunning() {
    return this.connector.IsServerProcessRunning;
  }

  private async ToggleServer() {
    try {
      if (!this.connector.IsServerProcessRunning) {
        await this.connector.StartProcess();
      } else {
        await this.connector.StopProcess();
      }
    } catch (e) {
      this.$emit("error", e);
    }
  }

  // TODO Pipe name validator

  // TODO Websocket address validator
}