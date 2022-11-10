import { InjectedConnector } from "@web3-react/injected-connector";

export const injected = new InjectedConnector({
    supportedChainIds: [
        1, 
        3, 
        4, 
        5, 
        10, 
        42,
        137, 
        31337, 
        42161
    ]
})
