import type { MetaFunction } from "@remix-run/cloudflare";
import {
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from "@remix-run/react";

import styles from "./styles/app.css"

export function links() {
	return [ { rel: "stylesheet", href: styles }, {
		rel: "icon",
		href: "https://cdn.exerra.xyz/png/pfp.png",
		type: "image/png",
	} ]
}

export const meta: MetaFunction = () => ({
	charset: "utf-8",
	title: "Exerra Bench",
	description: "GPU benchmarks for games ranging from indie platformers to AAA shooters",
	"og:type": "website",
	"og:title": "Exerra Bench",
	"og:description": "GPU benchmarks for games ranging from indie platformers to AAA shooters",
	"twitter:card": "summary_large_image",
	"twitter:image": "https://cdn.exerra.xyz/png/pfp.png",
	viewport: "width=device-width,initial-scale=1",
	keywords: "benchmarks, exerra, gpu, igpu, integrated gpu, game"
});

export default function App() {
	return (
		<Document>
			<Layout>
				<Outlet/>
			</Layout>
		</Document>
	);
}

// @ts-ignore
function Document( { children, title } ) {
	return (
		<html lang="en">
		<head>
			<meta charSet="utf-8"/>
			<meta name="viewport" content="width=device-width,initial-scale=1"/>
			{title ? <title>{title}</title> : null}
			<Meta/>
			<Links/>
		</head>
		<body>
		{children}
		<ScrollRestoration/>
		<Scripts/>
		{process.env.NODE_ENV === "development" && <LiveReload/>}
		<script src="https://kit.fontawesome.com/30b73f9101.js" crossOrigin="anonymous"></script>
		</body>
		</html>
	);
}

// @ts-ignore
function Layout( { children } ) {
	return (
		<div>
			<div>
				<div className={"bg-body font-poppins"}>{children}</div>
			</div>
			<footer className={"p-10"}>
				<p className={"text-center"}>&copy; Exerra</p>
			</footer>
		</div>
	);
}
