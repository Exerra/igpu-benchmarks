import { S3ObjectList } from "~/types/s3";

export const gpuSearchFilter = (data: S3ObjectList, prefix: string): { key: string, value: string }[] => {
	let gpus: { key: string, value: string }[] = []

	data.ListBucketResult.CommonPrefixes.forEach(k => {
		let gpu = k.Prefix[0].replace(prefix, "").replaceAll("/", "")

		gpus.push({
			key: gpu,
			value: gpu
		})
	})

	return gpus
}

export const gpuPlayableParse = (status: "runs-great" | "playable" | "unplayable"): { icon: string, text: string, colour: string, bg: string } => {
	let playableStatus = {
		icon: "",
		text: "",
		colour: "",
		bg: ""
	}

	switch (status) {
		case "runs-great":
			playableStatus.icon = "fa-solid fa-circle-check"
			playableStatus.text = "Runs great!"
			playableStatus.colour = "text-green-500"
			playableStatus.bg = "bg-green-100/50"
			break;
		case "playable":
			playableStatus.icon = "fa-solid fa-face-meh"
			playableStatus.text = "Playable"
			playableStatus.colour = "text-orange-400"
			playableStatus.bg = "bg-orange-100/50"
			break;
		case "unplayable":
			playableStatus.icon = "fa-solid fa-circle-xmark"
			playableStatus.text = "Unplayable"
			playableStatus.colour = "text-red-400"
			playableStatus.bg = "bg-red-100/50"
	}

	return playableStatus
}