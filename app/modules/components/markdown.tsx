import React from "react";

class H1 extends React.Component<any, any> {
	render() {
		return (
			<>
				<div className={"mt-10 mb-2"}>
					<h1 className={"text-4xl md:text-5xl font-bold mb-5"}>{this.props.children}</h1>
					<hr />
				</div>
			</>
		)
	}
}

class H2 extends React.Component<any, any> {
	render() {
		return (
			<h2 className={"text-3xl md:text-4xl font-bold mt-7 text-gray-800"}>{this.props.children}</h2>
		)
	}
}

class H3 extends React.Component<any, any> {
	render() {
		return (
			<h3 className={"text-xl md:text-2xl font-bold mt-7 text-gray-700"}>{this.props.children}</h3>
		)
	}
}

class EmptyImg extends React.Component {
	render() {
		return <></>
	}
}

let emptyComponentConf = {
	component: EmptyImg
}

export let mdConfig = {
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