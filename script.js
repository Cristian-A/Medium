
const filenames = Deno.args;
for (let filename of filenames) {
	const decoder = new TextDecoder('utf-8');
	const text = decoder.decode(await Deno.readFile(filename));
	filename = filename.replace(/\.(.*?)$/g, '.svg');
	await Deno.writeTextFile(filename, processSVG(text));
}

function process(line) {
	line = line.replace(/"/g, '§');
	line = line.replace(/(print|break|continue|do|else|for|if|import|loop|repeat|rest|return|until|while|new)/g, '<tspan class="keyword">$1</tspan>');
	line = line.replace(/(var|vec|con|mat|func|proc)/g, '<tspan class="specific">$1</tspan>');
	line = line.replace(/(([0-9]+(?:\.[0-9]+(?:[e][-]?[0-9]+)?)?i)|([0-9]+\.[0-9]+(?:[e][-]?[0-9]+)?)|((?:0[x][0-9A-F]+)|(?:0b[01]+)|(?:0o[0-7]+)|(?:0d[0-9]+)|(?:[0-9]+)))/g, '<tspan class="numeric">$1</tspan>');
	line = line.replace(/(\b)(true|false|(?:<[01]\\|)|(?:\\|[01]>)|infinity|undefined)(\b)$/g, '$1<tspan class="literal">$2</tspan>$3');
	line = line.replace(/(\b)(Boolean|Byte|Character|Complex|Imaginary|Integer|Real|String|Vector|Matrix)(\b)/g, '$1<tspan class="type">$2</tspan>$3');
	line = line.replace(/(<[A-Za-z_][A-Za-z0-9_]*\|[A-Za-z_][A-Za-z0-9_]*>)$/g, '<tspan class="dirac">$1</tspan>');
	line = line.replace(/(\|[A-Za-z_][A-Za-z0-9_]*>)|(?:<[A-Za-z_][A-Za-z0-9_]*\|)|(?:\|[A-Za-z_][A-Za-z0-9_]*\|)$/g, '<tspan class="dirac">$1</tspan>');
	line = line.replace(/(\b)([A-Za-z_][A-Za-z0-9_]*)([ \t]*\()/g, '$1<tspan class="method">$2</tspan>$3');
	line = line.replace(/(§(?:[^\\§])*§)/g, '<tspan class="string">$1</tspan>');
	line = line.replace(/('.')$/g, '<tspan class="string">$1</tspan>');
	line = line.replace(/(\/[\/]+.*)$/g, '<tspan class="comment">$1</tspan>');
	line = line.replace(/§/g, '"');
	return line;
}

function processSVG(file) {
	file = file.split(/\r?\n/);
	const height = 15;
	const interLine = 10;
	const width = height >> 1; // (height / 2)
	const padding = 10;
	let svg = '\t<style>\n';
	svg += `\t\ttext { fill: #474747; font-family: Menlo, Monaco, monospace; font-size: ${height}; }\n`;
	svg += '\t\t.keyword { fill: #00B196 !important; }\n';
	svg += '\t\t.specific { fill: #E40073 !important; }\n';
	svg += '\t\t.comment { fill: #6E6E6E !important; }\n';
	svg += '\t\t.dirac { fill: #0077E5 !important; }\n';
	svg += '\t\t.type { fill: #00A2D9 !important; }\n';
	svg += '\t\t.string { fill: #009FAB !important; }\n';
	svg += '\t\t.numeric { fill: #DC4600 !important; }\n';
	svg += '\t\t.literal { fill: #E62042 !important; }\n';
	svg += '\t\t.method { fill: #9B00C1 !important; }\n';
	svg += '\t</style>\n';
	let y = 0;
	for (let i = 0; i < file.length; i += 1) {
		let line = file[i].replace(/^    /g, '\t');
		if (line.length == 0) continue;
		let t = 0;
		while (t < line.length) {
			if (line[t] != '\t') break;
			t += 1;
		}
		line = line.substring(t);
		line = process(line);
		const x = t * width * 4;
		y = (i + 1) * (height + interLine);
		svg += `\t<text x="${x}" y="${y}">${line}</text>\n`;
	}
	y += (padding << 1) + interLine;
	svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="padding: ${padding} ${padding + interLine}; background: #fff;" height="${y}" width="600">\n` + svg + '</svg>';
	return svg;
}

