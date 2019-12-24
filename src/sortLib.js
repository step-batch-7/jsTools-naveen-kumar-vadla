"use strict";

const formatContent = (content, delimiter, options) => {
	const formattedContent = {};

	content.map(line => {
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
	const sortedContent = [];
	const { options, content, delimiter } = fileContentWithOptions;
	if (options.includes("-k")) {
		const formattedContent = formatContent(content, delimiter, options);
		const keys = Object.keys(formattedContent).sort();

		keys.map(key => {
			sortedContent.push(...formattedContent[key].sort());
		});
	}
	return sortedContent;
};

const parseUserOptions = userOptions => {
	const optKIdx = userOptions.indexOf("-k");
	const options = userOptions.splice(optKIdx, 2);
	const fileNames = userOptions.slice();

	return { fileNames, options, delimiter: " " };
};

const performSortOperation = (userArgs, fsUtils) => {
	const { readFileSync, existsSync } = fsUtils;
	const { fileNames, options, delimiter } = parseUserOptions(userArgs);

	if (isNaN(+options[1]) || !(options[1] > 0))
		return {
			sortedData: "",
			error: `sort: -k ${options[1]}: Invalid argument`
		};

	if (!existsSync(fileNames[0]))
		return { sortedData: "", error: `sort: No such file or directory` };

	const content = readFileSync(fileNames[0], "utf-8").split("\n");
	const fileContentWithOptions = { options, content, delimiter };
	const sortedData = sortContent(fileContentWithOptions);

	return { sortedData: sortedData.join("\n"), error: "" };
};

module.exports = {
	sortContent,
	formatContent,
	parseUserOptions,
	performSortOperation
};
