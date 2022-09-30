import { LoaderFunction } from "@remix-run/cloudflare";
import { Parser } from "xml2js"
import { Link, useLoaderData } from "@remix-run/react";
import matter from "gray-matter"
import Markdown from "markdown-to-jsx";
import fm from "front-matter"
import React from "react";

interface Review {
	attributes: {
		title: string,
		platform: "Steam" | "Xbox" | "Epic" | "EA" | "Uplay",
		icon: string
	},
	body: string,
	bodyBegin: number,
	frontmatter: string
}

export const loader: LoaderFunction = async ({ params }) => {

	let prefix = "reviews"

	let md = await (await fetch( `https://s3.eu-west-3.amazonaws.com/exerra-igpu-benchmark/${prefix}/${params.name}.md` )).text()

	return fm(md)
}

class EmptyImg extends React.Component {
	render() {
		return <></>
	}
}

class H1 extends React.Component<any, any> {
	render() {
		return (
			<>
				<h1 className={"text-5xl mt-10 font-bold mb-2"}>{this.props.children}</h1>
			</>
		)
	}
}

class H2 extends React.Component<any, any> {
	render() {
		return (
			<h2 className={"text-4xl font-bold mt-7 text-gray-800"}>{this.props.children}</h2>
		)
	}
}

class H3 extends React.Component<any, any> {
	render() {
		return (
			<h3 className={"text-2xl font-bold mt-7 text-gray-700"}>{this.props.children}</h3>
		)
	}
}

let emptyComponentConf = {
	component: EmptyImg
}

let mdConfig = {
	disableParsingRawHTML: false,
	overrides: {
		script: emptyComponentConf,
		button: emptyComponentConf,
		form: emptyComponentConf,
		input: emptyComponentConf,
		h1: { component: H1 },
		h2: { component: H2 },
		h3: { component: H3 }
	}
}

export default function Index() {
	let data: Review = useLoaderData()

	console.log( data )
	return (
		<div>
			<div className={"mx-3 mb-5"}>
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
						<h1 className={"text-5xl font-bold md:text-7xl"}>{data.attributes.title} ({data.attributes.platform})</h1><br />
						<p className={"text-lg"}>Integrated GPU benchmarks for {data.attributes.title}</p>
					</div>
					<div className={"hidden lg:inline max-w-xl bg-white p-5 mt-5 lg:mt-0 md:p-5 rounded-2xl shadow-2xl aspect-square"}>
						<div className={"aspect-square bg-center bg-cover rounded-xl p-10"} style={{ backgroundImage: `url("${data.attributes.icon}")` }} />
					</div>
				</div>

				<main className={"mt-10"} style={{ lineHeight: "2" }}>
					<Markdown options={mdConfig}>{data.body}</Markdown>
				</main>
			</div>
		</div>
	);
}
