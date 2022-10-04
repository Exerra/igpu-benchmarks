import { LoaderFunction } from "@remix-run/cloudflare";
import { Link, useLoaderData } from "@remix-run/react";
import Markdown from "markdown-to-jsx";
import fm from "front-matter"
import React from "react";
import { mdConfig } from "~/modules/components/markdown";
import Zoom from "react-medium-image-zoom"
import ReviewWarning from "~/modules/components/warning";
import ReviewSection from "~/modules/components/section";

interface Review {
	attributes: {
		title: string,
		platform: ("Steam" | "Xbox" | "Epic" | "EA" | "Uplay")[],
		icon: string,
		playableStatus: "runs-great" | "playable" | "unplayable",
		appid?: string,
		warning?: string,
		screenshots: string[]
	},
	body: string,
	bodyBegin: number,
	frontmatter: string
}

interface Attributes {
	title: string,
	icon: string,
	playableStatus: "runs-great" | "playable" | "unplayable",
	platforms: {
		tested: ("Steam" | "Xbox" | "Epic" | "EA" | "Uplay")[],
		appid: number
	},
	screenshots: string[]
}

export const loader: LoaderFunction = async ({ params }) => {

	let prefix = "reviews"

	let md = await (await fetch( `https://s3.eu-west-3.amazonaws.com/exerra-igpu-benchmark/${prefix}/${params.name}.md` )).text()

	let attributes = await (await fetch(`https://s3.eu-west-3.amazonaws.com/exerra-igpu-benchmark/${prefix}/${params.name}/attributes.json`)).json()

	console.log(attributes)

	return fm(md)
}

export default function Index() {
	let data: Review = useLoaderData()

	let playableStatus = {
		icon: "",
		text: "",
		colour: "",
		bg: ""
	}

	switch (data.attributes.playableStatus) {
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
			<div className={"mx-3 mb-5 md:mt-5"}>
				<nav className="border-gray-200 px-2 sm:px-4 py-2.5 rounded">
					<div className="container flex flex-wrap justify-between items-center mx-auto">
						<Link to="/" className="flex items-center">
							<span
								className="self-center text-xl font-semibold whitespace-nowrap">Exerra Benchmarks</span>
						</Link>
					</div>
				</nav>
			</div>

			<div className={"md:container md:justify-between items-center mx-3 md:mx-auto md:w-full"}>
				<div className={"bg-gray-200 p-10 rounded-2xl bg-center bg-cover lg:flex lg:justify-between items-center"} style={{ backgroundImage: 'url("https://cdn.exerra.xyz/svg/iridescent/bg-iridescent-rightside.svg")' }}>
					<div>
						<h1 className={"text-5xl font-bold md:text-7xl"}>{data.attributes.title}</h1><br />
						<p className={"text-lg"}>Integrated GPU benchmarks for <b>{data.attributes.title}</b></p>
					</div>
					<div className={"hidden lg:inline max-w-xl bg-white p-5 mt-5 lg:mt-0 md:p-5 rounded-2xl shadow-2xl aspect-square"}>
						<div className={"aspect-square bg-center bg-cover rounded-xl p-10"} style={{ backgroundImage: `url("${data.attributes.icon}")` }} />
					</div>
				</div>

				<div className={"flex flex-wrap gap-6 mt-10"}>
					{data.attributes.warning == null ? <></> :
						<ReviewWarning>{data.attributes.warning}</ReviewWarning>
					}

					<div className={`w-full basis-1/1 lg:basis-1/3 p-10 rounded-2xl ${playableStatus.bg} flex justify-between items-center grow 2xl:grow-0`}>
						{/*<h2 className="text-xl font-bold text-gray-800 mb-3">How well it runs</h2>*/}
						<p className={`${playableStatus.colour} text-3xl md:text-4xl font-bold`}>{playableStatus.text}</p>
						<div className={"inline max-w-xl bg-white p-5 md:p-5 rounded-2xl shadow-2xl aspect-square"}>
							<p className={`text-4xl md:text-5xl ${playableStatus.colour}`}><i className={playableStatus.icon}></i></p>
						</div>
					</div>
				</div>

				<main className={""} style={{ lineHeight: "2" }}>

					<ReviewSection title={"Review"}>
						<div className={"p-10 shadow-2xl rounded-2xl bg-cover"}>
							<Markdown options={mdConfig}>{data.body}</Markdown>
						</div>
					</ReviewSection>

					<ReviewSection title={"Screenshots"}>
						<div className={"p-10 shadow-2xl rounded-2xl flex flex-wrap gap-6 justify-center"}>
							{data.attributes.screenshots.map(screenshot => (
								<Zoom><div key={`loaded ${screenshot}`} style={{ /*width: "24rem",*/ aspectRatio: "auto 16 / 9", backgroundImage: `url('${screenshot}')` }} className={"w-80 md:w-96 shadow-2xl rounded-lg overflow-hidden bg-cover basis-1/3"} /></Zoom>
							))}
						</div>
					</ReviewSection>

					{data.attributes.appid == null ? <></> :
						<ReviewSection title={"Buy the game"}>
							<div className={"gap-6 justify-center rounded-2xl"}>
								<iframe src={`https://store.steampowered.com/widget/${data.attributes.appid}/`} frameBorder="0" height={"190"} style={{ border: "0", boxShadow: "none" }} className={"w-full"}></iframe>
							</div>
						</ReviewSection>
					}
				</main>
			</div>
		</div>
	);
}

/*
<Zoom><div key={`loaded ${screenshot.id}`} style={{ width: "24rem", aspectRatio: "auto 16 / 9", backgroundImage: `url('${screenshot.image}')` }} className={"max-w-sm shadow-2xl rounded-lg overflow-hidden bg-cover"} /></Zoom>
 */
