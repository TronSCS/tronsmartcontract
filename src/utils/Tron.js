export function getTronExplorer() {
    return window.tronWeb.eventServer.host.indexOf("shasta") > 0 ? "https://explorer.shasta.trongrid.io" : "https://tronscan.org/#";
}
