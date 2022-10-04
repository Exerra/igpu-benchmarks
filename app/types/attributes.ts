export interface GameAttributes {
	title: string,
	icon: string,
	playableStatus: "runs-great" | "playable" | "unplayable",
	platforms: {
		tested: ("Steam" | "Xbox" | "Epic" | "EA" | "Uplay")[],
		appid: number
	},
	warning?: string,
	screenshots: string[],
	minimumRequirements: {
		os: string,
		cpu: string,
		ram: string,
		vram?: string,
		gpu: string,
		directx: string
	}
}

export interface GPUAttributes {
	playableStatus: "runs-great" | "playable" | "unplayable",
	screenshots: string[]
}