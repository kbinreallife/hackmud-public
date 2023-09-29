function (c, a) {
	if (!a || !a.t) {
		return "\nusage: tk.t1_scraper{t:#s.aon.public}\n\nadditional args:\n\ncheck:\"news\" - returns news page\ncheck:\"projects\" - returns project names found in this corp script";
	}

	var ret = a.t.call();

	if (JSON.stringify(ret).includes("Shift")) {
		return { ok: false, error: JSON.stringify(ret) };
	} else {
		var ret = #fs.kbeeb.decorrupt({ t: a.t });

		var news = ret.split("y.\n")[1].split(" |")[0];
		var mis = ret.split(" | ")[1].split(" |")[0];

		var args = {};

		ret = #fs.kbeeb.decorrupt({ t: a.t, args: args });

		var key = ret.split(":")[2].split("\n")[0];
		key = key.replace(/['"]+/g, '');

		var nav = ret.split(":")[0].split("h ")[1];

		args[nav] = mis;

		var ret = #fs.kbeeb.decorrupt({ t: a.t, args: args });

		var pass = ret.split("strategy ")[1].split(" ")[0];

		args[nav] = news;

		if (a.check == "news") {
			[nav].news = args;
			try {
				return #fs.kbeeb.decorrupt({ t: a.t, args: args }).split(",2");
			} catch (e) {
				return { ok: false, error: "Failed to decorrupt" };
			}
		}

		ret = #fs.kbeeb.decorrupt({ t: a.t, args: args });
		ret = ret.split("\n");

		var proj = [];

		for (var entry of ret) {
			var found = "";
			var val = entry.includes(found);

			try {
				switch (val) {
					case entry.includes("review of"):
						found = entry.split("of ")[1].split(", the")[0];
						proj.push(found);
						break;
					case entry.includes("developments on"):
						found = entry.split("ts on ")[1].split(" p")[0];
						proj.push(found);
						break;
					case entry.includes("Look for "):
						found = entry.split("k for ")[1].split(" in")[0];
						proj.push(found);
						break;
					case entry.includes("backstarters for "):
						found = entry.split("for ")[1].split(" sin")[0];
						proj.push(found);
						break;
					case entry.includes("of project "):
						found = entry.split("ect ")[1].split(" has")[0];
						proj.push(found);
						break;
					case entry.includes(" announces beta"):
						found = entry.split(" announces beta")[0];
						proj.push(found);
						break;
					case entry.includes("release date for"):
						found = entry.split("date for ")[1].split(". ")[0];
						proj.push(found);
						break;
					case entry.includes("in your mailbox"):
						found = entry.split("Look for ")[1].split(" in you")[0];
						proj.push(found);
						break;
					case entry.includes("continues on"):
						found = entry.split("ues on ")[1].split(", h")[0];
						proj.push(found);
						break;
					case entry.includes("wild success"):
						found = entry.split(" of the ")[1].split(" software")[0];
						proj.push(found);
						break;
				}
			} catch (e) {
				return { ok: false, error: "Failed to decorrupt" };
			}
		}

		var locs = [];

		for (var i = 0; i < proj.length; i++) {
			args.p = pass;
			args.pass = pass;
			args.password = pass;
			args[nav] = key;
			args.project = proj[i];
			locs.push(#fs.kbeeb.decorrupt({ t: a.t, args: args }));
		}

		var clean = [];

		for (var i = 0; i < locs.length; i++) {
			if (!locs[i].includes(" ")) {
				clean.push(locs[i]);
			}
		}

		var proj_names = [];

		if (a.check == "projects") {
			for (let i = 0; i < proj.length; i++) {
				if (proj[i] != null) {
					proj_names.push(proj[i]);
				}
			}
			return proj_names;
		}

		var final = [];

		for (var j = 0; j < clean.length; j++) {
			final.push(clean[j].split(","));
		}

		return final;
	}
}
