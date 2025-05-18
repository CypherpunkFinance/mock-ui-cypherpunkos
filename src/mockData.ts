export interface AppDefinition {
  id: string;
  name: string;
  subName?: string;
  icon: string;
  mainCategory: 'Chain' | 'App' | 'Theme';
  category: string;
  description: string;
  long_description: string;
  version: string;
  developer: string;
  installed: boolean;
  running: boolean;
  path?: string;
  isNode?: boolean;
  isCore?: boolean;
  hasError?: boolean;
  gallery?: string[];
  dependencies_display?: string[];
  supported_networks_display?: string[];
  activeNetwork?: string;
  port?: string;
  repo?: string;
  website?: string;
  support?: string;
  sourceType?: 'plugin' | 'external';
  rpcUrl?: string;
  pluginForChainId?: string;
}

export interface ChainDefinition {
  id: string;
  name: string;
  layer: 'L1' | 'L2' | 'L3';
  description: string;
  icon: string;
  nativePluginId?: string;
  supportsLocalNode: boolean;
  defaultExternalRpcPlaceholder?: string;
  blockExplorerUrl?: string;
}

export const ALL_AVAILABLE_CHAINS: ChainDefinition[] = [
  { 
    id: "ethereum", name: "Ethereum", layer: 'L1', 
    description: "The foundational smart contract platform.", 
    icon: "ri-bitделитель-coin-line", nativePluginId: "nodeset", supportsLocalNode: true,
    defaultExternalRpcPlaceholder: "https://mainnet.infura.io/v3/YOUR_KEY",
    blockExplorerUrl: "https://etherscan.io"
  },
  { 
    id: "base", name: "Base", layer: 'L2', 
    description: "A secure, low-cost, builder-friendly Ethereum L2 built by Coinbase.", 
    icon: "ri-stack-line", nativePluginId: "l2-base-plugin", supportsLocalNode: true,
    defaultExternalRpcPlaceholder: "https://mainnet.base.org",
    blockExplorerUrl: "https://basescan.org"
  },
  { 
    id: "arbitrum", name: "Arbitrum One", layer: 'L2', 
    description: "A leading Ethereum L2 scaling solution with a rich DeFi ecosystem.", 
    icon: "ri-stack-line", nativePluginId: "l2-arbitrum-plugin", supportsLocalNode: true,
    defaultExternalRpcPlaceholder: "https://arb1.arbitrum.io/rpc",
    blockExplorerUrl: "https://arbiscan.io"
  },
  { 
    id: "optimism", name: "Optimism", layer: 'L2', 
    description: "An Ethereum L2 scaling solution based on Optimistic Rollups.", 
    icon: "ri-stack-line", supportsLocalNode: false,
    defaultExternalRpcPlaceholder: "https://mainnet.optimism.io",
    blockExplorerUrl: "https://optimistic.etherscan.io"
  },
  { 
    id: "starknet", name: "Starknet", layer: 'L2', 
    description: "A Validity-Rollup (ZK-Rollup) Layer 2 network that operates on top of Ethereum.",
    icon: "ri-stack-line", supportsLocalNode: false,
    defaultExternalRpcPlaceholder: "https://starknet-mainnet.public.blastapi.io",
    blockExplorerUrl: "https://starkscan.co"
  },
  { 
    id: "zksync_era", name: "zkSync Era", layer: 'L2', 
    description: "A ZK-Rollup scaling solution for Ethereum, EVM-compatible.",
    icon: "ri-stack-line", supportsLocalNode: false,
    defaultExternalRpcPlaceholder: "https://mainnet.era.zksync.io",
    blockExplorerUrl: "https://explorer.zksync.io"
  },
  { 
    id: "worldchain", name: "Worldchain", layer: 'L2',
    description: "An upcoming L2 aiming for permissionless, decentralized identity and finance.",
    icon: "ri-earth-line", supportsLocalNode: false,
    defaultExternalRpcPlaceholder: "N/A (Not Launched)",
    blockExplorerUrl: ""
  },
  { 
    id: "linea", name: "Linea", layer: 'L2', 
    description: "A developer-ready zkEVM rollup for scaling Ethereum dapps.",
    icon: "ri-stack-line", supportsLocalNode: false,
    defaultExternalRpcPlaceholder: "https://rpc.linea.build",
    blockExplorerUrl: "https://lineascan.build"
  },
  { 
    id: "taiko", name: "Taiko", layer: 'L2',
    description: "A decentralized, Ethereum-equivalent ZK-Rollup.",
    icon: "ri-stack-line", supportsLocalNode: false,
    defaultExternalRpcPlaceholder: "https://rpc.mainnet.taiko.xyz",
    blockExplorerUrl: "https://taikoscan.io"
  },
  { 
    id: "blast", name: "Blast", layer: 'L2', 
    description: "An EVM-compatible L2 with native yield for ETH and stablecoins.",
    icon: "ri-rocket-line", supportsLocalNode: false,
    defaultExternalRpcPlaceholder: "https://rpc.blast.io",
    blockExplorerUrl: "https://blastscan.io"
  },
  { 
    id: "unichain", name: "Unichain", layer: 'L2',
    description: "A blockchain platform (details to be specified).",
    icon: "ri-link-m", supportsLocalNode: false,
    defaultExternalRpcPlaceholder: "Please provide RPC URL",
    blockExplorerUrl: ""
  },
  { 
    id: "ink", name: "Ink! Testnet (Shibuya)", layer: 'L2',
    description: "An environment for WASM smart contracts via ink! on Polkadot (Shibuya testnet example).",
    icon: "ri-drop-line", supportsLocalNode: false,
    defaultExternalRpcPlaceholder: "wss://shibuya-rpc.dwellir.com",
    blockExplorerUrl: "https://shibuya.subscan.io"
  },
  { 
    id: "abstract", name: "Abstract", layer: 'L2',
    description: "A blockchain platform (details to be specified).",
    icon: "ri-link-m", supportsLocalNode: false,
    defaultExternalRpcPlaceholder: "Please provide RPC URL",
    blockExplorerUrl: ""
  },
];

export const appStoreMockData: AppDefinition[] = [
    {
        id: "nodeset",
        name: "Ethereum",
        subName: "L1 Node",
        icon: "ri-server-fill",
        mainCategory: "Chain",
        category: "L1 Node",
        description: "Local Ethereum L1 node (Execution + Consensus).",
        long_description: "Nodeset is the core application for running and managing your local Ethereum L1 node. It includes both an execution client (like Geth) and a consensus client (like Lighthouse) to keep you fully synced and participating in the Ethereum network. Nodeset provides the foundational RPC endpoint that many other L2 node plugins and DeFi applications will rely on if you choose local hosting.",
        version: "1.2.3",
        developer: "CypherpunkOS Core",
        installed: true,
        running: true,
        path: "nodes",
        isNode: true,
        sourceType: "plugin",
        pluginForChainId: "ethereum",
        gallery: ["img/mock/nodeset_1.png", "img/mock/nodeset_2.png"],
        dependencies_display: ["Sufficient Disk Space (approx 2TB for Mainnet)", "Stable Internet Connection"],
        supported_networks_display: ["Ethereum L1"],
        activeNetwork: "Ethereum L1 (Local)",
        port: "8545"
    },
    {
        id: "l2-base-plugin",
        name: "Base",
        subName: "L2 Node",
        icon: "ri-stack-line",
        mainCategory: "Chain",
        category: "L2 Node",
        description: "Local Base L2 node plugin.",
        long_description: "Install this plugin to run your own Base Layer 2 node. This allows your other Cypherpunk Apps to interact directly with the Base network through a local RPC endpoint, enhancing privacy and control. Requires an L1 Ethereum RPC provider (either local Nodeset or an external one configured in settings).",
        version: "0.5.1",
        developer: "CypherpunkOS Community",
        installed: true,
        running: true,
        path: "nodes",
        isNode: true,
        sourceType: "plugin",
        pluginForChainId: "base",
        gallery: ["img/mock/l2_node_1.png"],
        dependencies_display: ["Configured L1 Ethereum RPC"],
        supported_networks_display: ["Base Mainnet"],
        activeNetwork: "Base Mainnet (Local)",
        port: "8546"
    },
    {
        id: "l2-arbitrum-plugin",
        name: "Arbitrum One",
        subName: "L2 Node",
        icon: "ri-stack-line",
        mainCategory: "Chain",
        category: "L2 Node",
        description: "Local Arbitrum One L2 node plugin.",
        long_description: "Install this plugin to run your own Arbitrum One Layer 2 node. This enables local RPC access for your apps on the Arbitrum network. Requires an L1 Ethereum RPC provider.",
        version: "0.8.2",
        developer: "CypherpunkOS Community",
        installed: false,
        running: false,
        path: "nodes",
        isNode: true,
        sourceType: "plugin",
        pluginForChainId: "arbitrum",
        gallery: ["img/mock/l2_node_1.png"],
        dependencies_display: ["Configured L1 Ethereum RPC"],
        supported_networks_display: ["Arbitrum One"],
        activeNetwork: "N/A"
    },
    {
        id: "external-eth-l1-infura-connector",
        name: "Infura Ethereum L1 Connector",
        icon: "ri-cloud-line",
        mainCategory: "App",
        category: "External RPC",
        description: "Pre-configured connection to Infura for Ethereum Mainnet.",
        long_description: "Adds Infura as an option for your Ethereum L1 connection. Requires your own Infura API key. This doesn't install a node, but configures CypherpunkOS to use Infura.",
        version: "N/A",
        developer: "Infura / CypherpunkOS",
        installed: false,
        running: false,
        isNode: false,
        sourceType: "external",
        rpcUrl: "https://mainnet.infura.io/v3/YOUR_API_KEY_HERE",
        supported_networks_display: ["Ethereum L1"],
    },
    {
        id: "external-arb-l2-custom",
        name: "Arbitrum One",
        subName: "L2 Node",
        icon: "ri-cloud-line",
        mainCategory: "Chain",
        category: "L2 Node",
        description: "External Custom RPC for Arbitrum One.",
        long_description: "Connects to a user-provided custom RPC endpoint for Arbitrum One. Useful if you have your own dedicated Arbitrum node elsewhere or use a specific provider.",
        version: "N/A",
        developer: "User Configured",
        installed: true,
        running: false,
        hasError: true,
        isNode: true,
        sourceType: "external",
        rpcUrl: "my-arb-provider.com",
        pluginForChainId: "arbitrum",
        gallery: [],
        dependencies_display: ["Internet Connection", "Valid RPC URL"],
        supported_networks_display: ["Arbitrum One"],
        activeNetwork: "Arbitrum One (External RPC - Error)"
    },
    {
        id: "uniswap-interface",
        name: "Uniswap",
        subName: "Interface",
        icon: "ri-swap-box-fill",
        mainCategory: "App",
        category: "DeFi / DEX",
        description: "Self-hosted interface for Uniswap, supporting L1 and various L2s.",
        long_description: "Access the Uniswap decentralized exchange through this self-hosted frontend. Swap tokens and manage liquidity on Ethereum Mainnet or supported L2 networks like Base and Arbitrum One. This app will use the RPC endpoints configured in your CypherpunkOS settings for the selected network.",
        version: "1.0.1",
        developer: "Adapted by CypherpunkOS",
        installed: true,
        running: true,
        path: "installed-apps",
        gallery: ["img/mock/uniswap_1.png", "img/mock/uniswap_2.png"],
        dependencies_display: ["Configured RPC for desired network (L1 or L2)"],
        supported_networks_display: ["Ethereum L1", "Base Mainnet", "Arbitrum One"],
        activeNetwork: "Base Mainnet (External RPC)",
        isNode: false,
    },
    {
        id: "aave-interface",
        name: "Aave",
        subName: "Interface",
        icon: "ri-bank-fill",
        mainCategory: "App",
        category: "DeFi / Lending",
        description: "Self-hosted interface for Aave, supporting L1 and L2s.",
        long_description: "Lend and borrow assets using the Aave protocol through this self-hosted interface. Supports Ethereum Mainnet and various L2 networks. Connects via your configured RPC endpoints in CypherpunkOS.",
        version: "1.0.0",
        developer: "Adapted by CypherpunkOS",
        installed: false,
        running: false,
        path: "installed-apps",
        gallery: ["img/mock/aave_1.png"],
        dependencies_display: ["Configured RPC for desired network (L1 or L2)"],
        supported_networks_display: ["Ethereum L1", "Base Mainnet", "Arbitrum One", "Optimism"],
        activeNetwork: "N/A",
        isNode: false,
    },
    {
        id: "tornado-cash-interface",
        name: "Tornado Cash",
        subName: "Interface",
        icon: "ri-shuffle-line",
        mainCategory: "App",
        category: "Privacy",
        description: "Interact with Tornado Cash contracts for enhanced privacy.",
        long_description: "This plugin provides a self-hosted frontend to interact with Tornado Cash smart contracts on Ethereum Mainnet and supported L2s. Enhance your transaction privacy. Note: Users are responsible for understanding and complying with all applicable laws and regulations.",
        version: "0.2.0",
        developer: "Adapted by CypherpunkOS",
        installed: true,
        running: false, 
        hasError: true,
        path: "installed-apps",
        gallery: ["img/mock/tornado_1.png"],
        dependencies_display: ["Configured RPC for desired network (L1 or L2)", "Secure note management practices by user"],
        supported_networks_display: ["Ethereum L1", "Arbitrum One"],
        activeNetwork: "Ethereum L1 (Local Nodeset)",
        isNode: false,
    },
    {
        id: "cypherpunk-wallet",
        name: "Inbuilt Wallet",
        icon: "ri-wallet-line",
        mainCategory: "App",
        category: "Utility / Wallet",
        description: "Manage your crypto assets locally on L1/L2s.",
        long_description: "The CypherpunkOS Inbuilt Wallet allows you to securely create, import, and manage your crypto assets (ETH and ERC20 tokens) across Ethereum L1 and configured L2 networks. All keys are stored encrypted on your server, and transactions are signed locally.",
        version: "1.0.0",
        developer: "CypherpunkOS Core",
        installed: true,
        running: true,
        isCore: true,
        path: "wallet",
        gallery: ["img/mock/wallet_1.png"],
        dependencies_display: ["CypherpunkOS Core System"],
        supported_networks_display: ["All configured L1/L2 networks"],
        activeNetwork: "Ethereum L1",
        isNode: false,
    },
    {
        id: "theme-cypherpunk-dark",
        name: "Cypherpunk Dark",
        icon: "ri-palette-line",
        mainCategory: "Theme",
        category: "Dark",
        description: "Default dark theme for CypherpunkOS. High contrast neon green on black.",
        long_description: "The signature look of CypherpunkOS. This theme provides a high-contrast, dark interface with neon green accents, optimized for readability and a classic cypherpunk aesthetic.",
        version: "1.0.0",
        developer: "CypherpunkOS Core",
        installed: true,
        running: true,
        isCore: true,
        gallery: ["img/mock/theme_dark_1.png"],
        dependencies_display: [],
        supported_networks_display: [],
        isNode: false,
    },
    {
        id: "theme-solarized-light",
        name: "Solarized Light",
        icon: "ri-sun-line",
        mainCategory: "Theme",
        category: "Light",
        description: "A light theme based on the popular Solarized color palette.",
        long_description: "For those who prefer a lighter interface, this theme implements the Solarized Light color scheme. It aims for balanced contrast and readability in well-lit environments.",
        version: "1.1.0",
        developer: "Community Contributor",
        installed: false,
        running: false,
        gallery: ["img/mock/theme_light_1.png"],
        dependencies_display: [],
        supported_networks_display: [],
        isNode: false,
    }
];

export const mockLogs: Record<string, string> = {
    system: `[INFO] 2024-05-18T10:00:00.000Z CypherpunkOS: System boot completed.\n[INFO] 2024-05-18T10:00:05.000Z CypherpunkOS: Docker service healthy.\n[INFO] 2024-05-18T10:00:10.000Z CypherpunkOS: Loaded 3 L1/L2 node configurations.\n[INFO] 2024-05-18T10:00:15.000Z CypherpunkOS: Loaded 4 application plugins.\n[WARN] 2024-05-18T10:00:20.000Z CypherpunkOS: External RPC for Arbitrum One (my-arb-provider.com) is currently unreachable.`,
    nodeset: `[INFO] 2024-05-18T10:01:00.000Z Nodeset: EL client Geth v1.13.x started successfully.\n[INFO] 2024-05-18T10:01:05.000Z Nodeset: CL client Lighthouse v4.5.x peering with 50 nodes.\n[INFO] 2024-05-18T10:01:10.000Z Nodeset: Slot 7654321, Epoch 23919, Attestations: 120/128\n[WARN] 2024-05-18T10:01:15.000Z Nodeset: Unusual peer disconnection: peer_id_xyz (reason: protocol_error)`,
    "l2-base-plugin": `[INFO] 2024-05-18T10:02:00.000Z L2-Base-Plugin: op-node started. L1 RPC: http://nodeset.internal:8545\n[INFO] 2024-05-18T10:02:05.000Z L2-Base-Plugin: op-geth synced to block 1234567.\n[INFO] 2024-05-18T10:02:10.000Z L2-Base-Plugin: New L2 block processed: #1234568\n[DEBUG] 2024-05-18T10:02:15.000Z L2-Base-Plugin: Sequencer batch submitted to L1.`,
    "l2-arbitrum-plugin": `[INFO] 2024-05-18T10:03:00.000Z L2-Arbitrum-Plugin: Starting Arbitrum node services...\n[WARN] 2024-05-18T10:03:05.000Z L2-Arbitrum-Plugin: Plugin not fully synced with L1 yet. Waiting for L1 connection through Nodeset.`,
    "external-eth-l1-infura-connector": `[INFO] 2024-05-18T10:04:00.000Z InfuraConnector: Connection to mainnet.infura.io/v3/YOUR_KEY established.`,
    "uniswap-interface": `[INFO] 2024-05-18T10:04:00.000Z Uniswap App: Initialized for Base Mainnet.\n[INFO] 2024-05-18T10:04:05.000Z Uniswap App: Using RPC: https://my-base-rpc.com (External User Config)\n[INFO] 2024-05-18T10:04:10.000Z Uniswap App: Using Subgraph: https://api.studio.thegraph.com/query/.../uniswap-v3-base/ (Default)\n[DEBUG] 2024-05-18T10:04:15.000Z Uniswap App: User queried for ETH/USDC pair.`,
    "aave-interface": `[INFO] 2024-05-18T10:05:00.000Z Aave App: Awaiting network selection.\n[WARN] 2024-05-18T10:05:05.000Z Aave App: No active network context. UI functionality may be limited.`,
    "tornado-cash-interface": `[INFO] 2024-05-18T10:06:00.000Z Tornado Cash App: Initialized for Ethereum L1.\n[INFO] 2024-05-18T10:06:05.000Z Tornado Cash App: Using RPC: http://nodeset.internal:8545 (Local Nodeset)\n[ERROR] 2024-05-18T10:06:10.000Z Tornado Cash App: Failed to load proving keys for 1 ETH pool. Please check configuration or network.\n[INFO] 2024-05-18T10:06:15.000Z Tornado Cash App: User generated new note for 0.1 ETH deposit.`,
    "cypherpunk-wallet": `[INFO] 2024-05-18T10:07:00.000Z Wallet: Unlocked with user password.\n[INFO] 2024-05-18T10:07:05.000Z Wallet: Switched to Base Mainnet (External RPC).\n[INFO] 2024-05-18T10:07:10.000Z Wallet: Fetched balances for account 0x123...abc.\n[DEBUG] 2024-05-18T10:07:15.000Z Wallet: Preparing transaction: Send 0.05 ETH to 0x789...def on Base Mainnet.`
};

export function getInstalledApps(allApps: AppDefinition[] = appStoreMockData): AppDefinition[] {
    return allApps.filter(app => app.installed && !app.isNode && !app.isCore && app.mainCategory === 'App');
}

export function getLocalNodePlugins(allApps: AppDefinition[] = appStoreMockData): AppDefinition[] {
    return allApps.filter(app => app.isNode && app.sourceType === 'plugin');
}

export function findNodePlugin(pluginId: string, allPlugins: AppDefinition[] = getLocalNodePlugins()): AppDefinition | undefined {
    return allPlugins.find(p => p.id === pluginId);
}

export function getNodeDisplayName(node: AppDefinition): string {
  if (!node.isNode) return node.name;

  const baseName = `${node.subName?.includes('L1') ? 'L1' : 'L2'} - ${node.name}`;
  
  if (node.id === 'nodeset') {
    return `${baseName} (Nodeset)`;
  }
  if (node.sourceType === 'plugin') {
    return `${baseName} (Local)`;
  }
  if (node.sourceType === 'external') {
    const displayRpc = node.rpcUrl && node.rpcUrl.length > 25 ? node.rpcUrl.substring(0, 22) + '...' : node.rpcUrl;
    return `${baseName} (External RPC: ${displayRpc || 'Unknown URL'})`;
  }
  return baseName;
} 

// --- Global State for Enabled Chains (Mock Implementation) ---
let globallyEnabledChainIds: Set<string> = new Set(['ethereum', 'base', 'arbitrum']); // Default enabled chains

export function getEnabledChainIds(): Set<string> {
  return new Set(globallyEnabledChainIds); // Return a copy to prevent direct modification
}

export function setEnabledChainIds(newlyEnabledIds: Set<string>): void {
  globallyEnabledChainIds = new Set(newlyEnabledIds);
  console.log('Global enabled chains updated:', globallyEnabledChainIds);
  // In a real app, this would likely involve API calls, localStorage, or a state management library.
}

// Not strictly needed if setEnabledChainIds replaces the whole set, but useful for individual toggles if ever.
// export function toggleChainEnabled(chainId: string): void {
//   if (globallyEnabledChainIds.has(chainId)) {
//     globallyEnabledChainIds.delete(chainId);
//   } else {
//     globallyEnabledChainIds.add(chainId);
//   }
// }

export function isChainEnabled(chainId: string): boolean {
  return globallyEnabledChainIds.has(chainId);
}

// --- Helper to get all plugins for a specific chain ---
export function getPluginsForChain(chainId: string, allAppDefinitions: AppDefinition[] = appStoreMockData): AppDefinition[] {
  return allAppDefinitions.filter(app => app.sourceType === 'plugin' && app.pluginForChainId === chainId && app.isNode);
} 