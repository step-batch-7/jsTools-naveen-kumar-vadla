"use strict";

const formatFileContent = (content, delimiter, options) => {
	const formattedContent = {};

	content.forEach(line => {
		const allKeys = Object.keys(formattedContent);
		const splittedLine = line.split(delimiter);
		const key = String(splittedLine[options[1] - 1]);

		if (!allKeys.includes(key)) {
			formattedContent[key] = [line];
		} else {
			formattedContent[key].push(line);
		}
	});

	return formattedContent;
};

const sortContent = fileContentWithOptions => {
	let sortedContent = [];
	const { options, content, delimiter } = fileContentWithOptions;
	if (options.includes("-k")) {
		const formattedContent = formatFileContent(content, delimiter, options);
		const keys = Object.keys(formattedContent).sort();

		keys.forEach(key => {
			sortedContent.push(...formattedContent[key].sort());
		});
	}
	return sortedContent;
};

const parseUserOptions = userOptions => {
	const optKIdx = userOptions.indexOf("-k");
	const options = userOptions.splice(optKIdx, 2);
	const fileName = userOptions.slice();
	const delimiter = " ";

	return { fileName, options, delimiter };
};

module.exports = {
	sortContent,
	formatFileContent,
	parseUserOptions
};
