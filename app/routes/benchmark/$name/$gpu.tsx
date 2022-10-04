import { LoaderFunction } from "@remix-run/cloudflare";
import { Parser } from "xml2js";
import { S3ObjectList } from "~/types/s3";
import { useLoaderData } from "@remix-run/react";
import ReviewSection from "~/modules/components/section";
import ReactSearchBox from "react-search-box";
import ReviewWarning from "~/modules/components/warning";
import React from "react";
import fm from "front-matter";
import { GameAttributes, GPUAttributes } from "~/types/attributes";
import Markdown from "markdown-to-jsx";
import { mdConfig } from "~/modules/components/markdown";

export const loader: LoaderFunction = async ({ params }) => {

	console.log(params)

	let prefix = `benchmarks/${params.name}/gpu`

	let parser = new Parser()

	let objects = await (await fetch( `https://s3.eu-west-3.amazonaws.com/exerra-igpu-benchmark?list-type=2&delimiter=/&prefix=${prefix}/&max-keys=500` )).text()
	let md = await (await fetch(`https://s3.eu-west-3.amazonaws.com/exerra-igpu-benchmark/${prefix}/${params.gpu}/benchmark.md`)).text()
	let gpuAttributes = await (await fetch(`https://s3.eu-west-3.amazonaws.com/exerra-igpu-benchmark/${prefix}/${params.gpu}/attributes.json`)).json<GPUAttributes>()
	let gameAttributes = await (await fetch(`https://s3.eu-west-3.amazonaws.com/exerra-igpu-benchmark/${`benchmarks/${params.name}`}/attributes.json`)).json<GameAttributes>()

	let data: S3ObjectList = await parser.parseStringPromise( objects )


	//data.ListBucketResult.Contents = data.ListBucketResult.Contents.filter( d => d.Key[0] != data.ListBucketResult.Prefix[0] )

	return { data, prefix: prefix, game: params.name, gpu: params.gpu, benchmark: fm(md).body, gpuAttributes, gameAttributes }
}

export default () => {
	let { data, prefix, game, gpu, benchmark, gpuAttributes, gameAttributes } = useLoaderData<{ data: S3ObjectList, prefix: string, game: string, gpu: string, benchmark: string, gpuAttributes: GPUAttributes, gameAttributes: GameAttributes }>()

	let gpus: { key: string, value: string }[] = []

	data.ListBucketResult.CommonPrefixes.forEach(k => {
		let gpu1 = k.Prefix[0].replace(prefix, "").replace("/", "")

		gpus.push({
			key: gpu1,
			value: gpu1
		})
	})

	let playableStatus = {
		icon: "",
		text: "",
		colour: "",
		bg: ""
	}

	switch (gpuAttributes.playableStatus) {
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

	return (
		<div>
			<div className={"flex flex-wrap gap-6 mt-10"}>
				{gameAttributes.warning == null ? <></> :
					<ReviewWarning>{gameAttributes.warning}</ReviewWarning>
				}

				<div className={`w-full basis-1/1 ${gameAttributes.warning == null ? "" : "lg:basis-1/3"} p-10 rounded-2xl ${playableStatus.bg} flex justify-between items-center grow 2xl:grow-0`}>
					{/*<h2 className="text-xl font-bold text-gray-800 mb-3">How well it runs</h2>*/}
					<p className={`${playableStatus.colour} text-3xl md:text-4xl font-bold`}>{playableStatus.text}</p>
					<div className={"inline max-w-xl bg-white p-5 md:p-5 rounded-2xl shadow-2xl aspect-square"}>
						<p className={`text-4xl md:text-5xl ${playableStatus.colour}`}><i className={playableStatus.icon}></i></p>
					</div>
				</div>
			</div>

			<ReviewSection title={"Benchmark"}>
				<div>
					<ReactSearchBox placeholder={"Select a GPU"} data={gpus} onSelect={(record) => {
						console.log(record)
						window.location.href = `/benchmark/${game}/${record.item.value}`
					}} onChange={() => {}} />

					<div className={"p-10 shadow-2xl rounded-2xl bg-cover mt-5"}>
						<Markdown options={mdConfig}>{benchmark}</Markdown>
					</div>
				</div>
			</ReviewSection>
		</div>
	)
}