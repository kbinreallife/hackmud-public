function (c, a) {

    // Check there are no args, or args are not t
    if (!a || !a.t) {

        // Return usage instructions for the script
        return `
usage:
kbeeb.t1_scrape {t:#s.aon.public}

additional args:
check:"projects" - returns project names found in this corp script
check:"news"     - returns news page

kbeeb.t1_scrape {t:#s.aon.public,check:"projects"}

to enable spoilers please run kbeeb.t1_scrape{spoilers:true}
        `;
    } else if (a.spoilers === true) {

        // Return spoiler-related instructions
        return `
check:"biglist"  - returns locs from biglist
check:"names"    - returns usernames found in this corp script

kbeeb.t1_scrape {t:#s.aon.public,check:"names"}
        `;
    }

    // Our initial call
    var ret = a.t.call();

    // Check if the result includes "Shift"
    if (JSON.stringify(ret).includes("Shift")) {
        return { ok: false, error: JSON.stringify(ret) };
    } else {

        // Call a custom function to decorrupt output and store the result in 'ret'
        var ret = #fs.kbeeb.decorrupt({ t: a.t });

        // Split the decorrupted result to extract 'news' page and 'mission' page
        var news = ret.split("y.\n")[1].split(" |")[0];
        var mis = ret.split('W')[1].split(" | ")[1].split(" | ")[0];

        // Create an empty 'args' object
        var args = {};

        // Call npc corp with empty args, and decorrupt output
        ret = #fs.kbeeb.decorrupt({ t: a.t, args: args });

        // Split 'ret' to extract 'key' and remove unnecessary characters
        var key = ret.split(":")[2].split("\n")[0];
        key = key.replace(/['"]+/g, '');

        // Extract our navigation key from decorrupted output
        var nav = ret.split(":")[0].split("h ")[1];

        // set arguments to navigate to mission page
        args[nav] = mis;

        // Decorrupt mission page
        ret = #fs.kbeeb.decorrupt({ t: a.t, args: args });

        // Split output to extract password
        var pass = ret.split("strategy ")[1].split(" ")[0];

        // Set arguments to navigate to news page
        args[nav] = news;

        // Arguments that allow user to look at decorrupted news page
        if (a.check == "news") {

            // Set the arguments to navigate to the news page
            args[nav] = news;
            try {

                // Decorrupt output with updated 'args' and split the result
                return #fs.kbeeb.decorrupt({ t: a.t, args: args }).split(",2");
            } catch (e) {
                return { ok: false, error: "Failed to decorrupt" };
            }
        }

        // Decorrupt output with updated 'args' and store the result in 'ret'
        ret = #fs.kbeeb.decorrupt({ t: a.t, args: args });
        ret = ret.split("\n");

        // Initialize arrays for 'proj', 'names', 'final', and 'clean'
        var proj = [];
        var names = [];
        var final = [];
        var clean = [];


        //sort through text to find projects, usernames, etc.
        for (var entry of ret) {
            var found = "";
            var name = "";
            var val = entry.includes(found);

            try {
                switch (val) {
                case entry.includes("review of"):
                    found = entry.split("of ")[1].split(", the")[0]
                    proj.push(found)
                    break
                case entry.includes("developments on"):
                    found = entry.split("ts on ")[1].split(" p")[0]
                    proj.push(found)
                    name = entry.split(" -- ")[1].split(' w')[0]
                    names.push(name)
                    break
                case entry.includes("Look for "):
                    found = entry.split("k for ")[1].split(" in")[0]
                    proj.push(found)
                    break
                case entry.includes("backstarters for "):
                    found = entry.split("for ")[1].split(" sin")[0]
                    proj.push(found)
                    break
                case entry.includes("of project "):
                    found = entry.split("ect ")[1].split(" has")[0]
                    proj.push(found)
                    name = entry.split(" of pr")[0]
                    names.push(name)
                    break
                case entry.includes(" announces beta"):
                    found = entry.split(" announces beta")[0]
                    proj.push(found)
                    break
                case entry.includes("release date for"):
                    found = entry.split("date for ")[1].split(". ")[0]
                    proj.push(found)
                    break
                case entry.includes("in your mailbox"):
                    found = entry.split("Look for ")[1].split(" in you")[0]
                    proj.push(found)
                    break
                case entry.includes("continues on"):
                    found = entry.split("ues on ")[1].split(", h")[0]
                    proj.push(found)
                    break
                case entry.includes("wild success"):
                    found = entry.split(" of the ")[1].split(" software")[0]
                    proj.push(found)
                    if(a.check == 'biglist') {
                        var big = []
                        var big_final = []
                        args[nav] = found
                        args.list = true
                        big.push(#fs.kbeeb.decorrupt({t:a.t,args:args}))
                        for (var j = 0; j < big.length; j++) {
                            big_final.push(big[j].split(","))
                        }
                        return big_final
                    }
                    break
                case entry.includes("weird lately. "):
                    name = entry.split("ly. ")[1].split(",")[0]
                    names.push(name)
                }
            } catch (e) {
                return { ok: false, error: "Failed to decorrupt" }
            }
        }

        // Initialize an empty 'locs' array
        var locs = [];

        for (var i = 0; i < proj.length; i++) {

            // Iterate over project names and specify password
            args.p = pass;
            args.pass = pass;
            args.password = pass;
            args[nav] = key;
            args.project = proj[i];

            // Decorrupt locs
            locs.push(#fs.kbeeb.decorrupt({ t: a.t, args: args }));
        }

        // Initialize an empty 'clean' array
        var clean = [];

        //clean and format valid loc array
        for (var i = 0; i < locs.length; i++) {
            if (!locs[i].includes(" ") && !locs[i].includes("<")) {
                clean.push(locs[i]);
            }
        }

        // Initialize an empty 'proj_names' array
        var proj_names = [];

        // Arguments that allow user to look at project names found in this corp
        if (a.check == "projects") {
            for (let i = 0; i < proj.length; i++) {
                if (proj[i] != null) {
                    proj_names.push(proj[i]);
                }
            }
            return proj_names;
        }

        // Arguments that allow user to look at project names found in this corp
        if (a.check == "names") {
            if(names.length == 0){
                return "no names found";
            } else {
                return names;
            }
        }

        //Iterate through location information and format in list seperated by newline instead of comma
        for (var j = 0; j < clean.length; j++) {
            final.push(clean[j].split(","));
        }

        //return clean and valid locs
        return final;
    }
}
