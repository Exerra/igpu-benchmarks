import React from "react";

export default class ReviewWarning extends React.Component<any, any> {
	render() {
		return (
			<div className={"p-10 rounded-2xl bg-center bg-cover lg:flex lg:justify-between items-center bg-orange-100/50 grow"}>
				<div>
					<h1 className={"text-5xl font-bold md:text-6xl text-orange-400"}>Warning</h1><br />
					<p className={"text-lg"}>{this.props.children}</p>
				</div>
				<div className={"hidden lg:inline max-w-xl bg-white p-5 mt-5 lg:mt-0 md:p-5 rounded-2xl shadow-xl aspect-square"}>
					<p className={"text-5xl text-orange-400"}><i className="fa-solid fa-triangle-exclamation"></i></p>
				</div>
			</div>
		);
	}
}