import { Link } from "@remix-run/react";
import siteinfo from "~/util/siteinfo";
import React from "react";

export default () => {
	return (
		<div className={"mx-3 mb-5 md:mt-5 2xl:mx-0"}>
			<nav className="border-gray-200 px-2 sm:px-4 py-2.5 rounded 2xl:px-0">
				<div className="container flex flex-wrap justify-between items-center mx-auto">
					<Link to="/" className="flex items-center">
							<span
								className="self-center text-xl font-semibold whitespace-nowrap">Exerra {siteinfo.title}</span>
					</Link>
				</div>
			</nav>
		</div>
	)
}