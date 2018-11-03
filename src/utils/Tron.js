export function getTronExplorer() {
    return window.tronWeb.eventServer.indexOf("shasta") > 0 ? "https://explorer.shasta.trongrid.io" : "https://tronscan.org/#";
}
